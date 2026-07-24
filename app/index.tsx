import React, { useEffect, useState } from "react";
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
import { loadHabits, saveHabits } from "../src/storage/habitsStorage";
import { Habit } from "../src/types/habit";
import { colors, fontSize, radius, spacing } from "../src/theme/tokens";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Pantalla de inicio (ruta "/"). Muestra los hábitos de hoy y permite
 * agregarlos, marcarlos y borrarlos.
 *
 * NOTA: sigue usando AsyncStorage. Reemplazar por SQLite + Drizzle y el
 * modelo de datos completo (check-in, acción mínima, ajustes) es el Bloque 2.
 */
export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadHabits().then((h) => {
      setHabits(h);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveHabits(habits);
  }, [habits, loaded]);

  function addHabit() {
    const name = newHabitName.trim();
    if (!name) return;
    setHabits((prev) => [
      ...prev,
      { id: Date.now().toString(), name, createdAt: todayKey(), completedDates: [] },
    ]);
    setNewHabitName("");
  }

  function toggleToday(id: string) {
    const today = todayKey();
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedDates: h.completedDates.includes(today)
                ? h.completedDates.filter((d) => d !== today)
                : [...h.completedDates, today],
            }
          : h
      )
    );
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const today = todayKey();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Hábitos de hoy</Text>
      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            doneToday={item.completedDates.includes(today)}
            onToggleToday={toggleToday}
            onDelete={deleteHabit}
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
          onSubmitEditing={addHabit}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={addHabit}>
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
