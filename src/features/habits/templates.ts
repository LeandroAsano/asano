import type { CategoryKey } from "./categories";

/**
 * Plantillas de hábito sugeridas (decisión B5: galería + opción libre).
 * Al elegir una, pre-rellena el formulario de creación. La persona igual
 * puede editar todo o empezar de cero con "Crear el mío".
 *
 * Criterio de las acciones mínimas: tienen que ser **ridículamente chicas**
 * — el objetivo es vencer la parálisis de inicio, no lograr el resultado.
 * "Ponerte las zapatillas" es una acción mínima válida; "caminar 20 minutos"
 * no lo es.
 */

export type HabitTemplate = {
  id: string;
  name: string;
  category: CategoryKey;
  minimalAction: string;
};

export const HABIT_TEMPLATES: HabitTemplate[] = [
  { id: "agua", name: "Tomar agua", category: "salud", minimalAction: "Un vaso" },
  { id: "leer", name: "Leer", category: "aprendizaje", minimalAction: "Una página" },
  { id: "caminar", name: "Moverme", category: "movimiento", minimalAction: "Ponerme las zapatillas" },
  { id: "estirar", name: "Estirar", category: "movimiento", minimalAction: "Un estiramiento" },
  { id: "respirar", name: "Bajar un cambio", category: "calma", minimalAction: "Tres respiraciones" },
  { id: "dormir", name: "Ir a dormir a horario", category: "calma", minimalAction: "Dejar el celular lejos" },
  { id: "estudiar", name: "Enfocarme", category: "foco", minimalAction: "Abrir el archivo y mirarlo" },
  { id: "orden", name: "Ordenar", category: "foco", minimalAction: "Guardar una sola cosa" },
  { id: "gastos", name: "Registrar gastos", category: "finanzas", minimalAction: "Anotar un gasto" },
  // Hábitos de "dejar": la acción mínima es sostener el día, no lograr nada extra.
  { id: "fumar", name: "Dejar de fumar", category: "dejar", minimalAction: "Sostener el día de hoy" },
  { id: "azucar", name: "Menos azúcar", category: "dejar", minimalAction: "Sostener el día de hoy" },
  { id: "pantalla", name: "Menos pantalla", category: "dejar", minimalAction: "Sostener el día de hoy" },
];
