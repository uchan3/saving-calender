const RAKUTEN_API_URL = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RakutenRequestBody {
  keyword: string;
  page?: number;
  hits?: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require Authorization header (caller must be authenticated)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body: RakutenRequestBody = await req.json();
    const { keyword, page = 1, hits = 20 } = body;

    if (!keyword || keyword.trim().length === 0) {
      return new Response(JSON.stringify({ error: "keyword is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read API keys from secrets
    const appId = Deno.env.get("RAKUTEN_APP_ID");
    const accessKey = Deno.env.get("RAKUTEN_ACCESS_KEY");
    if (!appId || !accessKey) {
      return new Response(JSON.stringify({ error: "Rakuten API not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Rakuten API
    const params = new URLSearchParams({
      format: "json",
      applicationId: appId,
      accessKey: accessKey,
      keyword: keyword.trim(),
      hits: String(Math.min(Math.max(hits, 1), 30)),
      page: String(Math.min(Math.max(page, 1), 100)),
      formatVersion: "2",
    });

    const rakutenRes = await fetch(`${RAKUTEN_API_URL}?${params}`);

    if (rakutenRes.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!rakutenRes.ok) {
      const errorBody = await rakutenRes.text();
      return new Response(
        JSON.stringify({
          error: "Rakuten API error",
          status: rakutenRes.status,
          detail: errorBody.slice(0, 500),
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const rakutenData = await rakutenRes.json();

    // Trim response to only needed fields
    const items = (rakutenData.Items ?? []).map((item: Record<string, unknown>) => ({
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      mediumImageUrl: item.mediumImageUrls?.[0] ?? null,
      mediumImageUrls: item.mediumImageUrls ?? [],
      itemUrl: item.itemUrl,
      shopName: item.shopName,
      itemCode: item.itemCode,
      itemCaption: item.itemCaption ?? "",
      catchcopy: item.catchcopy ?? "",
      reviewCount: item.reviewCount ?? 0,
      reviewAverage: item.reviewAverage ?? 0,
    }));

    const response = {
      items,
      pageCount: rakutenData.pageCount ?? 0,
      page: rakutenData.page ?? page,
      hits: rakutenData.hits ?? hits,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error", detail: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
