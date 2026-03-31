import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { WishlistItem } from "../types/record";
import { COLORS } from "../constants/colors";

interface WishlistProgressProps {
  availableBalance: number;
  unlockedCount: number;
  totalCount: number;
  nextItem: WishlistItem | null;
  nextItemProgress: number;
}

export default function WishlistProgress({
  availableBalance,
  unlockedCount,
  totalCount,
  nextItem,
  nextItemProgress,
}: WishlistProgressProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/wishlist")}
      testID="wishlist-progress"
    >
      <View style={styles.header}>
        <Text style={styles.title}>&#x1F381; Wishlist</Text>
        <Text style={styles.balance}>&#xA5;{availableBalance.toLocaleString()}</Text>
      </View>

      <Text style={styles.stats}>
        {unlockedCount}/{totalCount} items unlocked
      </Text>

      {nextItem && (
        <View style={styles.nextItem}>
          <View style={styles.nextHeader}>
            <Text style={styles.nextLabel}>Next unlock:</Text>
            <Text style={styles.nextName} numberOfLines={1}>
              {nextItem.name}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${nextItemProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{nextItemProgress}%</Text>
          </View>
        </View>
      )}

      {totalCount === 0 && <Text style={styles.emptyHint}>Tap to add wishlist items</Text>}
    </TouchableOpacity>
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
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  balance: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
  },
  stats: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  nextItem: {
    marginTop: 10,
    backgroundColor: COLORS.wishlistNextBg,
    borderRadius: 10,
    padding: 10,
  },
  nextHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  nextLabel: {
    fontSize: 12,
    color: COLORS.wishlistNextAccent,
    fontWeight: "600",
  },
  nextName: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.wishlistNextAccent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.wishlistNextAccent,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    width: 36,
    textAlign: "right",
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
