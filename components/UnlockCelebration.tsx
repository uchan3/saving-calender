import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WishlistItem } from "../types/record";
import { COLORS } from "../constants/colors";

interface UnlockCelebrationProps {
  visible: boolean;
  item: WishlistItem | null;
  onDismiss: () => void;
}

export default function UnlockCelebration({ visible, item, onDismiss }: UnlockCelebrationProps) {
  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" testID="unlock-celebration-modal">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.emoji}>&#x1F389;</Text>
          <Text style={styles.title}>Item Unlocked!</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>&#xA5;{item.price.toLocaleString()}</Text>
          <Text style={styles.subtitle}>You can now buy this item with your savings!</Text>
          <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
            <Text style={styles.dismissText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 32,
    width: "80%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  dismissBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
