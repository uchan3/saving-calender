import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

interface TodayNetProps {
  totalSaving: number;
  totalSplurge: number;
  net: number;
}

export default function TodayNet({ totalSaving, totalSplurge, net }: TodayNetProps) {
  const netColor = net > 0 ? COLORS.saving : net < 0 ? COLORS.splurge : COLORS.textSecondary;
  const sign = net > 0 ? "+" : "";

  return (
    <View style={styles.card} testID="today-net">
      <Text style={styles.label}>Today&apos;s Net</Text>
      <Text style={[styles.netAmount, { color: netColor }]}>
        {sign}¥{Math.abs(net).toLocaleString()}
      </Text>
      <View style={styles.breakdown}>
        <Text style={[styles.breakdownText, { color: COLORS.saving }]}>
          Saved ¥{totalSaving.toLocaleString()}
        </Text>
        <Text style={[styles.breakdownText, { color: COLORS.splurge }]}>
          Spent ¥{totalSplurge.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  netAmount: {
    fontSize: 32,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  breakdown: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  breakdownText: {
    fontSize: 13,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
});
