import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getCategory } from "../features/habits/categories";
import { colors, fonts, fontSize, radius, spacing } from "../theme/tokens";

type Props = {
  habit: { id: string; name: string; category: string };
  doneToday: boolean;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
};

export function HabitItem({ habit, doneToday, onToggleToday, onDelete }: Props) {
  const category = getCategory(habit.category);
  return (
    <View style={[styles.row, doneToday && styles.rowDone]}>
      <View style={styles.iconWrap}>
        <Ionicons name={category.icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.name, doneToday && styles.nameDone]}>{habit.name}</Text>
      <Pressable onPress={() => onDelete(habit.id)} hitSlop={8} style={styles.deleteBtn}>
        <Text style={styles.delete}>✕</Text>
      </Pressable>
      <Pressable
        style={[styles.checkbox, doneToday && styles.checkboxDone]}
        onPress={() => onToggleToday(habit.id)}
      >
        {doneToday && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
    </View>
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
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.onPrimary,
    fontSize: fontSize.sm,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: fonts.body,
  },
  nameDone: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  deleteBtn: {
    paddingHorizontal: spacing.xs,
  },
  delete: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
