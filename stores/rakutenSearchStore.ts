import { supabase } from "../lib/supabase";
import { RakutenSearchResponse } from "../types/rakuten";

/**
 * Search Rakuten Ichiba products via the Supabase Edge Function proxy.
 *
 * @param keyword - Search keyword
 * @param page - Page number (1-based)
 * @param hits - Number of results per page (1-30)
 * @returns Search results with pagination info
 * @throws Error when the edge function returns an error
 */
export async function searchRakuten(
  keyword: string,
  page: number = 1,
  hits: number = 20,
): Promise<RakutenSearchResponse> {
  const { data, error } = await supabase.functions.invoke("rakuten-search", {
    body: { keyword, page, hits },
  });

  if (error) throw error;
  return data as RakutenSearchResponse;
}
