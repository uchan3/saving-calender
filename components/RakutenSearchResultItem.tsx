import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RakutenSearchResult } from "../types/rakuten";
import { COLORS } from "../constants/colors";

interface RakutenSearchResultItemProps {
  item: RakutenSearchResult;
  onSelect: (item: RakutenSearchResult) => void;
}

export default function RakutenSearchResultItem({ item, onSelect }: RakutenSearchResultItemProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(item)}
      testID={`rakuten-item-${item.itemCode}`}
    >
      {item.mediumImageUrl ? (
        <Image
          source={{ uri: item.mediumImageUrl }}
          style={styles.image}
          testID={`rakuten-image-${item.itemCode}`}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.itemName}
        </Text>
        <Text style={styles.shop} numberOfLines={1}>
          {item.shopName}
        </Text>
      </View>
      <Text style={styles.price}>
        {"\u00A5"}
        {item.itemPrice.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.divider,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 18,
  },
  shop: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
  },
});
