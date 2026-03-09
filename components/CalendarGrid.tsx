import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DailySummary } from "../types/record";
import { COLORS } from "../constants/colors";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  year: number;
  month: number;
  summaries: Map<string, DailySummary>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  today: string;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarGrid({
  year,
  month,
  summaries,
  selectedDate,
  onSelectDate,
  today,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((wd) => (
          <View key={wd} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{wd}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((day, colIndex) => {
            if (day === null) {
              return <View key={`empty-${colIndex}`} style={styles.cell} />;
            }
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const summary = summaries.get(dateStr);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;

            let bgColor: string = COLORS.surface;
            if (summary) {
              if (summary.net > 0) bgColor = COLORS.savingLight;
              else if (summary.net < 0) bgColor = COLORS.splurgeLight;
              else bgColor = COLORS.neutralLight;
            }

            return (
              <TouchableOpacity
                key={dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: bgColor },
                  isSelected && styles.selectedCell,
                  isToday && styles.todayCell,
                ]}
                onPress={() => onSelectDate(dateStr)}
                testID={`calendar-day-${dateStr}`}
              >
                <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                {summary && summary.net !== 0 && (
                  <Text
                    style={[
                      styles.netText,
                      { color: summary.net > 0 ? COLORS.saving : COLORS.splurge },
                    ]}
                  >
                    {summary.net > 0 ? "+" : ""}
                    {summary.net}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
          {/* Fill remaining cells in last row */}
          {row.length < 7 &&
            Array.from({ length: 7 - row.length }).map((_, i) => (
              <View key={`pad-${i}`} style={styles.cell} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
    borderRadius: 4,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  todayText: {
    fontWeight: "bold",
  },
  netText: {
    fontSize: 9,
    fontWeight: "600",
  },
});
