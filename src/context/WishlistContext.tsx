import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import type { WishlistItem, Product } from '@/types';

interface WishlistContextValue {
  items: WishlistItem[];
  loading: boolean;
  toggleItem: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      let { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!wishlist) {
        const { data: newWishlist } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        wishlist = newWishlist;
      }

      if (wishlist) {
        const { data: wItems } = await supabase
          .from('wishlist_items')
          .select('*, product:products(*)')
          .eq('wishlist_id', wishlist.id);
        setItems((wItems as WishlistItem[]) ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleItem = async (product: Product) => {
    if (!user) throw new Error('Please sign in to use your wishlist');

    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wishlist) {
      const { data: newWishlist } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      wishlist = newWishlist;
    }

    if (!wishlist) return;

    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('wishlist_items').delete().eq('id', existing.id);
    } else {
      await supabase.from('wishlist_items').insert({ wishlist_id: wishlist.id, product_id: product.id });
    }

    await fetchWishlist();
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    const { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (wishlist) {
      await supabase.from('wishlist_items').delete().eq('wishlist_id', wishlist.id).eq('product_id', productId);
      await fetchWishlist();
    }
  };

  const isWishlisted = (productId: string) => items.some((i) => i.product_id === productId);

  return (
    <WishlistContext.Provider value={{ items, loading, toggleItem, isWishlisted, removeItem, refresh: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
