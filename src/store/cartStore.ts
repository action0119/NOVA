import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabaseClient'

export interface CartItem {
  product_id: string
  selected_color: string | null
  selected_size: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string | null, size: string | null) => void
  updateQuantity: (productId: string, color: string | null, size: string | null, quantity: number) => void
  clear: () => void
  syncFromSupabase: (userId: string) => Promise<void>
  syncToSupabase: (userId: string) => Promise<void>
}

const sameLine = (a: CartItem, productId: string, color: string | null, size: string | null) =>
  a.product_id === productId && a.selected_color === color && a.selected_size === size

// Guests get a pure localStorage cart (persist middleware). On login, the store
// is synced with the user's rows in public.cart, which becomes the source of truth.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const idx = items.findIndex((i) => sameLine(i, item.product_id, item.selected_color, item.selected_size))
        if (idx >= 0) {
          const next = [...items]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity }
          set({ items: next })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (productId, color, size) => {
        set({ items: get().items.filter((i) => !sameLine(i, productId, color, size)) })
      },
      updateQuantity: (productId, color, size, quantity) => {
        set({
          items: get().items.map((i) => (sameLine(i, productId, color, size) ? { ...i, quantity } : i)),
        })
      },
      clear: () => set({ items: [] }),
      syncFromSupabase: async (userId: string) => {
        const { data } = await supabase.from('cart').select('*').eq('user_id', userId)
        if (data) {
          set({
            items: data.map((row) => ({
              product_id: row.product_id,
              selected_color: row.selected_color,
              selected_size: row.selected_size,
              quantity: row.quantity,
            })),
          })
        }
      },
      syncToSupabase: async (userId: string) => {
        const items = get().items
        await supabase.from('cart').delete().eq('user_id', userId)
        if (items.length === 0) return
        await supabase.from('cart').insert(
          items.map((i) => ({
            user_id: userId,
            product_id: i.product_id,
            selected_color: i.selected_color,
            selected_size: i.selected_size,
            quantity: i.quantity,
          }))
        )
      },
    }),
    { name: 'nova-cart' }
  )
)
