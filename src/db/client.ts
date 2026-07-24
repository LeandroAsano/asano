import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

/**
 * Conexión a la base de datos local de ASANO.
 *
 * - openDatabaseSync abre (o crea) el archivo "asano.db" dentro del teléfono.
 * - PRAGMA foreign_keys = ON activa las relaciones entre tablas (para que,
 *   al borrar un hábito, se borren en cascada sus registros).
 * - drizzle(expoDb) envuelve esa base con Drizzle para poder escribir las
 *   consultas en TypeScript.
 *
 * `db` es la instancia que usa el repositorio (habitsRepo.ts).
 * `expoDb` se exporta para aplicar las migraciones en el layout raíz.
 */
export const expoDb = openDatabaseSync("asano.db");
expoDb.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(expoDb);
