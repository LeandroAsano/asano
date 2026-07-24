import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHabit, type CreateHabitInput } from "../../src/db/habitsRepo";
import {
  CATEGORIES,
  type CategoryKey,
} from "../../src/features/habits/categories";
import { HABIT_TEMPLATES } from "../../src/features/habits/templates";
import { colors, fonts, fontSize, radius, spacing } from "../../src/theme/tokens";

// Presets para no depender todavía de un selector de hora nativo
// (las notificaciones reales llegan en un bloque aparte).
const MOMENTS = [
  { value: "08:00", label: "Mañana" },
  { value: "13:00", label: "Mediodía" },
  { value: "18:00", label: "Tarde" },
  { value: "21:00", label: "Noche" },
];
const WEEKDAYS = [
  { value: 1, label: "L" },
  { value: 2, label: "M" },
  { value: 3, label: "M" },
  { value: 4, label: "J" },
  { value: 5, label: "V" },
  { value: 6, label: "S" },
  { value: 7, label: "D" },
];

type Difficulty = "facil" | "media" | "dificil";
type FrequencyType = "daily" | "specific_days" | "times_per_week";
type AnchorType = "time" | "trigger";

export default function NewHabitScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey>("salud");
  const [minimalAction, setMinimalAction] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("media");
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  const [anchorType, setAnchorType] = useState<AnchorType>("time");
  const [timeOfDay, setTimeOfDay] = useState("08:00");
  const [triggerText, setTriggerText] = useState("");
  const [saving, setSaving] = useState(false);

  function applyTemplate(t: (typeof HABIT_TEMPLATES)[number]) {
    setName(t.name);
    setCategory(t.category);
    setMinimalAction(t.minimalAction);
  }

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  const canSave =
    name.trim().length > 0 &&
    (frequencyType !== "specific_days" || daysOfWeek.length > 0) &&
    (anchorType !== "trigger" || triggerText.trim().length > 0);

  async function onSave() {
    if (!canSave || saving) return;
    setSaving(true);
    const input: CreateHabitInput = {
      name,
      category,
      minimalAction,
      difficulty,
      frequencyType,
      daysOfWeek: frequencyType === "specific_days" ? daysOfWeek : undefined,
      timesPerWeek: frequencyType === "times_per_week" ? timesPerWeek : undefined,
      anchorType,
      timeOfDay,
      triggerText,
    };
    await createHabit(input);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.cancel}>Cancelar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nuevo hábito</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Galería de plantillas */}
        <Text style={styles.sectionLabel}>Empezá con una plantilla</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesRow}
        >
          {HABIT_TEMPLATES.map((t) => (
            <Pressable key={t.id} style={styles.templateCard} onPress={() => applyTemplate(t)}>
              <Ionicons
                name={CATEGORIES.find((c) => c.key === t.category)!.icon}
                size={20}
                color={colors.primary}
              />
              <Text style={styles.templateName}>{t.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Nombre */}
        <Text style={styles.label}>Nombre del hábito</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Leer 10 minutos"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        {/* Categoría */}
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <Pressable
                key={c.key}
                style={[styles.catChip, active && styles.catChipActive]}
                onPress={() => setCategory(c.key)}
              >
                <Ionicons
                  name={c.icon}
                  size={16}
                  color={active ? colors.onPrimary : colors.textSecondary}
                />
                <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Acción mínima */}
        <Text style={styles.label}>Acción mínima</Text>
        <Text style={styles.hint}>La versión de 2 minutos, para los días difíciles.</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Leer 2 páginas"
          placeholderTextColor={colors.textMuted}
          value={minimalAction}
          onChangeText={setMinimalAction}
        />

        {/* Frecuencia */}
        <Text style={styles.label}>Frecuencia</Text>
        <Segmented
          options={[
            { value: "daily", label: "Diario" },
            { value: "specific_days", label: "Días" },
            { value: "times_per_week", label: "Veces/sem" },
          ]}
          value={frequencyType}
          onChange={(v) => setFrequencyType(v as FrequencyType)}
        />
        {frequencyType === "specific_days" && (
          <View style={styles.daysRow}>
            {WEEKDAYS.map((d, i) => {
              const active = daysOfWeek.includes(d.value);
              return (
                <Pressable
                  key={i}
                  style={[styles.dayCircle, active && styles.dayCircleActive]}
                  onPress={() => toggleDay(d.value)}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
        {frequencyType === "times_per_week" && (
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setTimesPerWeek((n) => Math.max(1, n - 1))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </Pressable>
            <Text style={styles.stepValue}>{timesPerWeek} veces por semana</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setTimesPerWeek((n) => Math.min(7, n + 1))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        )}

        {/* Dificultad */}
        <Text style={styles.label}>Dificultad</Text>
        <Segmented
          options={[
            { value: "facil", label: "Fácil" },
            { value: "media", label: "Media" },
            { value: "dificil", label: "Difícil" },
          ]}
          value={difficulty}
          onChange={(v) => setDifficulty(v as Difficulty)}
        />

        {/* Ancla */}
        <Text style={styles.label}>¿Cuándo?</Text>
        <Segmented
          options={[
            { value: "time", label: "Horario" },
            { value: "trigger", label: "Disparador" },
          ]}
          value={anchorType}
          onChange={(v) => setAnchorType(v as AnchorType)}
        />
        {anchorType === "time" ? (
          <View style={styles.chipsWrap}>
            {MOMENTS.map((m) => {
              const active = timeOfDay === m.value;
              return (
                <Pressable
                  key={m.value}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setTimeOfDay(m.value)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {m.label} · {m.value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Ej: después del café"
            placeholderTextColor={colors.textMuted}
            value={triggerText}
            onChangeText={setTriggerText}
          />
        )}

        <Pressable
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={onSave}
          disabled={!canSave || saving}
        >
          <Text style={styles.saveBtnText}>Crear hábito</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// Control segmentado reutilizable (una fila de opciones, una activa).
function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <Pressable
            key={o.value}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
            onPress={() => onChange(o.value)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancel: { color: colors.primary, fontSize: fontSize.md, fontFamily: fonts.bodyMedium, width: 64 },
  headerTitle: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: fonts.headingSemi },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: fonts.bodySemi,
    marginBottom: spacing.sm,
  },
  templatesRow: { gap: spacing.sm, paddingBottom: spacing.sm },
  templateCard: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    gap: 4,
    minWidth: 92,
  },
  templateName: { fontSize: fontSize.xs, color: colors.textPrimary, fontFamily: fonts.bodyMedium },
  label: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: fonts.bodySemi,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.bodyMedium },
  chipTextActive: { color: colors.onPrimary },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.bodyMedium },
  catChipTextActive: { color: colors.onPrimary },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 3,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.bodyMedium },
  segmentTextActive: { color: colors.onPrimary },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.bodySemi },
  dayTextActive: { color: colors.onPrimary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { fontSize: fontSize.lg, color: colors.primary, fontFamily: fonts.bodySemi },
  stepValue: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: fonts.bodyMedium },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: colors.onPrimary, fontFamily: fonts.bodySemi, fontSize: fontSize.md },
});
