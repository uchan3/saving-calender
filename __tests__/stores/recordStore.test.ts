import {
  calculateStreak,
  formatDate,
  getDailySummary,
  getDailySummariesForMonth,
  getRecordsForDate,
} from "../../stores/recordStore";
import { SavingRecord } from "../../types/record";

function makeRecord(
  overrides: Partial<SavingRecord> & Pick<SavingRecord, "type" | "amount" | "date">,
): SavingRecord {
  return {
    id: Math.random().toString(36).slice(2),
    category: "Coffee",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("formatDate", () => {
  it("formats date as YYYY-MM-DD", () => {
    const date = new Date(2026, 2, 8); // March 8, 2026
    expect(formatDate(date)).toBe("2026-03-08");
  });

  it("pads single-digit month and day", () => {
    const date = new Date(2026, 0, 5); // Jan 5, 2026
    expect(formatDate(date)).toBe("2026-01-05");
  });
});

describe("getRecordsForDate", () => {
  it("returns only records matching the given date", () => {
    const records = [
      makeRecord({ type: "saving", amount: 500, date: "2026-03-08" }),
      makeRecord({ type: "splurge", amount: 300, date: "2026-03-09" }),
      makeRecord({ type: "saving", amount: 200, date: "2026-03-08" }),
    ];
    const result = getRecordsForDate(records, "2026-03-08");
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.date === "2026-03-08")).toBe(true);
  });

  it("returns empty array when no records match", () => {
    const records = [makeRecord({ type: "saving", amount: 500, date: "2026-03-08" })];
    expect(getRecordsForDate(records, "2026-03-10")).toHaveLength(0);
  });
});

describe("getDailySummary", () => {
  it("calculates saving, splurge, and net totals", () => {
    const records = [
      makeRecord({ type: "saving", amount: 500, date: "2026-03-08" }),
      makeRecord({ type: "saving", amount: 300, date: "2026-03-08" }),
      makeRecord({ type: "splurge", amount: 200, date: "2026-03-08" }),
    ];
    const summary = getDailySummary(records, "2026-03-08");
    expect(summary.totalSaving).toBe(800);
    expect(summary.totalSplurge).toBe(200);
    expect(summary.net).toBe(600);
  });

  it("returns zeros for a date with no records", () => {
    const summary = getDailySummary([], "2026-03-08");
    expect(summary.totalSaving).toBe(0);
    expect(summary.totalSplurge).toBe(0);
    expect(summary.net).toBe(0);
  });
});

describe("getDailySummariesForMonth", () => {
  it("returns summaries grouped by date for the given month", () => {
    const records = [
      makeRecord({ type: "saving", amount: 500, date: "2026-03-01" }),
      makeRecord({ type: "splurge", amount: 200, date: "2026-03-01" }),
      makeRecord({ type: "saving", amount: 1000, date: "2026-03-15" }),
      makeRecord({ type: "saving", amount: 100, date: "2026-04-01" }), // different month
    ];
    const summaries = getDailySummariesForMonth(records, 2026, 3);
    expect(summaries.size).toBe(2);
    expect(summaries.get("2026-03-01")?.net).toBe(300);
    expect(summaries.get("2026-03-15")?.net).toBe(1000);
    expect(summaries.has("2026-04-01")).toBe(false);
  });
});

describe("calculateStreak", () => {
  it("returns 0 for empty records", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("counts consecutive days with positive net from today backwards", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    const records = [
      makeRecord({ type: "saving", amount: 500, date: formatDate(today) }),
      makeRecord({ type: "saving", amount: 300, date: formatDate(yesterday) }),
      makeRecord({
        type: "saving",
        amount: 200,
        date: formatDate(dayBefore),
      }),
    ];
    expect(calculateStreak(records)).toBe(3);
  });

  it("stops streak when a day has negative net", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const records = [
      makeRecord({ type: "saving", amount: 500, date: formatDate(today) }),
      makeRecord({
        type: "splurge",
        amount: 1000,
        date: formatDate(yesterday),
      }),
    ];
    expect(calculateStreak(records)).toBe(1);
  });

  it("counts from yesterday if no records today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - 2);

    const records = [
      makeRecord({
        type: "saving",
        amount: 500,
        date: formatDate(yesterday),
      }),
      makeRecord({
        type: "saving",
        amount: 300,
        date: formatDate(dayBefore),
      }),
    ];
    expect(calculateStreak(records)).toBe(2);
  });
});
