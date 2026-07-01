import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

interface WishlistState {
  productIds: Set<string>
  fetch: (userId: string) => Promise<void>
  toggle: (userId: string, productId: string) => Promise<boolean>
  reset: () => void
}

// Wishlist has no guest-id column in the schema, so it is login-gated:
// state is fetched from Supabase per authenticated user, never persisted locally.
export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: new Set(),
  fetch: async (userId) => {
    const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', userId)
    set({ productIds: new Set((data ?? []).map((r) => r.product_id)) })
  },
  toggle: async (userId, productId) => {
    const has = get().productIds.has(productId)
    if (has) {
      await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId)
      const next = new Set(get().productIds)
      next.delete(productId)
      set({ productIds: next })
      return false
    }
    await supabase.from('wishlist').insert({ user_id: userId, product_id: productId })
    const next = new Set(get().productIds)
    next.add(productId)
    set({ productIds: next })
    return true
  },
  reset: () => set({ productIds: new Set() }),
}))
