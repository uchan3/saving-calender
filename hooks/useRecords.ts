import { useCallback, useEffect, useState } from "react";
import { SavingRecord, RecordType } from "../types/record";
import { loadRecords, addRecord, deleteRecord } from "../stores/recordStore";

export function useRecords() {
  const [records, setRecords] = useState<SavingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadRecords().then((data) => {
      if (!cancelled) {
        setRecords(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  const add = useCallback(
    async (type: RecordType, category: string, amount: number, date: string, note?: string) => {
      const record = await addRecord(type, category, amount, date, note);
      setRecords((prev) => [...prev, record]);
      return record;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loading, refresh, add, remove };
}
