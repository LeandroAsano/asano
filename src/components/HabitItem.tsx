import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSize, radius, spacing } from "../theme/tokens";

type Props = {
  habit: { id: string; name: string };
  doneToday: boolean;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
};

export function HabitItem({ habit, doneToday, onToggleToday, onDelete }: Props) {
  return (
    <View style={[styles.row, doneToday && styles.rowDone]}>
      <Pressable
        style={[styles.checkbox, doneToday && styles.checkboxDone]}
        onPress={() => onToggleToday(habit.id)}
      >
        {doneToday && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Text style={[styles.name, doneToday && styles.nameDone]}>{habit.name}</Text>
      <Pressable onPress={() => onDelete(habit.id)} hitSlop={8}>
        <Text style={styles.delete}>✕</Text>
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md - 4,
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
  delete: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    paddingHorizontal: spacing.xs,
  },
});
