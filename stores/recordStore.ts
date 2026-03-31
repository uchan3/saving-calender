import { supabase } from "../lib/supabase";
import { SavingRecord, DailySummary, RecordType } from "../types/record";

// --- Supabase CRUD ---

export async function loadRecords(): Promise<SavingRecord[]> {
  const { data, error } = await supabase
    .from("records")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRecord);
}

export async function addRecord(
  userId: string,
  type: RecordType,
  category: string,
  amount: number,
  date: string,
  note?: string,
): Promise<SavingRecord> {
  const { data, error } = await supabase
    .from("records")
    .insert({
      user_id: userId,
      type,
      category,
      amount,
      date,
      note: note ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRecord(data);
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from("records").delete().eq("id", id);
  if (error) throw error;
}

interface RecordRow {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
}

function mapRecord(row: RecordRow): SavingRecord {
  return {
    id: row.id,
    type: row.type as RecordType,
    category: row.category,
    amount: row.amount,
    date: row.date,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

// --- Pure functions (no Supabase dependency) ---

export function getRecordsForDate(records: SavingRecord[], date: string): SavingRecord[] {
  return records.filter((r) => r.date === date);
}

export function getDailySummary(records: SavingRecord[], date: string): DailySummary {
  const dayRecords = getRecordsForDate(records, date);
  const totalSaving = dayRecords
    .filter((r) => r.type === "saving")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalSplurge = dayRecords
    .filter((r) => r.type === "splurge")
    .reduce((sum, r) => sum + r.amount, 0);
  return {
    date,
    totalSaving,
    totalSplurge,
    net: totalSaving - totalSplurge,
  };
}

export function getDailySummariesForMonth(
  records: SavingRecord[],
  year: number,
  month: number,
): Map<string, DailySummary> {
  const summaries = new Map<string, DailySummary>();
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthRecords = records.filter((r) => r.date.startsWith(prefix));

  for (const record of monthRecords) {
    if (!summaries.has(record.date)) {
      summaries.set(record.date, getDailySummary(monthRecords, record.date));
    }
  }
  return summaries;
}

export function calculateStreak(records: SavingRecord[]): number {
  if (records.length === 0) return 0;

  const summaryByDate = new Map<string, number>();
  for (const record of records) {
    const current = summaryByDate.get(record.date) ?? 0;
    const delta = record.type === "saving" ? record.amount : -record.amount;
    summaryByDate.set(record.date, current + delta);
  }

  const dates = Array.from(summaryByDate.keys()).sort().reverse();
  let streak = 0;

  const today = new Date();
  const todayStr = formatDate(today);

  // Start from today and go backwards
  const startDate = dates[0] === todayStr ? today : null;
  if (!startDate) {
    // Check if yesterday had a positive net
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    if (dates[0] !== yesterdayStr) return 0;
  }

  const checkDate = new Date(startDate ?? today);
  if (!startDate) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDate(checkDate);
    const net = summaryByDate.get(dateStr);
    if (net === undefined || net <= 0) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculate cumulative net savings across all records.
 *
 * @param records - All saving records
 * @returns Total savings minus total splurges
 */
export function getCumulativeNet(records: SavingRecord[]): number {
  return records.reduce((sum, r) => sum + (r.type === "saving" ? r.amount : -r.amount), 0);
}

export { formatDate };
