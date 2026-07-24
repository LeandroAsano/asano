import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HabitItem } from "../src/components/HabitItem";
import {
  addHabit,
  deleteHabit,
  listHabitsForToday,
  toggleToday,
  type HabitForToday,
} from "../src/db/habitsRepo";
import { colors, fontSize, radius, spacing } from "../src/theme/tokens";

/**
 * Pantalla de inicio (ruta "/"). Muestra los hábitos de hoy y permite
 * agregarlos, marcarlos y borrarlos.
 *
 * Los datos ahora viven en SQLite (vía el repositorio habitsRepo). La
 * pantalla no toca la base directamente: pide todo al repositorio y, tras
 * cada cambio, vuelve a leer con refresh().
 */
export default function HomeScreen() {
  const [items, setItems] = useState<HabitForToday[]>([]);
  const [newHabitName, setNewHabitName] = useState("");

  const refresh = useCallback(async () => {
    setItems(await listHabitsForToday());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function onAdd() {
    const name = newHabitName.trim();
    if (!name) return;
    setNewHabitName("");
    await addHabit(name);
    await refresh();
  }

  async function onToggle(id: string) {
    await toggleToday(id);
    await refresh();
  }

  async function onDelete(id: string) {
    await deleteHabit(id);
    await refresh();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Hábitos de hoy</Text>
      <FlatList
        data={items}
        keyExtractor={(h) => h.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            doneToday={item.doneToday}
            onToggleToday={onToggle}
            onDelete={onDelete}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Todavía no agregaste hábitos.</Text>
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputRow}
      >
        <TextInput
          style={styles.input}
          placeholder="Nuevo hábito..."
          placeholderTextColor={colors.textMuted}
          value={newHabitName}
          onChangeText={setNewHabitName}
          onSubmitEditing={onAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  inputRow: {
    flexDirection: "row",
    padding: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginRight: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
  },
});
