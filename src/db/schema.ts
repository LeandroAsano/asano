import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Schema de la base de datos de ASANO (SQLite vía Drizzle).
 *
 * Es el subconjunto del modelo de datos (doc 03) que la app necesita hoy.
 * En bloques siguientes se agregan: habit_schedules, adjustments, programs,
 * etc. Drizzle permite sumar tablas con migraciones incrementales, así que
 * no hace falta definir todo de una.
 */

// ── Tabla: habits ─────────────────────────────────────────────────
// Un hábito que la persona quiere sostener. Incluye su "Sistema" (Ciclo
// ASA): acción mínima, frecuencia, ancla (horario/disparador) y dificultad.
// El Sistema va inline en la fila porque es 1:1 con el hábito (más simple
// que una tabla aparte para el MVP).
export const habits = sqliteTable("habits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // Categoría con ícono (salud | movimiento | foco | calma | aprendizaje |
  // finanzas | dejar). "dejar" = hábito de abstinencia (dejar de fumar, etc.);
  // por ahora comparte la mecánica; la lógica invertida llega en el check-in.
  category: text("category").notNull().default("salud"),
  // "La versión de 2 minutos" del hábito.
  minimalAction: text("minimal_action"),
  // facil | media | dificil — base para futuras sugerencias de ajuste.
  difficulty: text("difficulty").notNull().default("media"),
  // ── Frecuencia ──
  // daily | specific_days | times_per_week
  frequencyType: text("frequency_type").notNull().default("daily"),
  // Si specific_days: días como CSV "1,3,5" (1=lunes … 7=domingo).
  daysOfWeek: text("days_of_week"),
  // Si times_per_week: cuántas veces.
  timesPerWeek: integer("times_per_week"),
  // ── Ancla ──
  // time | trigger
  anchorType: text("anchor_type").notNull().default("time"),
  // Si anchorType = time: "HH:MM".
  timeOfDay: text("time_of_day"),
  // Si anchorType = trigger: "después del café".
  triggerText: text("trigger_text"),
  // active | paused | archived. Pausar/archivar no borra el historial.
  status: text("status").notNull().default("active"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ── Tabla: habit_logs ─────────────────────────────────────────────
// Un registro diario. Reemplaza al viejo `completedDates`: en vez de una
// lista dentro del hábito, cada día es una fila que apunta al hábito.
export const habitLogs = sqliteTable(
  "habit_logs",
  {
    id: text("id").primaryKey(),
    habitId: text("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    // Día local en formato YYYY-MM-DD.
    date: text("date").notNull(),
    // completed | minimal | missed. `minimal` (acción mínima) cuenta para
    // la consistencia — es parte del principio anti-culpa de ASANO.
    status: text("status").notNull(),
    // Si status = missed: por qué (tiempo | olvido | energia | momento |
    // dificultad | otro). Alimenta la sugerencia de ajuste de ASA.
    reason: text("reason"),
    // Nota opcional de la persona.
    note: text("note"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  // Un solo registro por hábito por día: evita duplicados.
  (t) => [uniqueIndex("habit_date_unique").on(t.habitId, t.date)]
);

// ── Tabla: adjustments ────────────────────────────────────────────
// Un ajuste del "Sistema" del hábito, sugerido por ASA a partir de una
// falla y (si la persona lo acepta) aplicado. Es el historial que muestra
// que el sistema mejora — el diferenciador de ASANO (doc 03 ADJUSTMENT).
export const adjustments = sqliteTable("adjustments", {
  id: text("id").primaryKey(),
  habitId: text("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  // El log de falla que lo originó (opcional).
  sourceLogId: text("source_log_id"),
  // El motivo de la falla que disparó la sugerencia.
  reason: text("reason"),
  // lower_difficulty | move_time | focus_minimal
  type: text("type").notNull(),
  // 1 si la persona lo aplicó.
  applied: integer("applied", { mode: "boolean" }).notNull().default(false),
  suggestedAt: text("suggested_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  appliedAt: text("applied_at"),
});

// ── Tabla: profile ────────────────────────────────────────────────
// El contexto capturado en el onboarding (doc 02 §3 / doc 03 PROFILE).
// Fila única: en el MVP hay una sola persona por teléfono (local-first,
// sin cuentas), así que se guarda con un id fijo ("local") en vez de
// vincularla a un usuario. Si más adelante se suma auth, se agrega
// userId y esto deja de ser singleton.
export const profile = sqliteTable("profile", {
  id: text("id").primaryKey().default("local"),
  goal: text("goal"),
  strugglingHabit: text("struggling_habit"),
  timeBudget: text("time_budget"),
  preferredMoment: text("preferred_moment"),
  commonBlocker: text("common_blocker"),
  // sereno | directo | analitico | flexible — define el tono de ASA.
  accompanimentStyle: text("accompaniment_style"),
  completedAt: text("completed_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// Tipos inferidos automáticamente del schema — se usan en toda la app en
// lugar del viejo `src/types/habit.ts`.
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitLog = typeof habitLogs.$inferSelect;
export type HabitLogStatus = "completed" | "minimal" | "missed";
export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
export type AccompanimentStyle = "sereno" | "directo" | "analitico" | "flexible";
export type Adjustment = typeof adjustments.$inferSelect;
export type AdjustmentType = "lower_difficulty" | "move_time" | "focus_minimal";
export type MissReason = "tiempo" | "olvido" | "energia" | "momento" | "dificultad" | "otro";
