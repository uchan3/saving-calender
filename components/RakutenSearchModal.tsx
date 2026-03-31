import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRakutenSearch } from "../hooks/useRakutenSearch";
import { RakutenSearchResult } from "../types/rakuten";
import RakutenSearchResultItem from "./RakutenSearchResultItem";
import RakutenItemDetail from "./RakutenItemDetail";
import { COLORS } from "../constants/colors";

interface RakutenSearchModalProps {
  visible: boolean;
  onSelect: (name: string, price: number, imageUrl?: string, productUrl?: string) => void;
  onClose: () => void;
}

export default function RakutenSearchModal({
  visible,
  onSelect,
  onClose,
}: RakutenSearchModalProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState<RakutenSearchResult | null>(null);
  const { results, loading, error, hasMore, search, loadMore, clear } = useRakutenSearch();

  const handleSearch = () => {
    if (keyword.trim()) {
      search(keyword);
    }
  };

  const handleItemPress = (item: RakutenSearchResult) => {
    setSelectedItem(item);
  };

  const handleAddFromDetail = (item: RakutenSearchResult) => {
    onSelect(item.itemName, item.itemPrice, item.mediumImageUrl ?? undefined, item.itemUrl);
    setSelectedItem(null);
    handleClose();
  };

  const handleClose = () => {
    setKeyword("");
    clear();
    onClose();
  };

  const renderFooter = () => {
    if (loading && results.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }
    if (hasMore) {
      return (
        <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} testID="load-more-btn">
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" testID="rakuten-search-modal">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Rakuten</Text>
          <TouchableOpacity onPress={handleClose} testID="search-close-btn">
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Search products..."
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoFocus
            testID="rakuten-search-input"
          />
          <TouchableOpacity
            style={[styles.searchBtn, !keyword.trim() && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={!keyword.trim()}
            testID="rakuten-search-btn"
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.itemCode}
          renderItem={({ item }) => (
            <RakutenSearchResultItem item={item} onSelect={handleItemPress} />
          )}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && !error ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {results.length === 0 && keyword.trim()
                    ? "No results found"
                    : "Search for products to add to your wishlist"}
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Initial loading */}
        {loading && results.length === 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        {/* Item Detail */}
        {selectedItem && (
          <RakutenItemDetail
            visible={selectedItem != null}
            item={selectedItem}
            onAdd={handleAddFromDetail}
            onClose={() => setSelectedItem(null)}
          />
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: COLORS.primaryDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchBtnDisabled: {
    opacity: 0.4,
  },
  searchBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  errorContainer: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: COLORS.splurgeLight,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.splurge,
    textAlign: "center",
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: 180,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loadMoreBtn: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
  },
});
