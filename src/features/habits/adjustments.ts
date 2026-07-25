import type { AdjustmentType, MissReason } from "../../db/schema";

/**
 * Lógica del ajuste que sugiere ASA a partir de una falla.
 *
 * Cada motivo mapea a un ajuste concreto y determinista sobre el hábito,
 * para que "aplicar de una" sea honesto (no una promesa vaga). Los ajustes
 * posibles tocan solo dos campos que podemos cambiar sin pedir más datos:
 * la dificultad y el horario.
 */

// Motivos de falla (para el selector del check-in).
export const MISS_REASONS: { value: MissReason; label: string }[] = [
  { value: "tiempo", label: "Falta de tiempo" },
  { value: "olvido", label: "Me olvidé" },
  { value: "energia", label: "Sin energía" },
  { value: "momento", label: "El momento no funcionó" },
  { value: "dificultad", label: "Fue demasiado difícil" },
  { value: "otro", label: "Otro" },
];

const DIFFICULTY_STEPS = ["dificil", "media", "facil"] as const;
const MOMENTS = ["08:00", "13:00", "18:00", "21:00"];

type HabitLike = {
  anchorType: string;
  difficulty: string;
  timeOfDay: string | null;
};

// Qué ajuste propone ASA según el motivo y el tipo de ancla del hábito.
// (Mover el horario solo aplica si el hábito se ancla en un horario; si se
// ancla en un disparador, caemos a un ajuste que sí aplica.)
export function proposeAdjustment(habit: HabitLike, reason: MissReason): AdjustmentType {
  const timeAnchored = habit.anchorType === "time";
  switch (reason) {
    case "dificultad":
      return "lower_difficulty";
    case "tiempo":
      return "focus_minimal";
    case "energia":
      return timeAnchored ? "move_time" : "lower_difficulty";
    case "momento":
    case "olvido":
      return timeAnchored ? "move_time" : "focus_minimal";
    default:
      return "focus_minimal";
  }
}

// Un paso más fácil en la escala de dificultad (dificil → media → facil).
function easierDifficulty(current: string): string {
  const i = DIFFICULTY_STEPS.indexOf(current as (typeof DIFFICULTY_STEPS)[number]);
  if (i < 0) return "media";
  return DIFFICULTY_STEPS[Math.min(i + 1, DIFFICULTY_STEPS.length - 1)];
}

// El siguiente momento del día distinto al actual (rotación).
function nextMoment(current: string | null): string {
  const i = current ? MOMENTS.indexOf(current) : -1;
  if (i < 0) return "18:00"; // si no era un preset, proponemos la tarde
  return MOMENTS[(i + 1) % MOMENTS.length];
}

// El cambio concreto que produce un ajuste (campos a actualizar en el hábito).
export function computeAdjustmentChange(
  habit: HabitLike,
  type: AdjustmentType
): { difficulty?: string; timeOfDay?: string } {
  switch (type) {
    case "lower_difficulty":
      return { difficulty: easierDifficulty(habit.difficulty) };
    case "focus_minimal":
      return { difficulty: "facil" };
    case "move_time":
      return { timeOfDay: nextMoment(habit.timeOfDay) };
  }
}

const DIFFICULTY_LABEL: Record<string, string> = {
  facil: "fácil",
  media: "media",
  dificil: "difícil",
};

// Descripción corta y transparente del cambio, para mostrar al aplicar.
export function describeChange(
  habit: HabitLike,
  change: { difficulty?: string; timeOfDay?: string }
): string {
  if (change.difficulty) {
    return `Dificultad: ${DIFFICULTY_LABEL[habit.difficulty] ?? habit.difficulty} → ${DIFFICULTY_LABEL[change.difficulty] ?? change.difficulty}`;
  }
  if (change.timeOfDay) {
    return `Horario: ${habit.timeOfDay ?? "—"} → ${change.timeOfDay}`;
  }
  return "";
}
