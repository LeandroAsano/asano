import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveProfile } from "../src/db/profileRepo";
import { ONBOARDING_QUESTIONS } from "../src/features/onboarding/questions";
import { colors, fonts, fontSize, radius, spacing } from "../src/theme/tokens";

/**
 * Onboarding: 6 preguntas, una por pantalla, con barra de progreso.
 * Al responder la última, guarda todo en el perfil y navega a Hoy.
 *
 * Las respuestas se acumulan en memoria (`answers`) y recién se persisten
 * al terminar, para no dejar un perfil a medio completar en la base si la
 * persona cierra la app a mitad de camino.
 */
export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const question = ONBOARDING_QUESTIONS[stepIndex];
  const isLast = stepIndex === ONBOARDING_QUESTIONS.length - 1;
  const progress = (stepIndex + 1) / ONBOARDING_QUESTIONS.length;

  async function selectOption(value: string) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);

    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }

    setSaving(true);
    await saveProfile({
      goal: next.goal,
      strugglingHabit: next.strugglingHabit,
      timeBudget: next.timeBudget,
      preferredMoment: next.preferredMoment,
      commonBlocker: next.commonBlocker,
      accompanimentStyle: next.accompanimentStyle,
    });
    router.replace("/");
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12} disabled={stepIndex === 0}>
          <Text
            style={[styles.back, stepIndex === 0 && styles.backDisabled]}
          >
            ‹ Atrás
          </Text>
        </Pressable>
        <Text style={styles.stepCounter}>
          {stepIndex + 1} / {ONBOARDING_QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{question.title}</Text>
        {question.subtitle ? (
          <Text style={styles.subtitle}>{question.subtitle}</Text>
        ) : null}

        <View style={styles.options}>
          {question.options.map((opt) => {
            const selected = answers[question.key] === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => selectOption(opt.value)}
                disabled={saving}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
                {opt.description ? (
                  <Text style={styles.optionDescription}>
                    {opt.description}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  back: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontFamily: fonts.bodyMedium,
  },
  backDisabled: {
    opacity: 0,
  },
  stepCounter: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontFamily: fonts.body,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: fonts.bodySemi,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
    fontFamily: fonts.body,
  },
});
