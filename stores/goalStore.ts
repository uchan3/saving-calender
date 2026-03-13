import { supabase } from "../lib/supabase";
import { SavingsGoal } from "../types/record";

interface GoalRow {
  id: string;
  target_amount: number;
  period: string;
  year: number;
  month: number;
  created_at: string;
}

function mapGoal(row: GoalRow): SavingsGoal {
  return {
    id: row.id,
    targetAmount: row.target_amount,
    period: row.period as "monthly",
    year: row.year,
    month: row.month,
    createdAt: row.created_at,
  };
}

export async function loadGoal(year: number, month: number): Promise<SavingsGoal | null> {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapGoal(data);
}

export async function saveGoal(
  userId: string,
  year: number,
  month: number,
  amount: number,
): Promise<SavingsGoal> {
  const { data, error } = await supabase
    .from("goals")
    .upsert(
      {
        user_id: userId,
        target_amount: amount,
        period: "monthly",
        year,
        month,
      },
      { onConflict: "user_id,year,month" },
    )
    .select()
    .single();

  if (error) throw error;
  return mapGoal(data);
}

export function getMonthlyNet(
  records: { type: string; amount: number; date: string }[],
  year: number,
  month: number,
): number {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return records
    .filter((r) => r.date.startsWith(prefix))
    .reduce((sum, r) => sum + (r.type === "saving" ? r.amount : -r.amount), 0);
}
