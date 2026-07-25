import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  applyAdjustment,
  proposeAdjustmentForHabit,
  setTodayStatus,
  type HabitForToday,
  type ProposedAdjustment,
} from "../db/habitsRepo";
import { asa, type AsaEvent } from "../features/asa/messages";
import { describeChange, MISS_REASONS } from "../features/habits/adjustments";
import type { MissReason } from "../db/schema";
import { colors, fonts, fontSize, radius, spacing } from "../theme/tokens";

type Props = {
  habit: HabitForToday | null; // null = cerrado
  style: string | null; // estilo de acompañamiento (profile)
  onClose: () => void; // se llama tras registrar; Home refresca
};

type Step = "choose" | "reason" | "adjust" | "done";

export function CheckinSheet({ habit, style, onClose }: Props) {
  const [step, setStep] = useState<Step>("choose");
  const [proposal, setProposal] = useState<ProposedAdjustment | null>(null);
  const [doneEvent, setDoneEvent] = useState<AsaEvent>("applied");
  const [busy, setBusy] = useState(false);

  // Reiniciar el flujo cada vez que se abre para un hábito.
  useEffect(() => {
    if (habit) {
      setStep("choose");
      setProposal(null);
      setBusy(false);
    }
  }, [habit?.id]);

  if (!habit) return null;
  const isQuit = habit.category === "dejar";

  async function mark(status: "completed" | "minimal") {
    if (!habit || busy) return;
    setBusy(true);
    await setTodayStatus(habit.id, status);
    onClose();
  }

  async function chooseReason(reason: MissReason) {
    if (!habit || busy) return;
    setBusy(true);
    const logId = await setTodayStatus(habit.id, "missed", reason);
    const p = await proposeAdjustmentForHabit(habit.id, reason, logId);
    setProposal(p);
    setBusy(false);
    setStep("adjust");
  }

  async function onApply() {
    if (!habit || !proposal || busy) return;
    setBusy(true);
    await applyAdjustment(proposal.adjustmentId, habit.id, proposal.change);
    setDoneEvent("applied");
    setBusy(false);
    setStep("done");
  }

  function onDismiss() {
    setDoneEvent("dismissed");
    setStep("done");
  }

  return (
    <Modal visible={!!habit} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.habitName}>{habit.name}</Text>

        {step === "choose" && (
          <View style={styles.group}>
            <Pressable
              style={[styles.option, styles.optionPrimary]}
              onPress={() => mark("completed")}
            >
              <Ionicons name="checkmark-circle" size={22} color={colors.onPrimary} />
              <Text style={styles.optionPrimaryText}>{isQuit ? "Me mantuve" : "Lo hice"}</Text>
            </Pressable>

            <Pressable style={styles.option} onPress={() => mark("minimal")}>
              <Ionicons name="ellipse-outline" size={22} color={colors.primary} />
              <View>
                <Text style={styles.optionText}>{isQuit ? "Casi" : "Hice la acción mínima"}</Text>
                {!isQuit && habit.minimalAction ? (
                  <Text style={styles.optionSub}>{habit.minimalAction}</Text>
                ) : null}
              </View>
            </Pressable>

            <Pressable style={styles.option} onPress={() => setStep("reason")}>
              <Ionicons name="close-circle-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.optionText}>{isQuit ? "Recaí" : "No lo hice"}</Text>
            </Pressable>
          </View>
        )}

        {step === "reason" && (
          <View style={styles.group}>
            <AsaLine text={asa(isQuit ? "missedIntroQuit" : "missedIntro", style)} />
            <View style={styles.reasons}>
              {MISS_REASONS.map((r) => (
                <Pressable
                  key={r.value}
                  style={styles.reasonChip}
                  onPress={() => chooseReason(r.value)}
                  disabled={busy}
                >
                  <Text style={styles.reasonText}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === "adjust" && proposal && (
          <View style={styles.group}>
            <AsaLine text={asa(`adj_${proposal.type}`, style)} />
            {describeChange(proposal.habit, proposal.change) ? (
              <View style={styles.changeBox}>
                <Ionicons name="options-outline" size={16} color={colors.primary} />
                <Text style={styles.changeText}>
                  {describeChange(proposal.habit, proposal.change)}
                </Text>
              </View>
            ) : null}
            <Pressable
              style={[styles.option, styles.optionPrimary]}
              onPress={onApply}
              disabled={busy}
            >
              <Text style={styles.optionPrimaryText}>Aplicar ajuste</Text>
            </Pressable>
            <Pressable style={styles.ghost} onPress={onDismiss} disabled={busy}>
              <Text style={styles.ghostText}>Ahora no</Text>
            </Pressable>
          </View>
        )}

        {step === "done" && (
          <View style={styles.group}>
            <AsaLine text={asa(doneEvent, style)} />
            <Pressable style={[styles.option, styles.optionPrimary]} onPress={onClose}>
              <Text style={styles.optionPrimaryText}>Listo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

// Una línea de ASA con su etiqueta.
function AsaLine({ text }: { text: string }) {
  return (
    <View style={styles.asaLine}>
      <View style={styles.asaBadge}>
        <Text style={styles.asaBadgeText}>ASA</Text>
      </View>
      <Text style={styles.asaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(13,17,23,0.35)" },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  habitName: {
    fontSize: fontSize.lg,
    fontFamily: fonts.headingSemi,
    color: colors.textPrimary,
    textAlign: "center",
  },
  group: { gap: spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    justifyContent: "center",
  },
  optionPrimaryText: { color: colors.onPrimary, fontFamily: fonts.bodySemi, fontSize: fontSize.md },
  optionText: { color: colors.textPrimary, fontFamily: fonts.bodyMedium, fontSize: fontSize.md },
  optionSub: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: fontSize.sm },
  reasons: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  reasonChip: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  reasonText: { color: colors.textPrimary, fontFamily: fonts.bodyMedium, fontSize: fontSize.sm },
  changeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  changeText: { color: colors.textPrimary, fontFamily: fonts.bodyMedium, fontSize: fontSize.sm },
  ghost: { alignItems: "center", padding: spacing.sm },
  ghostText: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: fontSize.md },
  asaLine: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  asaBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  asaBadgeText: { color: colors.onPrimary, fontFamily: fonts.bodySemi, fontSize: fontSize.xs },
  asaText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
});
