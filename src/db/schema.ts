import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Schema de la base de datos de ASANO (SQLite vía Drizzle).
 *
 * Es el subconjunto del modelo de datos (doc 03) que la app necesita hoy.
 * En bloques siguientes se agregan: habit_schedules, adjustments, programs,
 * etc. Drizzle permite sumar tablas con migraciones incrementales, así que
 * no hace falta definir todo de una.
 */

// ── Tabla: habits ─────────────────────────────────────────────────
// Un hábito que la persona quiere sostener.
export const habits = sqliteTable("habits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // "La versión de 2 minutos" del hábito. Opcional por ahora; se vuelve
  // obligatoria cuando construyamos el flujo de creación real (Ciclo ASA).
  minimalAction: text("minimal_action"),
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
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  // Un solo registro por hábito por día: evita duplicados.
  (t) => [uniqueIndex("habit_date_unique").on(t.habitId, t.date)]
);

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
