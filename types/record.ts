export type RecordType = "saving" | "splurge";

export interface SavingRecord {
  id: string;
  type: RecordType;
  category: string;
  amount: number;
  date: string; // ISO date string "YYYY-MM-DD"
  note?: string;
  createdAt: string; // ISO datetime string
}

export interface DailySummary {
  date: string;
  totalSaving: number;
  totalSplurge: number;
  net: number; // totalSaving - totalSplurge
}

export interface QuickPreset {
  id: string;
  emoji: string;
  label: string;
  type: RecordType;
  amount: number;
  order: number;
}

export interface SavingsGoal {
  id: string;
  targetAmount: number;
  period: "monthly";
  year: number;
  month: number;
  createdAt: string;
}
