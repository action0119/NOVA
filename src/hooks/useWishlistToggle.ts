import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useToast } from '../context/ToastContext'

// Wishlist has no guest-id column (see supabase/migrations), so it is
// login-gated: toggling while logged out prompts a login redirect instead.
export function useWishlistToggle() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const productIds = useWishlistStore((s) => s.productIds)
  const fetchWishlist = useWishlistStore((s) => s.fetch)
  const toggleWishlist = useWishlistStore((s) => s.toggle)

  useEffect(() => {
    if (user) fetchWishlist(user.id)
  }, [user, fetchWishlist])

  const isWishlisted = (productId: string) => productIds.has(productId)

  const toggle = async (productId: string) => {
    if (!user) {
      showToast('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }
    const added = await toggleWishlist(user.id, productId)
    showToast(added ? '관심목록에 추가되었습니다.' : '관심목록에서 삭제되었습니다.')
  }

  return { isWishlisted, toggle, loggedIn: Boolean(user) }
}
