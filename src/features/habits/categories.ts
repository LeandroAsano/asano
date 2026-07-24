import { Ionicons } from "@expo/vector-icons";

/**
 * Categorías de hábito, con su ícono (Ionicons, estilo de línea como los
 * mockups). El valor `key` es lo que se guarda en la columna `category`.
 */

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type CategoryKey =
  | "salud"
  | "movimiento"
  | "foco"
  | "calma"
  | "aprendizaje"
  | "finanzas"
  | "dejar";

export type Category = {
  key: CategoryKey;
  label: string;
  icon: IoniconName;
};

export const CATEGORIES: Category[] = [
  { key: "salud", label: "Salud", icon: "water-outline" },
  { key: "movimiento", label: "Movimiento", icon: "walk-outline" },
  { key: "foco", label: "Foco", icon: "flash-outline" },
  { key: "calma", label: "Calma", icon: "leaf-outline" },
  { key: "aprendizaje", label: "Aprendizaje", icon: "book-outline" },
  { key: "finanzas", label: "Finanzas", icon: "wallet-outline" },
  // Hábito de abstinencia (dejar de fumar, azúcar, etc.).
  { key: "dejar", label: "Dejar un hábito", icon: "hand-left-outline" },
];

const BY_KEY: Record<CategoryKey, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: c }),
  {} as Record<CategoryKey, Category>
);

// Devuelve la categoría (con fallback a 'salud' si el valor guardado no existe).
export function getCategory(key: string): Category {
  return BY_KEY[key as CategoryKey] ?? BY_KEY.salud;
}
