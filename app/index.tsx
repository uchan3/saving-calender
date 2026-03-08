import React, { useCallback, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarGrid from "../components/CalendarGrid";
import DayDetail from "../components/DayDetail";
import RecordForm from "../components/RecordForm";
import StreakBadge from "../components/StreakBadge";
import { useRecords } from "../hooks/useRecords";
import {
  calculateStreak,
  formatDate,
  getDailySummariesForMonth,
  getRecordsForDate,
} from "../stores/recordStore";
import { COLORS } from "../constants/colors";

export default function HomeScreen() {
  const { records, add, remove } = useRecords();

  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showForm, setShowForm] = useState(false);

  const [viewYear, viewMonth] = useMemo(() => {
    const [y, m] = selectedDate.split("-");
    return [parseInt(y, 10), parseInt(m, 10)];
  }, [selectedDate]);

  const summaries = useMemo(
    () => getDailySummariesForMonth(records, viewYear, viewMonth),
    [records, viewYear, viewMonth],
  );

  const dayRecords = useMemo(
    () => getRecordsForDate(records, selectedDate),
    [records, selectedDate],
  );

  const streak = useMemo(() => calculateStreak(records), [records]);

  const goToPrevMonth = useCallback(() => {
    const prev = new Date(viewYear, viewMonth - 2, 1);
    setSelectedDate(formatDate(prev));
  }, [viewYear, viewMonth]);

  const goToNextMonth = useCallback(() => {
    const next = new Date(viewYear, viewMonth, 1);
    setSelectedDate(formatDate(next));
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Saving Calender</Text>
          <StreakBadge streak={streak} />
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={goToPrevMonth} testID="prev-month">
            <Text style={styles.navArrow}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <TouchableOpacity onPress={goToNextMonth} testID="next-month">
            <Text style={styles.navArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          summaries={summaries}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          today={today}
        />

        {/* Day Detail */}
        <DayDetail date={selectedDate} records={dayRecords} onDelete={remove} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(true)}
        testID="add-record-btn"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Record Form Modal */}
      <Modal visible={showForm} animationType="slide" testID="record-form-modal">
        <SafeAreaView style={styles.modalContainer}>
          <RecordForm
            date={selectedDate}
            onSubmit={async (type, category, amount, date, note) => {
              await add(type, category, amount, date, note);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navArrow: {
    fontSize: 18,
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: "#FFFFFF",
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
