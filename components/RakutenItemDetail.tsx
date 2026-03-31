import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RakutenSearchResult } from "../types/rakuten";
import { COLORS } from "../constants/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

interface RakutenItemDetailProps {
  visible: boolean;
  item: RakutenSearchResult;
  onAdd: (item: RakutenSearchResult) => void;
  onClose: () => void;
}

function StarRating({ average, count }: { average: number; count: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(average)) {
      stars.push("\u2605");
    } else if (i - 0.5 <= average) {
      stars.push("\u2BEA");
    } else {
      stars.push("\u2606");
    }
  }

  return (
    <View style={styles.ratingRow}>
      <Text style={styles.stars}>{stars.join("")}</Text>
      <Text style={styles.ratingText}>
        {average.toFixed(1)} ({count.toLocaleString()} reviews)
      </Text>
    </View>
  );
}

export default function RakutenItemDetail({
  visible,
  item,
  onAdd,
  onClose,
}: RakutenItemDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const images = item.mediumImageUrls.length > 0 ? item.mediumImageUrls : null;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  const handleAdd = () => {
    onAdd(item);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" testID="rakuten-item-detail-modal">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} testID="detail-close-btn">
            <Text style={styles.backText}>{"\u2190"} Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Image Carousel */}
          {images ? (
            <View>
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item: uri }) => (
                  <Image source={{ uri }} style={styles.carouselImage} resizeMode="contain" />
                )}
              />
              {images.length > 1 && (
                <View style={styles.pagination}>
                  {images.map((_, i) => (
                    <View
                      key={i}
                      style={[styles.dot, i === activeImageIndex && styles.dotActive]}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}

          {/* Product Info */}
          <View style={styles.infoSection}>
            {item.catchcopy ? <Text style={styles.catchcopy}>{item.catchcopy}</Text> : null}
            <Text style={styles.itemName}>{item.itemName}</Text>

            <Text style={styles.price}>
              {"\u00A5"}
              {item.itemPrice.toLocaleString()}
            </Text>

            <View style={styles.shopRow}>
              <Text style={styles.shopLabel}>Shop:</Text>
              <Text style={styles.shopName}>{item.shopName}</Text>
            </View>

            {/* Reviews */}
            {item.reviewCount > 0 && (
              <View style={styles.reviewSection}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <StarRating average={item.reviewAverage} count={item.reviewCount} />
              </View>
            )}

            {/* Description */}
            {item.itemCaption ? (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{item.itemCaption}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} testID="detail-cancel-btn">
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} testID="detail-add-btn">
            <Text style={styles.addBtnText}>Add to Wishlist</Text>
          </TouchableOpacity>
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
  carouselImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: COLORS.surface,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  noImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT * 0.6,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    fontSize: 16,
    color: COLORS.textTertiary,
  },
  infoSection: {
    padding: 20,
  },
  catchcopy: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
    marginBottom: 12,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  shopLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  shopName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  reviewSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stars: {
    fontSize: 18,
    color: COLORS.streak,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  descriptionSection: {
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  addBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
