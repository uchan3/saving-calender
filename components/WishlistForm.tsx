import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { WishlistItem } from "../types/record";
import { COLORS } from "../constants/colors";

interface WishlistFormProps {
  visible: boolean;
  editItem?: WishlistItem;
  onSubmit: (name: string, price: number, imageUrl?: string, productUrl?: string) => void;
  onCancel: () => void;
}

export default function WishlistForm({ visible, editItem, onSubmit, onCancel }: WishlistFormProps) {
  const [name, setName] = useState(editItem?.name ?? "");
  const [price, setPrice] = useState(editItem ? String(editItem.price) : "");
  const [imageUrl, setImageUrl] = useState(editItem?.imageUrl ?? "");
  const [productUrl, setProductUrl] = useState(editItem?.productUrl ?? "");

  const handleSubmit = () => {
    const numPrice = parseInt(price, 10);
    if (!name.trim() || isNaN(numPrice) || numPrice <= 0) return;
    onSubmit(name.trim(), numPrice, imageUrl.trim() || undefined, productUrl.trim() || undefined);
  };

  const isValid = name.trim().length > 0 && !isNaN(parseInt(price, 10)) && parseInt(price, 10) > 0;
  const title = editItem ? "Edit Wishlist Item" : "Add Wishlist Item";

  return (
    <Modal visible={visible} transparent animationType="fade" testID="wishlist-form-modal">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Wireless Headphones"
            testID="wishlist-name-input"
            autoFocus
          />

          <Text style={styles.label}>Price (¥)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
            placeholder="e.g. 5000"
            testID="wishlist-price-input"
          />

          <Text style={styles.label}>Image URL (optional)</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://..."
            autoCapitalize="none"
            testID="wishlist-image-url-input"
          />

          <Text style={styles.label}>Product URL (optional)</Text>
          <TextInput
            style={styles.input}
            value={productUrl}
            onChangeText={setProductUrl}
            placeholder="https://..."
            autoCapitalize="none"
            testID="wishlist-product-url-input"
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
              testID="wishlist-save-btn"
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: "85%",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
