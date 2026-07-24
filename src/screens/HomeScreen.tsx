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
import { HabitItem } from "../components/HabitItem";
import { loadHabits, saveHabits } from "../storage/habitsStorage";
import { Habit } from "../types/habit";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function HomeScreen() {
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
          placeholderTextColor="#888"
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
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
