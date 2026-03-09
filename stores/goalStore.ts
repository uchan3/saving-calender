import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavingsGoal } from "../types/record";

const GOAL_KEY = "savings_goals";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function loadGoals(): Promise<SavingsGoal[]> {
  const json = await AsyncStorage.getItem(GOAL_KEY);
  if (!json) return [];
  return JSON.parse(json) as SavingsGoal[];
}

export async function loadGoal(year: number, month: number): Promise<SavingsGoal | null> {
  const goals = await loadGoals();
  return goals.find((g) => g.year === year && g.month === month) ?? null;
}

export async function saveGoal(year: number, month: number, amount: number): Promise<SavingsGoal> {
  const goals = await loadGoals();
  const existingIndex = goals.findIndex((g) => g.year === year && g.month === month);

  const goal: SavingsGoal = {
    id: existingIndex >= 0 ? goals[existingIndex].id : generateId(),
    targetAmount: amount,
    period: "monthly",
    year,
    month,
    createdAt: existingIndex >= 0 ? goals[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }

  await AsyncStorage.setItem(GOAL_KEY, JSON.stringify(goals));
  return goal;
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
