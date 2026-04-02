import React, { useEffect, useRef } from "react";
import {
  Alert,
  AppState,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WishlistItem } from "../types/record";
import { COLORS } from "../constants/colors";

interface WishlistItemDetailProps {
  visible: boolean;
  item: WishlistItem;
  unlocked: boolean;
  progress: number;
  onPurchase: (id: string) => void;
  onUnpurchase: (id: string) => void;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function WishlistItemDetail({
  visible,
  item,
  unlocked,
  progress,
  onPurchase,
  onUnpurchase,
  onEdit,
  onDelete,
  onClose,
}: WishlistItemDetailProps) {
  const isPurchased = item.purchasedAt != null;
  const waitingForReturn = useRef(false);

  // When user returns from external browser, show purchase confirmation
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && waitingForReturn.current) {
        waitingForReturn.current = false;
        Alert.alert("Did you complete the purchase?", `Mark "${item.name}" as purchased?`, [
          { text: "Not yet", style: "cancel" },
          {
            text: "Yes, purchased!",
            onPress: () => {
              onPurchase(item.id);
              onClose();
            },
          },
        ]);
      }
    });
    return () => subscription.remove();
  }, [item, onPurchase, onClose]);

  const handlePurchase = () => {
    if (item.productUrl) {
      waitingForReturn.current = true;
      Linking.openURL(item.productUrl);
    } else {
      Alert.alert(
        "Buy this item?",
        `Mark "${item.name}" as purchased for \u00A5${item.price.toLocaleString()}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Buy!",
            onPress: () => {
              onPurchase(item.id);
              onClose();
            },
          },
        ],
      );
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete item?", `Remove "${item.name}" from your wishlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete(item.id);
          onClose();
        },
      },
    ]);
  };

  const handleOpenUrl = () => {
    if (item.productUrl) {
      Linking.openURL(item.productUrl);
    }
  };

  const statusLabel = isPurchased ? "Purchased" : unlocked ? "Unlocked" : "Locked";
  const statusColor = isPurchased
    ? COLORS.wishlistPurchased
    : unlocked
      ? COLORS.wishlistUnlocked
      : COLORS.wishlistLocked;

  return (
    <Modal visible={visible} animationType="slide" testID="wishlist-item-detail-modal">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} testID="wishlist-detail-close-btn">
            <Text style={styles.backText}>{"\u2190"} Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Image */}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="contain"
              testID="wishlist-detail-image"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageEmoji}>{"\uD83C\uDF81"}</Text>
            </View>
          )}

          {/* Info */}
          <View style={styles.infoSection}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>

            <Text style={styles.itemName}>{item.name}</Text>

            <Text style={styles.price}>
              {"\u00A5"}
              {item.price.toLocaleString()}
            </Text>

            {/* Progress (locked only) */}
            {!isPurchased && !unlocked && (
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{progress}% saved</Text>
              </View>
            )}

            {/* Product Link */}
            {item.productUrl && (
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={handleOpenUrl}
                testID="wishlist-detail-link"
              >
                <Text style={styles.linkText}>View on Store {"\u2197"}</Text>
              </TouchableOpacity>
            )}

            {/* Meta */}
            <View style={styles.metaSection}>
              <Text style={styles.metaLabel}>Added</Text>
              <Text style={styles.metaValue}>
                {new Date(item.createdAt).toLocaleDateString("ja-JP")}
              </Text>
            </View>
            {isPurchased && item.purchasedAt && (
              <View style={styles.metaSection}>
                <Text style={styles.metaLabel}>Purchased</Text>
                <Text style={styles.metaValue}>
                  {new Date(item.purchasedAt).toLocaleDateString("ja-JP")}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomBar}>
          {isPurchased ? (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                onUnpurchase(item.id);
                onClose();
              }}
              testID="wishlist-detail-undo-btn"
            >
              <Text style={styles.secondaryBtnText}>Undo Purchase</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleDelete}
                testID="wishlist-detail-delete-btn"
              >
                <Text style={styles.deleteIcon}>{"\uD83D\uDDD1"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  onEdit(item);
                  onClose();
                }}
                testID="wishlist-detail-edit-btn"
              >
                <Text style={styles.secondaryBtnText}>Edit</Text>
              </TouchableOpacity>
              {unlocked && (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handlePurchase}
                  testID="wishlist-detail-buy-btn"
                >
                  <Text style={styles.primaryBtnText}>Buy!</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: COLORS.primaryDark,
  },
  backText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    height: 280,
    backgroundColor: COLORS.surface,
  },
  noImage: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageEmoji: {
    fontSize: 56,
  },
  infoSection: {
    padding: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  price: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.divider,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.wishlistNextAccent,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  linkBtn: {
    backgroundColor: COLORS.primaryLight + "40",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  metaLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  metaValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    gap: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    fontSize: 20,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  primaryBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
