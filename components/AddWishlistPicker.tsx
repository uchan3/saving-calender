import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

interface AddWishlistPickerProps {
  visible: boolean;
  onSearchRakuten: () => void;
  onManualEntry: () => void;
  onClose: () => void;
}

export default function AddWishlistPicker({
  visible,
  onSearchRakuten,
  onManualEntry,
  onClose,
}: AddWishlistPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" testID="add-wishlist-picker-modal">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add Wishlist Item</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={onSearchRakuten}
            testID="picker-search-rakuten"
          >
            <Text style={styles.optionIcon}>&#x1F50D;</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Search Rakuten</Text>
              <Text style={styles.optionDesc}>Find products and add with one tap</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={onManualEntry}
            testID="picker-manual-entry"
          >
            <Text style={styles.optionIcon}>&#x270F;&#xFE0F;</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Manual Entry</Text>
              <Text style={styles.optionDesc}>Enter item details yourself</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} testID="picker-cancel">
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
