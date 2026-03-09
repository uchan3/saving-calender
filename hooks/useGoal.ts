import { useCallback, useEffect, useState } from "react";
import { SavingsGoal } from "../types/record";
import { loadGoal, saveGoal } from "../stores/goalStore";

export function useGoal(year: number, month: number) {
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [year, month]);

  const set = useCallback(
    async (amount: number) => {
      const newGoal = await saveGoal(year, month, amount);
      setGoal(newGoal);
    },
    [year, month],
  );

  return { goal, loading, set };
}
