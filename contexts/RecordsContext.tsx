import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SavingRecord, RecordType } from "../types/record";
import { loadRecords, addRecord, deleteRecord } from "../stores/recordStore";
import { ensureUserId } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface RecordsContextValue {
  records: SavingRecord[];
  loading: boolean;
  add: (
    type: RecordType,
    category: string,
    amount: number,
    date: string,
    note?: string,
  ) => Promise<SavingRecord>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const RecordsContext = createContext<RecordsContextValue>({
  records: [],
  loading: true,
  add: () => Promise.reject(new Error("No RecordsProvider")),
  remove: () => Promise.reject(new Error("No RecordsProvider")),
  refresh: () => Promise.resolve(),
});

export function useRecordsContext() {
  return useContext(RecordsContext);
}

export function RecordsProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [records, setRecords] = useState<SavingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
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
  }, [session]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  const add = useCallback(
    async (type: RecordType, category: string, amount: number, date: string, note?: string) => {
      const userId = session?.user?.id ?? (await ensureUserId());
      const record = await addRecord(userId, type, category, amount, date, note);
      setRecords((prev) => [...prev, record]);
      return record;
    },
    [session],
  );

  const remove = useCallback(async (id: string) => {
    await deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <RecordsContext.Provider value={{ records, loading, add, remove, refresh }}>
      {children}
    </RecordsContext.Provider>
  );
}
