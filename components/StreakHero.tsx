import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

interface StreakHeroProps {
  streak: number;
  showRecovery: boolean;
  onRecoverYesterday: () => void;
}

export default function StreakHero({ streak, showRecovery, onRecoverYesterday }: StreakHeroProps) {
  return (
    <View style={styles.container} testID="streak-hero">
      <Text style={styles.fireEmoji}>🔥</Text>
      <Text style={styles.streakNumber}>{streak}</Text>
      <Text style={styles.streakLabel}>day streak</Text>
      {showRecovery && (
        <TouchableOpacity
          style={styles.recoveryBtn}
          onPress={onRecoverYesterday}
          testID="recover-yesterday-btn"
        >
          <Text style={styles.recoveryText}>⚡ Record yesterday&apos;s savings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  fireEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 80,
  },
  streakLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  recoveryBtn: {
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  recoveryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
