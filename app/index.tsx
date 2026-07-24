import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HabitItem } from "../src/components/HabitItem";
import {
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
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setItems(await listHabitsForToday());
  }, []);

  // Gate de onboarding (una vez, al montar).
  useEffect(() => {
    hasProfile().then((exists) => {
      if (!exists) {
        router.replace("/onboarding");
        return;
      }
      setReady(true);
    });
  }, []);

  // Refrescar la lista cada vez que la pantalla recibe foco (incluye volver
  // de la pantalla de crear hábito).
  useFocusEffect(
    useCallback(() => {
      if (ready) refresh();
    }, [ready, refresh])
  );

  if (!ready) {
    return (
      <SafeAreaView style={styles.center} edges={["top", "bottom"]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
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
          <Text style={styles.empty}>
            Todavía no agregaste hábitos.{"\n"}Tocá el botón para crear el primero.
          </Text>
        }
      />
      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={() => router.push("/habit/new")}>
          <Ionicons name="add" size={20} color={colors.onPrimary} />
          <Text style={styles.addButtonText}>Nuevo hábito</Text>
        </Pressable>
      </View>
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
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  addButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.md,
  },
});
