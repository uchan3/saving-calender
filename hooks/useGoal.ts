import { useCallback, useEffect, useState } from "react";
import { SavingsGoal } from "../types/record";
import { loadGoal, saveGoal } from "../stores/goalStore";
import { ensureUserId } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useGoal(year: number, month: number) {
  const { session } = useAuth();
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    loadGoal(year, month).then((g) => {
      if (!cancelled) {
        setGoal(g);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session, year, month]);

  const set = useCallback(
    async (amount: number) => {
      const userId = session?.user?.id ?? (await ensureUserId());
      const newGoal = await saveGoal(userId, year, month, amount);
      setGoal(newGoal);
    },
    [session, year, month],
  );

  return { goal, loading, set };
}
