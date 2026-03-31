import { useCallback, useRef, useState } from "react";
import { RakutenSearchResult } from "../types/rakuten";
import { searchRakuten } from "../stores/rakutenSearchStore";

/**
 * Hook for searching Rakuten Ichiba products with pagination.
 */
export function useRakutenSearch() {
  const [results, setResults] = useState<RakutenSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const currentPage = useRef(1);
  const currentKeyword = useRef("");

  const search = useCallback(async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    currentKeyword.current = trimmed;
    currentPage.current = 1;
    setLoading(true);
    setError(null);

    try {
      const response = await searchRakuten(trimmed, 1);
      setResults(response.items);
      setHasMore(response.page < response.pageCount);
      currentPage.current = 1;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !currentKeyword.current) return;

    const nextPage = currentPage.current + 1;
    setLoading(true);

    try {
      const response = await searchRakuten(currentKeyword.current, nextPage);
      setResults((prev) => [...prev, ...response.items]);
      setHasMore(response.page < response.pageCount);
      currentPage.current = nextPage;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  const clear = useCallback(() => {
    setResults([]);
    setLoading(false);
    setError(null);
    setHasMore(false);
    currentPage.current = 1;
    currentKeyword.current = "";
  }, []);

  return { results, loading, error, hasMore, search, loadMore, clear };
}
