import { searchRakuten } from "../../stores/rakutenSearchStore";
import { supabase } from "../../lib/supabase";

// Mock supabase.functions.invoke (unmanaged external dependency)
jest.mock("../../lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

const mockInvoke = supabase.functions.invoke as jest.Mock;

describe("searchRakuten", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls supabase.functions.invoke with correct arguments", async () => {
    const mockResponse = {
      items: [
        {
          itemName: "Test Item",
          itemPrice: 3000,
          mediumImageUrl: "https://example.com/img.jpg",
          itemUrl: "https://example.com/item",
          shopName: "Test Shop",
          itemCode: "test-001",
        },
      ],
      pageCount: 1,
      page: 1,
      hits: 20,
    };

    mockInvoke.mockResolvedValue({ data: mockResponse, error: null });

    const result = await searchRakuten("headphones", 1, 20);

    expect(mockInvoke).toHaveBeenCalledWith("rakuten-search", {
      body: { keyword: "headphones", page: 1, hits: 20 },
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].itemName).toBe("Test Item");
    expect(result.items[0].itemPrice).toBe(3000);
  });

  it("uses default page and hits when not provided", async () => {
    mockInvoke.mockResolvedValue({
      data: { items: [], pageCount: 0, page: 1, hits: 20 },
      error: null,
    });

    await searchRakuten("test");

    expect(mockInvoke).toHaveBeenCalledWith("rakuten-search", {
      body: { keyword: "test", page: 1, hits: 20 },
    });
  });

  it("throws when supabase returns an error", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: new Error("Function invocation failed"),
    });

    await expect(searchRakuten("test")).rejects.toThrow("Function invocation failed");
  });

  it("returns pagination info", async () => {
    mockInvoke.mockResolvedValue({
      data: { items: [], pageCount: 5, page: 2, hits: 20 },
      error: null,
    });

    const result = await searchRakuten("test", 2);

    expect(result.pageCount).toBe(5);
    expect(result.page).toBe(2);
  });
});
