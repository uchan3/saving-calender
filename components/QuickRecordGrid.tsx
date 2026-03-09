import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QuickPreset } from "../types/record";
import { COLORS } from "../constants/colors";

interface QuickRecordGridProps {
  presets: QuickPreset[];
  onQuickRecord: (preset: QuickPreset) => void;
  onMore: () => void;
}

export default function QuickRecordGrid({ presets, onQuickRecord, onMore }: QuickRecordGridProps) {
  return (
    <View style={styles.container} testID="quick-record-grid">
      <Text style={styles.sectionTitle}>Quick Record</Text>
      <View style={styles.grid}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.btn}
            onPress={() => onQuickRecord(preset)}
            testID={`quick-${preset.id}`}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{preset.emoji}</Text>
            <Text style={styles.label} numberOfLines={1}>
              {preset.label}
            </Text>
            <Text
              style={[
                styles.amount,
                { color: preset.type === "saving" ? COLORS.saving : COLORS.splurge },
              ]}
            >
              {preset.type === "saving" ? "+" : "-"}¥{preset.amount.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.btn}
          onPress={onMore}
          testID="quick-more"
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>➕</Text>
          <Text style={styles.label}>More</Text>
          <Text style={styles.moreHint}>Custom</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  btn: {
    width: "31%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
  },
  amount: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  moreHint: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
