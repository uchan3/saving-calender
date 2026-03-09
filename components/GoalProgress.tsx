import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SavingsGoal } from "../types/record";
import { COLORS } from "../constants/colors";

interface GoalProgressProps {
  goal: SavingsGoal | null;
  currentAmount: number;
  monthLabel: string;
  onSetGoal: (amount: number) => void;
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return COLORS.goalComplete;
  if (percentage >= 70) return COLORS.goalHigh;
  if (percentage >= 30) return COLORS.goalMid;
  return COLORS.goalLow;
}

export default function GoalProgress({
  goal,
  currentAmount,
  monthLabel,
  onSetGoal,
}: GoalProgressProps) {
  const [showModal, setShowModal] = useState(false);
  const [inputAmount, setInputAmount] = useState("");

  const handleSave = () => {
    const amount = parseInt(inputAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    onSetGoal(amount);
    setShowModal(false);
    setInputAmount("");
  };

  if (!goal) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowModal(true)}
        testID="set-goal-btn"
      >
        <Text style={styles.setGoalText}>🎯 Set {monthLabel} goal</Text>
        <Text style={styles.setGoalHint}>Tap to set a monthly savings target</Text>
        <GoalModal
          visible={showModal}
          monthLabel={monthLabel}
          inputAmount={inputAmount}
          onChangeAmount={setInputAmount}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setInputAmount("");
          }}
        />
      </TouchableOpacity>
    );
  }

  const percentage = Math.round((currentAmount / goal.targetAmount) * 100);
  const clampedWidth = Math.min(percentage, 100);
  const progressColor = getProgressColor(percentage);

  return (
    <View style={styles.card} testID="goal-progress">
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          setInputAmount(String(goal.targetAmount));
          setShowModal(true);
        }}
      >
        <Text style={styles.title}>
          🎯 {monthLabel} Goal{percentage >= 100 ? " 🎉" : ""}
        </Text>
        <Text style={styles.editHint}>Edit</Text>
      </TouchableOpacity>

      <View style={styles.barContainer}>
        <View
          style={[styles.barFill, { width: `${clampedWidth}%`, backgroundColor: progressColor }]}
        />
      </View>

      <View style={styles.stats}>
        <Text style={[styles.percentage, { color: progressColor }]}>{percentage}%</Text>
        <Text style={styles.amounts}>
          ¥{currentAmount.toLocaleString()} / ¥{goal.targetAmount.toLocaleString()}
        </Text>
      </View>

      <GoalModal
        visible={showModal}
        monthLabel={monthLabel}
        inputAmount={inputAmount}
        onChangeAmount={setInputAmount}
        onSave={handleSave}
        onCancel={() => {
          setShowModal(false);
          setInputAmount("");
        }}
      />
    </View>
  );
}

interface GoalModalProps {
  visible: boolean;
  monthLabel: string;
  inputAmount: string;
  onChangeAmount: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function GoalModal({
  visible,
  monthLabel,
  inputAmount,
  onChangeAmount,
  onSave,
  onCancel,
}: GoalModalProps) {
  const isValid = !isNaN(parseInt(inputAmount, 10)) && parseInt(inputAmount, 10) > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" testID="goal-modal">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>{monthLabel} Savings Goal</Text>
          <TextInput
            style={modalStyles.input}
            value={inputAmount}
            onChangeText={onChangeAmount}
            keyboardType="number-pad"
            placeholder="e.g. 30000"
            testID="goal-amount-input"
            autoFocus
          />
          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveBtn, !isValid && modalStyles.saveBtnDisabled]}
              onPress={onSave}
              disabled={!isValid}
              testID="goal-save-btn"
            >
              <Text style={modalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  editHint: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  barContainer: {
    height: 10,
    backgroundColor: COLORS.divider,
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  percentage: {
    fontSize: 20,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  amounts: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  setGoalText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  setGoalHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: "80%",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
