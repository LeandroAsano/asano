import type { CategoryKey } from "./categories";

/**
 * Plantillas de hábito sugeridas (decisión B5: galería + opción libre).
 * Al elegir una, pre-rellena el formulario de creación. La persona igual
 * puede editar todo o empezar de cero con "Crear el mío".
 */

export type HabitTemplate = {
  id: string;
  name: string;
  category: CategoryKey;
  minimalAction: string;
};

export const HABIT_TEMPLATES: HabitTemplate[] = [
  { id: "agua", name: "Tomar agua", category: "salud", minimalAction: "Tomar 1 vaso" },
  { id: "leer", name: "Leer", category: "aprendizaje", minimalAction: "Leer 2 páginas" },
  { id: "caminar", name: "Caminar", category: "movimiento", minimalAction: "Caminar 5 minutos" },
  { id: "meditar", name: "Meditar", category: "calma", minimalAction: "Respirar 1 minuto" },
  { id: "estudiar", name: "Estudiar", category: "aprendizaje", minimalAction: "Estudiar 5 minutos" },
  { id: "gastos", name: "Registrar gastos", category: "finanzas", minimalAction: "Anotar 1 gasto" },
  { id: "estirar", name: "Estirar", category: "movimiento", minimalAction: "Estirar 2 minutos" },
  // Hábitos de "dejar" (categoría dejar): la acción mínima es sostener el día.
  { id: "fumar", name: "Dejar de fumar", category: "dejar", minimalAction: "Un día sin fumar" },
  { id: "azucar", name: "Menos azúcar", category: "dejar", minimalAction: "Un día sin azúcar" },
];
