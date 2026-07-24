@AGENTS.md

# ASANO — Contexto de producto y marca

Fuente: `F:\leandro\Asano\Marca\ASANO_Base_de_Marca.md` y `ASANO_Estrategia_Modelo_de_Negocio.md`.

## Qué es ASANO

**ASANO: Hábitos con criterio** — app de hábitos que no se limita a registrar cumplimiento. Ayuda a entender *por qué* una persona abandona un hábito y ajusta el sistema alrededor de él (entorno, dificultad, horario, frecuencia, acción mínima), en vez de responsabilizar a la persona por "fallar".

Promesa de marca: *"Pequeños hábitos. Mejores decisiones."*
Posicionamiento: *"Aprende a pensar mejor."*

Evitar en tono/producto: productividad tóxica, lenguaje de gurú, culpa, rachas rígidas, gamificación agresiva, rankings públicos, estética de lujo.

## Personaje: ASA

Zorro gris, sereno, observador, analítico — acompaña al usuario dentro de la app. No es mascota infantil, no felicita exageradamente, no castiga, no juzga. Ayuda a elegir hábitos realistas, detecta obstáculos, sugiere una acción mínima, analiza fallos, propone ajustes, muestra progreso semanal.

Ejemplos de tono de mensajes de ASA:
- "No necesitás hacerlo perfecto. Necesitás poder repetirlo."
- "El hábito falló. Revisemos el sistema."
- "Hoy alcanza con la acción mínima."
- "Romper una racha no elimina el progreso."

## Método / Ciclo ASA (loop central del producto)

1. **Atención** — qué hábito construir, por qué importa, qué obstáculo existe.
2. **Sistema** — entorno, horario, frecuencia, acción mínima, disparador, dificultad.
3. **Acción** — ejecutar y registrar. El ciclo se repite con revisión y ajuste.

(A nivel de marca más amplio existe también el "Método ASANO": Aprender → Sistematizar → Actuar → Nutrir → Optimizar — contexto de la marca paraguas, no necesariamente 1:1 con las pantallas de la app.)

## Público objetivo

**Público general** (decisión 2026-07-24, reemplaza el enfoque *female-first* del doc de estrategia original): personas de ~25–40 años con poco tiempo y múltiples responsabilidades, que empiezan rutinas y no logran sostenerlas, se sienten sobrecargadas y rechazan la productividad agresiva. Sin segmentar por género. Usar lenguaje neutro ("la persona", no "la usuaria").

## Rachas: no rígidas

No usar streaks tradicionales tipo "todo o nada". Preferir:
- consistencia semanal / porcentaje de cumplimiento
- recuperación después de una pausa
- progreso acumulado, no destruido por romper una racha

## MVP (alcance recomendado)

Incluir:
1. Crear entre 1 y 3 hábitos (plan gratuito).
2. Definir una acción mínima por hábito.
3. Elegir horario o disparador.
4. Registrar cumplimiento diario.
5. Check-in con ASA (indicar por qué no se cumplió → sugerencia de ajuste).
6. Progreso semanal.
7. Rutina guiada de 7 días.
8. Plan gratuito vs. premium.

No incluir (por ahora): red social, marketplace, seguimiento menstrual, terapia, nutrición médica, chatbot ilimitado, gamificación compleja, rankings públicos, funciones de salud sensibles.

## Modelo de negocio

Freemium + suscripción (ASANO Plus mensual / anual, anual como plan recomendado) + programas de pago único (ej. "7 días para comenzar de nuevo", "21 días para ordenar tu mañana") + comunidad en etapa posterior (no en MVP). Precios regionales para Latinoamérica, no conversión directa de precios US.

### Plan gratuito
Hasta 3 hábitos activos, registro diario, recordatorios, rachas flexibles, check-in básico con ASA, resumen semanal simple, una rutina guiada, estadísticas básicas.

### Plan premium
Hábitos ilimitados, planes personalizados, análisis semanal de comportamiento, adaptación de dificultad, rutinas por objetivos, historial completo, widgets, sincronización, recomendaciones avanzadas de ASA, desafíos/programas premium, estadísticas avanzadas, exportación.

## Onboarding

Corto, basado en preguntas: qué querés mejorar, qué hábito te cuesta sostener, cuánto tiempo real tenés, en qué momento del día, qué suele impedirte cumplir, qué estilo de acompañamiento preferís (**Sereno / Directo / Analítico / Flexible**).

## Roadmap (alto nivel)

1. Validación (contenido, landing, lista de espera, prototipo).
2. MVP (app básica, Ciclo ASA, 3 hábitos, registro diario, revisión semanal, suscripción). ← estado actual del repo.
3. Optimización (onboarding, personalización, programas de pago único, estadísticas, widgets).
4. Expansión (comunidad, desafíos grupales, newsletter premium, cursos, integraciones).

## Identidad visual de la app (decisión 2026-07-24)

Versión **cálida** del sistema ASANO (distinta de la cara "Business Intelligence" del brand board `Foco gral.png`):
- Base: crema `#E6E1D5` y grises claros `#D1D5DB`. Acento: navy `#1E293B`. Texto: near-black `#0D1117`.
- Verde de progreso sereno para "cumplido" (el `#4caf50` del prototipo es placeholder).
- Tipografía: Montserrat Bold (títulos) + Inter Regular (cuerpo). Personaje ASA, tono sereno.

## Decisiones técnicas del MVP (2026-07-24)

Expo Router · **SQLite + Drizzle** (local-first, cuenta anónima; Supabase para respaldo opcional) · StyleSheet + design tokens · PostHog + Sentry · i18n ES-LatAm. **El MVP no cobra**: paywall de intención (fake door) + gating real de 3 hábitos; RevenueCat entra en Fase 1.5. Al crear hábito: plantillas sugeridas + opción libre. Detalle en `F:\leandro\Asano\Producto\` (docs 05 y 07).

## Notas de implementación

- **Bloque 1 hecho (2026-07-24):** migrado a **Expo Router** (rutas en `app/`, entry `expo-router/entry`), design tokens de la paleta cálida en `src/theme/tokens.ts`, y React Navigation removido. Home en `app/index.tsx`, layout raíz en `app/_layout.tsx`.
- **Bloque 2 hecho (2026-07-24):** persistencia migrada a **SQLite + Drizzle**. Schema en `src/db/schema.ts` (tablas `habits`, `habit_logs` con estado completed/minimal/missed e índice único habit+date). Cliente en `src/db/client.ts`, repositorio en `src/db/habitsRepo.ts` (única puerta a la DB). Migraciones en `drizzle/` (config: `drizzle.config.ts`, `metro.config.js`, `babel.config.js`). `useMigrations` corre en `_layout.tsx`. AsyncStorage removido de hábitos (sigue instalado para settings futuros). Verificado con typecheck + smoke test de la lógica SQL.
- **Cómo probar:** SQLite es alpha en web → **probar en Android con Expo Go** (`npx expo start -c`, escanear QR). El preview web ya no sirve para verificar desde este bloque.
- **Pendiente:** cargar fuentes Montserrat/Inter (tokens `fonts` en `undefined`). Ampliar el modelo del doc 03 (habit_schedules, adjustments, profile, programs) en los próximos bloques. `minimalAction` ya existe en el schema pero el flujo de creación real (Ciclo ASA) y el check-in tri-estado llegan después.
- Todo el plan de producto (roadmap, MVP, flujos, modelo de datos, negocio, guía móvil, checklist) vive en `F:\leandro\Asano\Producto\` (docs 00–07). Assets de marca en `F:\leandro\Asano\Marca\`. Nada de eso está versionado en este repo.
