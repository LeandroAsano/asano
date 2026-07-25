import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { HabitLogStatus } from "../db/schema";
import { getCategory } from "../features/habits/categories";
import { colors, fonts, fontSize, radius, spacing } from "../theme/tokens";

type Props = {
  habit: { id: string; name: string; category: string; todayStatus: HabitLogStatus | null };
  onPress: (id: string) => void; // abre el check-in
  onDelete: (id: string) => void;
};

// Indicador de estado del día a la derecha de cada hábito.
function StatusIcon({ status }: { status: HabitLogStatus | null }) {
  if (status === "completed") {
    return <Ionicons name="checkmark-circle" size={26} color={colors.success} />;
  }
  if (status === "minimal") {
    return <Ionicons name="contrast" size={26} color={colors.success} />;
  }
  if (status === "missed") {
    return <Ionicons name="close-circle" size={26} color={colors.textMuted} />;
  }
  return <Ionicons name="ellipse-outline" size={26} color={colors.textMuted} />;
}

export function HabitItem({ habit, onPress, onDelete }: Props) {
  const category = getCategory(habit.category);
  const done = habit.todayStatus === "completed" || habit.todayStatus === "minimal";
  return (
    <Pressable
      style={[styles.row, done && styles.rowDone]}
      onPress={() => onPress(habit.id)}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={category.icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.name, done && styles.nameDone]}>{habit.name}</Text>
      <Pressable onPress={() => onDelete(habit.id)} hitSlop={8} style={styles.deleteBtn}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>
      <StatusIcon status={habit.todayStatus} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowDone: {
    backgroundColor: colors.successSurface,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md - 4,
  },
  name: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: fonts.body,
  },
  nameDone: {
    color: colors.textSecondary,
  },
  deleteBtn: {
    paddingHorizontal: spacing.sm,
  },
  delete: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
