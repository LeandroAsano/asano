/**
 * Contenido del onboarding de ASANO: las 6 preguntas y sus opciones.
 *
 * Público: mentes que funcionan distinto (foco TDAH adulto) — ver doc 10
 * en F:\leandro\Asano\Producto. Las opciones están redactadas para que la
 * persona se sienta reconocida ("se me fue el tiempo", "no pude arrancar")
 * en vez de juzgada.
 *
 * ⚠️ Sin claims médicos: no se pregunta por diagnóstico (sería dato de salud
 * sensible) ni se habla de síntomas. Solo experiencias cotidianas.
 *
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
    subtitle: "Elegí lo que más te importa ahora. Después podés cambiarlo.",
    options: [
      { value: "salud", label: "Salud y energía" },
      { value: "foco", label: "Foco y organización" },
      { value: "calma", label: "Calma y descanso" },
      { value: "aprender", label: "Aprender algo" },
      { value: "finanzas", label: "Orden con la plata" },
      { value: "dejar", label: "Dejar algo que me hace mal" },
    ],
  },
  {
    key: "strugglingHabit",
    title: "¿Qué te cuesta sostener?",
    subtitle: "Eso que empezás mil veces y se te cae.",
    options: [
      { value: "movimiento", label: "Moverme" },
      { value: "leer", label: "Leer" },
      { value: "dormir", label: "Dormir a horario" },
      { value: "agua", label: "Tomar agua" },
      { value: "estudiar", label: "Estudiar o trabajar enfocado" },
      { value: "orden", label: "Mantener el orden" },
    ],
  },
  {
    key: "timeBudget",
    title: "¿Cuánto tiempo real tenés?",
    subtitle: "Real, no ideal. Esto define tu acción mínima.",
    options: [
      { value: "poco", label: "Muy poco", description: "2 a 5 minutos" },
      { value: "medio", label: "Algo", description: "10 a 20 minutos" },
      { value: "mucho", label: "Bastante", description: "Más de 20 minutos" },
      { value: "variable", label: "Depende del día", description: "Varía mucho" },
    ],
  },
  {
    key: "preferredMoment",
    title: "¿Cuándo tenés más chances?",
    subtitle: "El momento del día en que sos más vos.",
    options: [
      { value: "manana", label: "A la mañana" },
      { value: "mediodia", label: "Al mediodía" },
      { value: "tarde", label: "A la tarde" },
      { value: "noche", label: "A la noche" },
    ],
  },
  {
    key: "commonBlocker",
    title: "¿Qué suele frenarte?",
    subtitle: "Sirve para ajustar el sistema, no para juzgarte.",
    options: [
      { value: "arrancar", label: "No logro arrancar" },
      { value: "olvido", label: "Se me pasa" },
      { value: "tiempo", label: "Se me va el tiempo" },
      { value: "energia", label: "No me da la energía" },
      { value: "distraccion", label: "Me distraigo con otra cosa" },
      { value: "dificultad", label: "Me lo pongo muy difícil" },
    ],
  },
  {
    key: "accompanimentStyle",
    title: "¿Cómo preferís que te acompañe ASA?",
    subtitle: "Podés cambiarlo cuando quieras.",
    options: [
      {
        value: "sereno",
        label: "Sereno",
        description: "Mensajes suaves y sin apuro.",
      },
      {
        value: "directo",
        label: "Directo",
        description: "Breve y al grano, sin vueltas.",
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
