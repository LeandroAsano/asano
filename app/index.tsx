import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { hasProfile } from "../src/db/profileRepo";
import { colors, fonts, fontSize, radius, spacing } from "../src/theme/tokens";

/**
 * Pantalla de inicio (ruta "/"). Muestra los hábitos de hoy y permite
 * agregarlos, marcarlos y borrarlos.
 *
 * Antes de mostrar nada, chequea si ya existe un perfil (onboarding
 * completado). Si no existe, redirige a /onboarding con `replace` (no
 * `push`) para que "atrás" no pueda volver a esta pantalla a medio cargar.
 *
 * Los datos viven en SQLite (vía los repositorios). La pantalla no toca
 * la base directamente: pide todo al repositorio y, tras cada cambio,
 * vuelve a leer con refresh().
 */
export default function HomeScreen() {
  const [items, setItems] = useState<HabitForToday[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setItems(await listHabitsForToday());
  }, []);

  useEffect(() => {
    hasProfile().then((exists) => {
      if (!exists) {
        router.replace("/onboarding");
        return;
      }
      refresh().then(() => setReady(true));
    });
  }, [refresh]);

  if (!ready) {
    return (
      <SafeAreaView style={styles.center} edges={["top", "bottom"]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
    fontFamily: fonts.body,
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
    fontFamily: fonts.body,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodySemi,
  },
});
