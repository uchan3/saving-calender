import { useCallback, useEffect, useState } from "react";
import { WishlistItem } from "../types/record";
import {
  loadWishlistItems,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  markPurchased,
  undoPurchase,
} from "../stores/wishlistStore";
import { ensureUserId } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useWishlist() {
  const { session } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    loadWishlistItems().then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const add = useCallback(
    async (name: string, price: number, imageUrl?: string, productUrl?: string) => {
      const userId = session?.user?.id ?? (await ensureUserId());
      const item = await addWishlistItem(userId, name, price, imageUrl, productUrl);
      setItems((prev) => [...prev, item]);
      return item;
    },
    [session],
  );

  const update = useCallback(
    async (
      id: string,
      fields: { name?: string; price?: number; imageUrl?: string; productUrl?: string },
    ) => {
      const updated = await updateWishlistItem(id, fields);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await deleteWishlistItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const purchase = useCallback(async (id: string) => {
    const updated = await markPurchased(id);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  const unpurchase = useCallback(async (id: string) => {
    const updated = await undoPurchase(id);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  return { items, loading, add, update, remove, purchase, unpurchase };
}
