/**
 * Contenido del onboarding de ASANO: las 6 preguntas y sus opciones.
 *
 * Esta es la fuente de verdad del onboarding (decisión B3 del doc 07).
 * Cada respuesta se guarda en la tabla `profile` con la `key` indicada.
 * La pregunta 6 (estilo de acompañamiento) define el tono de ASA en toda la app.
 */

// Las claves coinciden con las columnas de la tabla `profile`.
export type ProfileKey =
  | "goal"
  | "strugglingHabit"
  | "timeBudget"
  | "preferredMoment"
  | "commonBlocker"
  | "accompanimentStyle";

export type Option = {
  value: string; // lo que se guarda en la base
  label: string; // lo que ve la persona
  description?: string; // aclaración opcional (se usa en el estilo de ASA)
};

export type Question = {
  key: ProfileKey;
  title: string;
  subtitle?: string;
  options: Option[];
};

export const ONBOARDING_QUESTIONS: Question[] = [
  {
    key: "goal",
    title: "¿Qué querés mejorar?",
    subtitle: "Elegí lo que más te importa ahora.",
    options: [
      { value: "salud", label: "Salud y energía" },
      { value: "foco", label: "Foco y productividad" },
      { value: "calma", label: "Calma y bienestar" },
      { value: "aprender", label: "Aprender algo nuevo" },
      { value: "finanzas", label: "Finanzas personales" },
    ],
  },
  {
    key: "strugglingHabit",
    title: "¿Qué hábito te cuesta sostener?",
    subtitle: "El que siempre empezás y dejás.",
    options: [
      { value: "ejercicio", label: "Hacer ejercicio" },
      { value: "leer", label: "Leer" },
      { value: "meditar", label: "Meditar" },
      { value: "agua", label: "Tomar agua" },
      { value: "dormir", label: "Dormir mejor" },
      { value: "estudiar", label: "Estudiar" },
    ],
  },
  {
    key: "timeBudget",
    title: "¿Cuánto tiempo real tenés?",
    subtitle: "Seamos honestos, no ideales.",
    options: [
      { value: "poco", label: "Poco", description: "5 a 10 minutos" },
      { value: "medio", label: "Algo", description: "15 a 30 minutos" },
      { value: "mucho", label: "Bastante", description: "Más de 30 minutos" },
    ],
  },
  {
    key: "preferredMoment",
    title: "¿En qué momento del día sería más fácil?",
    options: [
      { value: "manana", label: "A la mañana" },
      { value: "mediodia", label: "Al mediodía" },
      { value: "tarde", label: "A la tarde" },
      { value: "noche", label: "A la noche" },
    ],
  },
  {
    key: "commonBlocker",
    title: "¿Qué suele impedirte cumplir?",
    subtitle: "Esto nos ayuda a ajustar el sistema, no a juzgarte.",
    options: [
      { value: "tiempo", label: "Falta de tiempo" },
      { value: "olvido", label: "Me olvido" },
      { value: "energia", label: "Sin energía" },
      { value: "momento", label: "El momento no funciona" },
      { value: "dificultad", label: "Es demasiado difícil" },
    ],
  },
  {
    key: "accompanimentStyle",
    title: "¿Cómo preferís que te acompañe ASA?",
    subtitle: "Podés cambiarlo después.",
    options: [
      {
        value: "sereno",
        label: "Sereno",
        description: "Mensajes suaves y reflexivos.",
      },
      {
        value: "directo",
        label: "Directo",
        description: "Breve y concreto, al grano.",
      },
      {
        value: "analitico",
        label: "Analítico",
        description: "Datos, patrones y explicaciones.",
      },
      {
        value: "flexible",
        label: "Flexible",
        description: "Se adapta y ajusta seguido.",
      },
    ],
  },
];
