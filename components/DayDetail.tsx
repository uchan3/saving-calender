import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavingRecord } from "../types/record";
import { COLORS } from "../constants/colors";

interface DayDetailProps {
  date: string;
  records: SavingRecord[];
  onDelete: (id: string) => void;
}

export default function DayDetail({ date, records, onDelete }: DayDetailProps) {
  const totalSaving = records
    .filter((r) => r.type === "saving")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalSplurge = records
    .filter((r) => r.type === "splurge")
    .reduce((sum, r) => sum + r.amount, 0);
  const net = totalSaving - totalSplurge;

  const confirmDelete = (id: string) => {
    Alert.alert("Delete record", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateTitle}>{date}</Text>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryText, { color: COLORS.saving }]}>
          Saved: ¥{totalSaving.toLocaleString()}
        </Text>
        <Text style={[styles.summaryText, { color: COLORS.splurge }]}>
          Spent: ¥{totalSplurge.toLocaleString()}
        </Text>
        <Text style={[styles.summaryText, { color: net >= 0 ? COLORS.saving : COLORS.splurge }]}>
          Net: ¥{net.toLocaleString()}
        </Text>
      </View>
      {records.length === 0 && <Text style={styles.emptyText}>No records for this day</Text>}
      {records.map((record) => (
        <TouchableOpacity
          key={record.id}
          style={styles.recordRow}
          onLongPress={() => confirmDelete(record.id)}
          testID={`record-${record.id}`}
        >
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  record.type === "saving" ? COLORS.savingLight : COLORS.splurgeLight,
              },
            ]}
          >
            <Text
              style={{
                color: record.type === "saving" ? COLORS.saving : COLORS.splurge,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {record.type === "saving" ? "Saved" : "Spent"}
            </Text>
          </View>
          <Text style={styles.recordCategory}>{record.category}</Text>
          <Text
            style={[
              styles.recordAmount,
              {
                color: record.type === "saving" ? COLORS.saving : COLORS.splurge,
              },
            ]}
          >
            ¥{record.amount.toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}
      {records.length > 0 && <Text style={styles.hintText}>Long press a record to delete</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recordCategory: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  recordAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  hintText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 8,
  },
});
