import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Habit } from "../types/habit";

type Props = {
  habit: Habit;
  doneToday: boolean;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
};

export function HabitItem({ habit, doneToday, onToggleToday, onDelete }: Props) {
  return (
    <View style={styles.row}>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  nameDone: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  delete: {
    color: "#888",
    fontSize: 16,
    paddingHorizontal: 4,
  },
});
