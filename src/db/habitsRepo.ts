import { and, asc, eq } from "drizzle-orm";
import type { CategoryKey } from "../features/habits/categories";
import { db } from "./client";
import { habitLogs, habits } from "./schema";

/**
 * Repositorio de hábitos: la única puerta entre la app y la base de datos.
 * Las pantallas llaman a estas funciones y nunca escriben SQL directo.
 */

// Lo que la pantalla de Hoy necesita mostrar de cada hábito.
export type HabitForToday = {
  id: string;
  name: string;
  category: string;
  doneToday: boolean;
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

  // Un hábito cuenta como "hecho hoy" si tiene un log de hoy que no sea "missed".
  const doneHabitIds = new Set(
    todayLogs.filter((log) => log.status !== "missed").map((log) => log.habitId)
  );

  return activeHabits.map((h) => ({
    id: h.id,
    name: h.name,
    category: h.category,
    doneToday: doneHabitIds.has(h.id),
  }));
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

// Marca / desmarca el cumplimiento de hoy.
// Si ya había un registro hoy, lo quita; si no, inserta uno "completed".
// (El estado "minimal"/"missed" del check-in completo llega en un bloque futuro.)
export async function toggleToday(habitId: string): Promise<void> {
  const today = todayKey();

  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, today)));

  if (existing.length > 0) {
    await db
      .delete(habitLogs)
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, today)));
  } else {
    await db.insert(habitLogs).values({
      id: genId(),
      habitId,
      date: today,
      status: "completed",
    });
  }
}

// Borra un hábito y todos sus registros.
// (Borramos los logs a mano además del cascade, por robustez.)
export async function deleteHabit(habitId: string): Promise<void> {
  await db.delete(habitLogs).where(eq(habitLogs.habitId, habitId));
  await db.delete(habits).where(eq(habits.id, habitId));
}
