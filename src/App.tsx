import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { useAuthStore } from './store/authStore'
import { useCartStore } from './store/cartStore'
import { supabase } from './lib/supabaseClient'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchPage from './pages/SearchPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import MyPage from './pages/MyPage'
import AIStyleFinderPage from './pages/AIStyleFinderPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const init = useAuthStore((state) => state.init)
  const user = useAuthStore((state) => state.user)
  const syncFromSupabase = useCartStore((state) => state.syncFromSupabase)
  const syncToSupabase = useCartStore((state) => state.syncToSupabase)

  useEffect(() => {
    init()
  }, [init])

  // On login, migrate a guest's local cart into their account if they had no
  // saved cart yet; otherwise the account's saved cart takes over as source of truth.
  useEffect(() => {
    if (!user) return
    const guestItems = useCartStore.getState().items
    supabase
      .from('cart')
      .select('cart_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(async ({ count }) => {
        if (!count && guestItems.length > 0) {
          await syncToSupabase(user.id)
        } else {
          await syncFromSupabase(user.id)
        }
      })
  }, [user, syncFromSupabase, syncToSupabase])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/detail/:id" element={<ProductDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/ai-style-finder" element={<AIStyleFinderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
