import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WishlistItemCard from "../../components/WishlistItemCard";
import WishlistForm from "../../components/WishlistForm";
import AddWishlistPicker from "../../components/AddWishlistPicker";
import RakutenSearchModal from "../../components/RakutenSearchModal";
import UnlockCelebration from "../../components/UnlockCelebration";
import { useWishlist } from "../../hooks/useWishlist";
import { useRecords } from "../../hooks/useRecords";
import { getCumulativeNet } from "../../stores/recordStore";
import { computeAvailableBalance, computeUnlockStatus } from "../../stores/wishlistStore";
import { WishlistItem } from "../../types/record";
import { COLORS } from "../../constants/colors";

export default function WishlistScreen() {
  const { records } = useRecords();
  const { items, add, update, remove, purchase, unpurchase } = useWishlist();

  const [showPicker, setShowPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | undefined>(undefined);
  const [celebrationItem, setCelebrationItem] = useState<WishlistItem | null>(null);
  const [knownUnlockedIds, setKnownUnlockedIds] = useState<Set<string>>(new Set());

  const cumulativeNet = useMemo(() => getCumulativeNet(records), [records]);
  const availableBalance = useMemo(
    () => computeAvailableBalance(cumulativeNet, items),
    [cumulativeNet, items],
  );
  const unlockStatus = useMemo(
    () => computeUnlockStatus(availableBalance, items),
    [availableBalance, items],
  );

  // Derive current unlocked IDs
  const currentUnlockedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const item of items) {
      const status = unlockStatus.get(item.id);
      if (status?.unlocked && item.purchasedAt == null) {
        ids.add(item.id);
      }
    }
    return ids;
  }, [items, unlockStatus]);

  // Detect newly unlocked items by comparing with known set
  useEffect(() => {
    if (knownUnlockedIds.size === 0 && currentUnlockedIds.size > 0) {
      // Initial load — just sync without celebrating
      setKnownUnlockedIds(currentUnlockedIds);
      return;
    }

    for (const id of currentUnlockedIds) {
      if (!knownUnlockedIds.has(id)) {
        const item = items.find((i) => i.id === id);
        if (item) {
          setCelebrationItem(item);
          break;
        }
      }
    }

    setKnownUnlockedIds(currentUnlockedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUnlockedIds]);

  // Sort: unlocked first, then locked by progress desc, purchased last
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aStatus = unlockStatus.get(a.id);
      const bStatus = unlockStatus.get(b.id);
      const aPurchased = a.purchasedAt != null;
      const bPurchased = b.purchasedAt != null;

      if (aPurchased !== bPurchased) return aPurchased ? 1 : -1;
      if (aStatus?.unlocked !== bStatus?.unlocked) return aStatus?.unlocked ? -1 : 1;
      return a.price - b.price;
    });
  }, [items, unlockStatus]);

  const unlockedCount = useMemo(
    () => items.filter((i) => i.purchasedAt == null && unlockStatus.get(i.id)?.unlocked).length,
    [items, unlockStatus],
  );
  const totalUnpurchased = useMemo(
    () => items.filter((i) => i.purchasedAt == null).length,
    [items],
  );

  const handleSubmit = useCallback(
    async (name: string, price: number, imageUrl?: string, productUrl?: string) => {
      if (editItem) {
        await update(editItem.id, { name, price, imageUrl, productUrl });
      } else {
        await add(name, price, imageUrl, productUrl);
      }
      setShowForm(false);
      setEditItem(undefined);
    },
    [editItem, add, update],
  );

  const handleEdit = useCallback((item: WishlistItem) => {
    setEditItem(item);
    setShowForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditItem(undefined);
  }, []);

  const handleSearchSelect = useCallback(
    async (name: string, price: number, imageUrl?: string, productUrl?: string) => {
      await add(name, price, imageUrl, productUrl);
    },
    [add],
  );

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => {
      const status = unlockStatus.get(item.id) ?? { unlocked: false, progress: 0 };
      return (
        <WishlistItemCard
          item={item}
          unlocked={status.unlocked}
          progress={status.progress}
          onPurchase={purchase}
          onUnpurchase={unpurchase}
          onEdit={handleEdit}
          onDelete={remove}
        />
      );
    },
    [unlockStatus, purchase, unpurchase, handleEdit, remove],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={[styles.balanceAmount, availableBalance < 0 && styles.balanceNegative]}>
            &#xA5;{availableBalance.toLocaleString()}
          </Text>
          <Text style={styles.balanceSubtext}>
            {unlockedCount}/{totalUnpurchased} items unlocked
          </Text>
        </View>

        {/* Items List */}
        <FlatList
          data={sortedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>&#x1F381;</Text>
              <Text style={styles.emptyText}>No wishlist items yet</Text>
              <Text style={styles.emptyHint}>Add items you want to save up for!</Text>
            </View>
          }
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditItem(undefined);
            setShowPicker(true);
          }}
          testID="add-wishlist-btn"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Add Method Picker */}
        <AddWishlistPicker
          visible={showPicker}
          onSearchRakuten={() => {
            setShowPicker(false);
            setShowSearch(true);
          }}
          onManualEntry={() => {
            setShowPicker(false);
            setShowForm(true);
          }}
          onClose={() => setShowPicker(false)}
        />

        {/* Rakuten Search Modal */}
        {showSearch && (
          <RakutenSearchModal
            visible={showSearch}
            onSelect={handleSearchSelect}
            onClose={() => setShowSearch(false)}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <WishlistForm
            visible={showForm}
            editItem={editItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Celebration Modal */}
        <UnlockCelebration
          visible={celebrationItem != null}
          item={celebrationItem}
          onDismiss={() => setCelebrationItem(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  balanceNegative: {
    color: COLORS.splurge,
  },
  balanceSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 30,
  },
});
