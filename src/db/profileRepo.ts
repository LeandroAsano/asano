import { eq } from "drizzle-orm";
import { db } from "./client";
import { profile, type NewProfile, type Profile } from "./schema";

/**
 * Repositorio de perfil: guarda/lee las respuestas del onboarding.
 * Fila única con id fijo "local" (ver comentario en schema.ts).
 */

const LOCAL_ID = "local";

// ¿La persona ya completó el onboarding?
export async function hasProfile(): Promise<boolean> {
  const rows = await db.select().from(profile).where(eq(profile.id, LOCAL_ID));
  return rows.length > 0;
}

export async function getProfile(): Promise<Profile | null> {
  const rows = await db.select().from(profile).where(eq(profile.id, LOCAL_ID));
  return rows[0] ?? null;
}

// Guarda las respuestas del onboarding. Si ya existía un perfil (ej. la
// persona repite el onboarding desde Ajustes), lo reemplaza.
export async function saveProfile(
  answers: Omit<NewProfile, "id" | "completedAt">
): Promise<void> {
  await db
    .insert(profile)
    .values({ id: LOCAL_ID, ...answers })
    .onConflictDoUpdate({
      target: profile.id,
      set: { ...answers, completedAt: new Date().toISOString() },
    });
}
