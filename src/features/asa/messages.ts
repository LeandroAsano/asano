import type { AccompanimentStyle } from "../../db/schema";

/**
 * Voz de ASA: mensajes por (evento × estilo de acompañamiento).
 *
 * Tono: sereno, sin culpa, sin lenguaje de gurú, **neuroafirmativo**.
 * ASANO es "hábitos para mentes que funcionan distinto" (ver doc 10 de
 * F:\leandro\Asano\Producto): está diseñada pensando en cómo funcionan las
 * mentes con TDAH — energía variable, parálisis de inicio, se va el tiempo.
 *
 * ⚠️ REGLA NO NEGOCIABLE: ASANO es una herramienta de organización, NO un
 * producto médico. Ningún mensaje puede afirmar que trata, mejora o maneja
 * el TDAH ni ningún síntoma, ni prometer resultados de salud, ni sugerir
 * que reemplaza terapia o medicación. Se habla de *experiencias*, nunca de
 * síntomas a tratar.
 *
 * Principios del copy:
 * - El sistema falla, no la persona. Nunca vergüenza.
 * - La acción mínima cuenta igual que el día completo.
 * - Volver después de una pausa es un logro, no un consuelo.
 * - Español rioplatense, 1–2 frases.
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
    sereno: "Salió. Eso es todo lo que hacía falta hoy.",
    directo: "Hecho. Seguimos.",
    analitico: "Registrado. Suma a tu consistencia de la semana.",
    flexible: "Genial, hoy se dio.",
  },
  minimal: {
    sereno: "La versión mínima cuenta igual. Repetir es lo que construye.",
    directo: "La mínima cuenta. Listo.",
    analitico: "Acción mínima registrada: mantenés la consistencia igual.",
    flexible: "Perfecto, hoy con eso alcanza.",
  },
  missedIntro: {
    sereno: "El hábito falló, no vos. Miremos el sistema: ¿qué se interpuso?",
    directo: "No salió. ¿Qué lo frenó?",
    analitico: "Un fallo es información sobre el sistema. ¿Qué pasó?",
    flexible: "Está bien, pasa. ¿Qué se cruzó?",
  },
  missedIntroQuit: {
    sereno: "Una recaída no borra lo construido. ¿Qué la disparó?",
    directo: "Recaíste. ¿Qué lo gatilló?",
    analitico: "Toda recaída tiene un disparador. Identifiquémoslo.",
    flexible: "Tranqui, volver es parte del camino. ¿Qué pasó?",
  },
  adj_lower_difficulty: {
    sereno: "Bajemos la exigencia. Sostener vale más que exigir.",
    directo: "Lo hacemos más fácil.",
    analitico: "Menos dificultad sube la probabilidad de repetirlo.",
    flexible: "Probemos una versión más liviana.",
  },
  adj_move_time: {
    sereno: "Quizás ese momento no te acompaña. Probemos otro horario.",
    directo: "Cambiemos el horario.",
    analitico: "Ese horario no está rindiendo. Movámoslo.",
    flexible: "Probemos moverlo a otro rato del día.",
  },
  adj_focus_minimal: {
    sereno: "Los días que no da, alcanza con la acción mínima.",
    directo: "Apuntá solo a la acción mínima.",
    analitico: "La acción mínima sostiene la consistencia con poco tiempo y energía.",
    flexible: "Cuando no da, la mínima y listo.",
  },
  applied: {
    sereno: "Listo, ajustado. El sistema se acomoda a vos, no al revés.",
    directo: "Hecho. Ajustado.",
    analitico: "Ajuste aplicado. Vemos cómo responde esta semana.",
    flexible: "Cambiado. A ver si así te acomoda mejor.",
  },
  dismissed: {
    sereno: "Está bien. Lo dejamos como está y seguimos.",
    directo: "Ok, sin cambios.",
    analitico: "Anotado, sin cambios por ahora.",
    flexible: "Dale, lo dejamos así.",
  },
};

const DEFAULT_STYLE: AccompanimentStyle = "sereno";

export function asa(event: AsaEvent, style?: string | null): string {
  const s = (style as AccompanimentStyle) in MESSAGES[event]
    ? (style as AccompanimentStyle)
    : DEFAULT_STYLE;
  return MESSAGES[event][s];
}
