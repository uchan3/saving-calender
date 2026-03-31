import { supabase } from "../lib/supabase";
import { WishlistItem } from "../types/record";

// --- Row mapping ---

interface WishlistRow {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  product_url: string | null;
  sort_order: number;
  purchased_at: string | null;
  created_at: string;
}

function mapRow(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    imageUrl: row.image_url ?? undefined,
    productUrl: row.product_url ?? undefined,
    sortOrder: row.sort_order,
    purchasedAt: row.purchased_at ?? undefined,
    createdAt: row.created_at,
  };
}

// --- Supabase CRUD ---

export async function loadWishlistItems(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function addWishlistItem(
  userId: string,
  name: string,
  price: number,
  imageUrl?: string,
  productUrl?: string,
): Promise<WishlistItem> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .insert({
      user_id: userId,
      name,
      price,
      image_url: imageUrl ?? null,
      product_url: productUrl ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateWishlistItem(
  id: string,
  fields: { name?: string; price?: number; imageUrl?: string; productUrl?: string },
): Promise<WishlistItem> {
  const update: Record<string, unknown> = {};
  if (fields.name !== undefined) update.name = fields.name;
  if (fields.price !== undefined) update.price = fields.price;
  if (fields.imageUrl !== undefined) update.image_url = fields.imageUrl;
  if (fields.productUrl !== undefined) update.product_url = fields.productUrl;

  const { data, error } = await supabase
    .from("wishlist_items")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteWishlistItem(id: string): Promise<void> {
  const { error } = await supabase.from("wishlist_items").delete().eq("id", id);
  if (error) throw error;
}

export async function markPurchased(id: string): Promise<WishlistItem> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .update({ purchased_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function undoPurchase(id: string): Promise<WishlistItem> {
  const { data, error } = await supabase
    .from("wishlist_items")
    .update({ purchased_at: null })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

// --- Pure functions ---

/**
 * Calculate available balance: cumulative net minus purchased items' prices.
 */
export function computeAvailableBalance(cumulativeNet: number, items: WishlistItem[]): number {
  const purchasedTotal = items
    .filter((i) => i.purchasedAt != null)
    .reduce((sum, i) => sum + i.price, 0);
  return cumulativeNet - purchasedTotal;
}

/**
 * Determine unlock status for each item.
 * Items are sorted by price ascending, and each unlocked item's price
 * is subtracted from the remaining balance only when purchased.
 */
export function computeUnlockStatus(
  availableBalance: number,
  items: WishlistItem[],
): Map<string, { unlocked: boolean; progress: number }> {
  const result = new Map<string, { unlocked: boolean; progress: number }>();

  for (const item of items) {
    if (item.purchasedAt != null) {
      result.set(item.id, { unlocked: true, progress: 100 });
    } else {
      const unlocked = availableBalance >= item.price;
      const progress = item.price > 0 ? Math.min((availableBalance / item.price) * 100, 100) : 100;
      result.set(item.id, { unlocked, progress: Math.round(progress) });
    }
  }

  return result;
}

/**
 * Get the next item closest to being unlocked (highest progress, not yet unlocked/purchased).
 */
export function getNextUnlockItem(
  availableBalance: number,
  items: WishlistItem[],
): WishlistItem | null {
  const unpurchased = items.filter((i) => i.purchasedAt == null && availableBalance < i.price);
  if (unpurchased.length === 0) return null;

  return unpurchased.reduce((closest, item) => {
    const closestRemaining = closest.price - availableBalance;
    const itemRemaining = item.price - availableBalance;
    return itemRemaining < closestRemaining ? item : closest;
  });
}
