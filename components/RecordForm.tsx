import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RecordType } from "../types/record";
import { SAVING_PRESETS, SPLURGE_PRESETS } from "../constants/presets";
import { COLORS } from "../constants/colors";

interface RecordFormProps {
  date: string;
  onSubmit: (
    type: RecordType,
    category: string,
    amount: number,
    date: string,
    note?: string,
  ) => void;
  onCancel: () => void;
}

export default function RecordForm({ date, onSubmit, onCancel }: RecordFormProps) {
  const [type, setType] = useState<RecordType>("saving");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const presets = type === "saving" ? SAVING_PRESETS : SPLURGE_PRESETS;

  const handlePresetSelect = (label: string, defaultAmount: number) => {
    setCategory(label);
    if (defaultAmount > 0) {
      setAmount(String(defaultAmount));
    }
  };

  const handleSubmit = () => {
    const numAmount = parseInt(amount, 10);
    if (!category || isNaN(numAmount) || numAmount <= 0) return;
    onSubmit(type, category, numAmount, date, note || undefined);
  };

  const isValid = category.length > 0 && !isNaN(parseInt(amount, 10)) && parseInt(amount, 10) > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Record — {date}</Text>

      {/* Type Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, type === "saving" && styles.toggleSaving]}
          onPress={() => setType("saving")}
          testID="toggle-saving"
        >
          <Text style={[styles.toggleText, type === "saving" && styles.toggleActiveText]}>
            Saving
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, type === "splurge" && styles.toggleSplurge]}
          onPress={() => setType("splurge")}
          testID="toggle-splurge"
        >
          <Text style={[styles.toggleText, type === "splurge" && styles.toggleActiveText]}>
            Splurge
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Presets */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.presetsGrid}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.label}
            style={[styles.presetChip, category === preset.label && styles.presetChipActive]}
            onPress={() => handlePresetSelect(preset.label, preset.defaultAmount)}
            testID={`preset-${preset.label}`}
          >
            <Text
              style={[
                styles.presetChipText,
                category === preset.label && styles.presetChipTextActive,
              ]}
            >
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount */}
      <Text style={styles.label}>Amount (¥)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="0"
        testID="amount-input"
      />

      {/* Note */}
      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Add a note..."
        testID="note-input"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          testID="submit-btn"
        >
          <Text style={styles.submitText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  toggleSaving: {
    backgroundColor: COLORS.savingLight,
    borderColor: COLORS.saving,
  },
  toggleSplurge: {
    backgroundColor: COLORS.splurgeLight,
    borderColor: COLORS.splurge,
  },
  toggleText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  toggleActiveText: {
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  presetChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  presetChipTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
