import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WishlistItem } from "../types/record";
import { COLORS } from "../constants/colors";

interface WishlistItemCardProps {
  item: WishlistItem;
  unlocked: boolean;
  progress: number;
  onPurchase: (id: string) => void;
  onUnpurchase: (id: string) => void;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
}

export default function WishlistItemCard({
  item,
  unlocked,
  progress,
  onPurchase,
  onUnpurchase,
  onEdit,
  onDelete,
}: WishlistItemCardProps) {
  const isPurchased = item.purchasedAt != null;

  const handlePurchase = () => {
    Alert.alert(
      "Buy this item?",
      `Mark "${item.name}" as purchased for ¥${item.price.toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy!", onPress: () => onPurchase(item.id) },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete item?", `Remove "${item.name}" from your wishlist?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
    ]);
  };

  if (isPurchased) {
    return (
      <View style={[styles.card, styles.purchasedCard]} testID={`wishlist-item-${item.id}`}>
        <View style={styles.row}>
          <Text style={styles.purchasedIcon}>&#x1F6D2;</Text>
          <View style={styles.info}>
            <Text style={[styles.name, styles.purchasedName]}>{item.name}</Text>
            <Text style={styles.purchasedPrice}>&#xA5;{item.price.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.undoBtn}
            onPress={() => onUnpurchase(item.id)}
            testID={`undo-btn-${item.id}`}
          >
            <Text style={styles.undoText}>Undo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (unlocked) {
    return (
      <View style={[styles.card, styles.unlockedCard]} testID={`wishlist-item-${item.id}`}>
        <View style={styles.row}>
          <Text style={styles.unlockedIcon}>&#x1F513;</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.unlockedPrice}>&#xA5;{item.price.toLocaleString()}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={handlePurchase}
              testID={`buy-btn-${item.id}`}
            >
              <Text style={styles.buyText}>Buy!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit(item)} testID={`edit-btn-${item.id}`}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} testID={`delete-btn-${item.id}`}>
              <Text style={styles.deleteText}>Del</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Locked state
  return (
    <View style={[styles.card, styles.lockedCard]} testID={`wishlist-item-${item.id}`}>
      <View style={styles.row}>
        <Text style={styles.lockedIcon}>&#x1F512;</Text>
        <View style={styles.info}>
          <Text style={[styles.name, styles.lockedName]}>{item.name}</Text>
          <Text style={styles.lockedPrice}>&#xA5;{item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(item)} testID={`edit-btn-${item.id}`}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} testID={`delete-btn-${item.id}`}>
            <Text style={styles.deleteText}>Del</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Unlocked
  unlockedCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.wishlistUnlocked,
  },
  unlockedIcon: {
    fontSize: 20,
  },
  unlockedPrice: {
    fontSize: 13,
    color: COLORS.wishlistUnlocked,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  buyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Locked
  lockedCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.wishlistLocked,
  },
  lockedIcon: {
    fontSize: 20,
  },
  lockedName: {
    color: COLORS.textSecondary,
  },
  lockedPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.wishlistNextAccent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
    width: 36,
    textAlign: "right",
  },

  // Purchased
  purchasedCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.wishlistPurchased,
    opacity: 0.7,
  },
  purchasedIcon: {
    fontSize: 20,
  },
  purchasedName: {
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
  purchasedPrice: {
    fontSize: 13,
    color: COLORS.wishlistPurchased,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },

  // Undo
  undoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  undoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // Common
  editText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  deleteText: {
    fontSize: 13,
    color: COLORS.splurge,
    fontWeight: "500",
  },
});
