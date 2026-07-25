import { and, asc, eq } from "drizzle-orm";
import {
  computeAdjustmentChange,
  proposeAdjustment,
} from "../features/habits/adjustments";
import type { CategoryKey } from "../features/habits/categories";
import { db } from "./client";
import {
  adjustments,
  habitLogs,
  habits,
  type AdjustmentType,
  type HabitLogStatus,
  type MissReason,
} from "./schema";

/**
 * Repositorio de hábitos: la única puerta entre la app y la base de datos.
 * Las pantallas llaman a estas funciones y nunca escriben SQL directo.
 */

// Lo que la pantalla de Hoy necesita mostrar de cada hábito.
export type HabitForToday = {
  id: string;
  name: string;
  category: string;
  minimalAction: string | null;
  todayStatus: HabitLogStatus | null;
  doneToday: boolean; // completed o minimal
};

// Ajuste propuesto por ASA para mostrar en el check-in.
export type ProposedAdjustment = {
  adjustmentId: string;
  type: AdjustmentType;
  change: { difficulty?: string; timeOfDay?: string };
  habit: { anchorType: string; difficulty: string; timeOfDay: string | null };
};

// Datos para crear un hábito (el "Sistema" del Ciclo ASA).
export type CreateHabitInput = {
  name: string;
  category: CategoryKey;
  minimalAction?: string;
  difficulty: "facil" | "media" | "dificil";
  frequencyType: "daily" | "specific_days" | "times_per_week";
  daysOfWeek?: number[]; // solo si specific_days
  timesPerWeek?: number; // solo si times_per_week
  anchorType: "time" | "trigger";
  timeOfDay?: string; // "HH:MM", solo si anchorType = time
  triggerText?: string; // solo si anchorType = trigger
};

// ── Helpers ───────────────────────────────────────────────────────

// Id único simple (suficiente para local; luego se puede usar uuid).
function genId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

// Día de HOY en formato YYYY-MM-DD, en la zona horaria del teléfono.
// (Las reglas más finas de "a qué hora corta el día" se definen más adelante.)
function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Lecturas ──────────────────────────────────────────────────────

// Hábitos activos + si ya se cumplieron (completo o acción mínima) hoy.
export async function listHabitsForToday(): Promise<HabitForToday[]> {
  const today = todayKey();

  const activeHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.status, "active"))
    .orderBy(asc(habits.createdAt));

  const todayLogs = await db
    .select()
    .from(habitLogs)
    .where(eq(habitLogs.date, today));

  const statusByHabit = new Map(todayLogs.map((log) => [log.habitId, log.status]));

  return activeHabits.map((h) => {
    const todayStatus = (statusByHabit.get(h.id) as HabitLogStatus | undefined) ?? null;
    return {
      id: h.id,
      name: h.name,
      category: h.category,
      minimalAction: h.minimalAction,
      todayStatus,
      doneToday: todayStatus === "completed" || todayStatus === "minimal",
    };
  });
}

// ── Escrituras ────────────────────────────────────────────────────

// Crea un hábito nuevo con todo su Sistema. Devuelve su id.
export async function createHabit(input: CreateHabitInput): Promise<string> {
  const id = genId();
  await db.insert(habits).values({
    id,
    name: input.name.trim(),
    category: input.category,
    minimalAction: input.minimalAction?.trim() || null,
    difficulty: input.difficulty,
    frequencyType: input.frequencyType,
    daysOfWeek: input.daysOfWeek?.length ? input.daysOfWeek.join(",") : null,
    timesPerWeek: input.timesPerWeek ?? null,
    anchorType: input.anchorType,
    timeOfDay: input.anchorType === "time" ? input.timeOfDay ?? null : null,
    triggerText: input.anchorType === "trigger" ? input.triggerText?.trim() || null : null,
  });
  return id;
}

// Registra el estado de hoy (completed | minimal | missed). Un solo registro
// por hábito por día: si ya existía, lo actualiza (upsert). Devuelve el id
// del log (necesario para vincular un ajuste a la falla que lo originó).
export async function setTodayStatus(
  habitId: string,
  status: HabitLogStatus,
  reason?: MissReason
): Promise<string> {
  const today = todayKey();
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, today)));

  if (existing.length > 0) {
    const id = existing[0].id;
    await db
      .update(habitLogs)
      .set({ status, reason: reason ?? null })
      .where(eq(habitLogs.id, id));
    return id;
  }
  const id = genId();
  await db.insert(habitLogs).values({
    id,
    habitId,
    date: today,
    status,
    reason: reason ?? null,
  });
  return id;
}

// Limpia el registro de hoy (volver a "sin marcar").
export async function clearTodayStatus(habitId: string): Promise<void> {
  const today = todayKey();
  await db
    .delete(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, today)));
}

// A partir de una falla, ASA propone un ajuste concreto. Guarda la sugerencia
// (applied=false) y devuelve qué cambiaría, para mostrarlo en el check-in.
export async function proposeAdjustmentForHabit(
  habitId: string,
  reason: MissReason,
  sourceLogId?: string
): Promise<ProposedAdjustment | null> {
  const rows = await db.select().from(habits).where(eq(habits.id, habitId));
  const h = rows[0];
  if (!h) return null;

  const type = proposeAdjustment(h, reason);
  const change = computeAdjustmentChange(h, type);
  const adjustmentId = genId();
  await db.insert(adjustments).values({
    id: adjustmentId,
    habitId,
    sourceLogId: sourceLogId ?? null,
    reason,
    type,
    applied: false,
  });

  return {
    adjustmentId,
    type,
    change,
    habit: { anchorType: h.anchorType, difficulty: h.difficulty, timeOfDay: h.timeOfDay },
  };
}

// Aplica un ajuste: edita el hábito con el cambio y marca la sugerencia
// como aplicada.
export async function applyAdjustment(
  adjustmentId: string,
  habitId: string,
  change: { difficulty?: string; timeOfDay?: string }
): Promise<void> {
  if (change.difficulty || change.timeOfDay) {
    await db.update(habits).set(change).where(eq(habits.id, habitId));
  }
  await db
    .update(adjustments)
    .set({ applied: true, appliedAt: new Date().toISOString() })
    .where(eq(adjustments.id, adjustmentId));
}

// Borra un hábito y todos sus registros.
// (Borramos los logs a mano además del cascade, por robustez.)
export async function deleteHabit(habitId: string): Promise<void> {
  await db.delete(habitLogs).where(eq(habitLogs.habitId, habitId));
  await db.delete(habits).where(eq(habits.id, habitId));
}
