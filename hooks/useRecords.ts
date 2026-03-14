import { useRecordsContext } from "../contexts/RecordsContext";

export function useRecords() {
  return useRecordsContext();
}
