import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/habit";

const HABITS_KEY = "@asano/habits";

export async function loadHabits(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(HABITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
