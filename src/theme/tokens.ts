/**
 * Design tokens de ASANO — la fuente única de verdad del estilo visual.
 *
 * Regla de oro: en las pantallas NO se escriben colores/medidas "a mano"
 * (ej. "#1E293B" o "16"). Se importan desde acá por su nombre semántico
 * (ej. colors.primary, spacing.md). Así, cambiar la identidad visual es
 * tocar este archivo y nada más.
 *
 * Paleta: versión CÁLIDA del sistema ASANO (público general, tono sereno).
 * Distinta de la cara "Business Intelligence" (oscura) del brand board.
 */

// ── Colores crudos ────────────────────────────────────────────────
// Los valores hexadecimales "puros". No se usan directo en las pantallas;
// se exponen a través de `colors` (abajo) con nombres que dicen su función.
const palette = {
  cream: "#E6E1D5", // crema cálido — base de la marca
  creamSoft: "#EFEBE3", // crema más claro — fondo general de la app
  sand: "#FDFBF7", // casi blanco cálido — superficies/tarjetas
  grayLight: "#D1D5DB", // gris claro — bordes y divisores
  slate: "#4B5563", // gris pizarra — texto secundario
  navy: "#1E293B", // navy — color de marca / acciones
  ink: "#0D1117", // casi negro — texto principal
  sage: "#4F7A62", // verde salvia sereno — "cumplido" (reemplaza el verde placeholder)
  sageSoft: "#E3EDE6", // verde muy suave — fondos de estado "cumplido"
  clay: "#B4553F", // terracota apagado — errores/atención (sin alarmismo)
  white: "#FFFFFF",
} as const;

// ── Colores semánticos ────────────────────────────────────────────
// Estos SÍ se usan en las pantallas. El nombre dice para qué sirve,
// no qué color es. Si mañana el "primary" deja de ser navy, se cambia acá.
export const colors = {
  background: palette.creamSoft, // fondo de las pantallas
  surface: palette.sand, // tarjetas, hojas, campos
  primary: palette.navy, // botones principales, elementos de marca
  onPrimary: palette.sand, // texto/íconos sobre `primary`
  textPrimary: palette.ink, // texto principal
  textSecondary: palette.slate, // texto secundario, subtítulos
  textMuted: "#8A8F98", // texto tenue, placeholders
  border: palette.grayLight, // bordes y divisores
  success: palette.sage, // hábito cumplido
  successSurface: palette.sageSoft, // fondo de un ítem cumplido
  danger: palette.clay, // errores / acciones destructivas
  brandCream: palette.cream, // acento cálido de marca
} as const;

// ── Espaciado ─────────────────────────────────────────────────────
// Escala basada en múltiplos de 4. Usar SIEMPRE estos valores para
// márgenes y padding mantiene un ritmo visual consistente.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ── Radios de borde ───────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999, // para botones/chips totalmente redondeados
} as const;

// ── Tipografía ────────────────────────────────────────────────────
// Familias de la marca: Montserrat (títulos) + Inter (cuerpo).
// NOTA: las fuentes reales todavía no están cargadas — eso es un paso
// aparte (expo-font / @expo-google-fonts). Por ahora `undefined` usa la
// fuente del sistema; cuando carguemos las fuentes, se completan acá y
// se actualiza toda la app de una.
export const fonts = {
  heading: undefined as string | undefined, // → "Montserrat_700Bold"
  body: undefined as string | undefined, // → "Inter_400Regular"
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// Objeto único que agrupa todo, por si se prefiere importar `theme` completo.
export const theme = { colors, spacing, radius, fonts, fontSize } as const;

export type Theme = typeof theme;
