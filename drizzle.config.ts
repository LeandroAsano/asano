// Configuración de Drizzle Kit (la herramienta que genera las migraciones).
// - schema: dónde están definidas nuestras tablas.
// - out: dónde deja los archivos de migración generados.
// - dialect/driver: sqlite corriendo sobre Expo.
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
