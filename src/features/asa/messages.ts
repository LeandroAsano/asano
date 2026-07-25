import type { AccompanimentStyle } from "../../db/schema";

/**
 * Voz de ASA: mensajes por (evento × estilo de acompañamiento).
 *
 * Primera versión para validar y ajustar el tono (ver doc 08, B2). ASA es
 * sereno, sin culpa, sin lenguaje de gurú: analiza el sistema, no a la
 * persona. Español rioplatense, 1–2 frases.
 *
 * El estilo lo elige la persona en el onboarding (profile.accompanimentStyle).
 */

export type AsaEvent =
  | "completed"
  | "minimal"
  | "missedIntro"
  | "missedIntroQuit"
  | "adj_lower_difficulty"
  | "adj_move_time"
  | "adj_focus_minimal"
  | "applied"
  | "dismissed";

type StyleMap = Record<AccompanimentStyle, string>;

const MESSAGES: Record<AsaEvent, StyleMap> = {
  completed: {
    sereno: "Bien ahí. Un ladrillo más.",
    directo: "Hecho. Seguimos.",
    analitico: "Registrado. Sumás consistencia.",
    flexible: "Genial, salió hoy.",
  },
  minimal: {
    sereno: "Con la acción mínima alcanza. Repetir es lo que construye.",
    directo: "La mínima cuenta. Listo.",
    analitico: "Acción mínima = mantenés la consistencia igual.",
    flexible: "Perfecto, hoy con lo mínimo va.",
  },
  missedIntro: {
    sereno: "El hábito falló, no vos. Miremos el sistema. ¿Qué pasó?",
    directo: "No salió. ¿Por qué?",
    analitico: "Un fallo es un dato. ¿Qué lo causó?",
    flexible: "Está bien, pasa. ¿Qué se interpuso?",
  },
  missedIntroQuit: {
    sereno: "Una recaída no borra el progreso. ¿Qué la disparó?",
    directo: "Recaíste. ¿Qué lo gatilló?",
    analitico: "La recaída tiene un disparador. ¿Cuál fue?",
    flexible: "Tranqui, volver es parte. ¿Qué pasó?",
  },
  adj_lower_difficulty: {
    sereno: "Bajemos un poco la exigencia. Sostener vale más que exigir.",
    directo: "Lo hacemos más fácil.",
    analitico: "Menos dificultad sube la probabilidad de repetir.",
    flexible: "Probemos una versión más liviana.",
  },
  adj_move_time: {
    sereno: "Quizás el momento no ayuda. Probemos otro horario.",
    directo: "Cambiemos el horario.",
    analitico: "El horario actual no rinde. Movámoslo.",
    flexible: "Probemos moverlo a otro rato del día.",
  },
  adj_focus_minimal: {
    sereno: "Los días complicados, alcanza con la acción mínima.",
    directo: "Enfocá en la acción mínima.",
    analitico: "Apuntar a la acción mínima mantiene la consistencia con poco tiempo.",
    flexible: "Cuando no da, la mínima y listo.",
  },
  applied: {
    sereno: "Listo, ajustado. Mañana lo probamos así.",
    directo: "Hecho. Ajustado.",
    analitico: "Ajuste aplicado. Vemos cómo responde esta semana.",
    flexible: "Cambiado. A ver si te acomoda mejor.",
  },
  dismissed: {
    sereno: "Está bien. Registramos el intento igual.",
    directo: "Ok, lo dejamos así.",
    analitico: "Anotado, sin cambios por ahora.",
    flexible: "Dale, lo dejamos como está.",
  },
};

const DEFAULT_STYLE: AccompanimentStyle = "sereno";

export function asa(event: AsaEvent, style?: string | null): string {
  const s = (style as AccompanimentStyle) in MESSAGES[event]
    ? (style as AccompanimentStyle)
    : DEFAULT_STYLE;
  return MESSAGES[event][s];
}
