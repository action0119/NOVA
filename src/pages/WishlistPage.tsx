import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../utils/format'
import { useAuthStore } from '../store/authStore'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { useCartStore } from '../store/cartStore'
import { useToast } from '../context/ToastContext'
import type { ProductWithBrand } from '../hooks/useProducts'

export default function WishlistPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const { toggle } = useWishlistToggle()
  const addToCart = useCartStore((s) => s.addItem)
  const [items, setItems] = useState<ProductWithBrand[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('wishlist')
      .select('product(*, brand(brand_id, brand_name))')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const products = (data ?? [])
          .map((row) => row.product as unknown as ProductWithBrand)
          .filter(Boolean)
        setItems(products)
      })
  }, [user])

  if (!user) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', py: 15, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, color: '#555555', mb: 3 }}>로그인이 필요한 페이지입니다.</Typography>
        <Button
          onClick={() => navigate('/login')}
          sx={{ height: 48, px: 4, bgcolor: '#111111', color: '#FFFFFF', borderRadius: 0 }}
        >
          로그인하기
        </Button>
      </Box>
    )
  }

  const handleRemove = async (productId: string) => {
    await toggle(productId)
    setItems((prev) => prev.filter((p) => p.product_id !== productId))
  }

  const handleMoveToCart = (product: ProductWithBrand) => {
    addToCart({
      product_id: product.product_id,
      selected_color: product.color?.[0] ?? null,
      selected_size: product.size?.[0] ?? null,
      quantity: 1,
    })
    showToast('장바구니로 이동되었습니다.')
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#111111', mb: 5 }}>Wishlist</Typography>

      {items.length === 0 && (
        <Typography sx={{ fontSize: 14, color: '#888888', py: 8, textAlign: 'center' }}>
          관심목록에 담긴 상품이 없습니다.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((product) => (
          <Box
            key={product.product_id}
            sx={{ display: 'flex', gap: 3, alignItems: 'center', borderBottom: '1px solid #E5E5E5', pb: 3 }}
          >
            <Box
              component="img"
              src={product.product_image ?? undefined}
              alt={product.product_name}
              onClick={() => navigate(`/products/detail/${product.product_id}`)}
              sx={{ width: 100, height: 130, objectFit: 'cover', cursor: 'pointer' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, color: '#888888' }}>{product.brand?.brand_name}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#111111' }}>{product.product_name}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111111' }}>
                {formatPrice(product.product_price)}
              </Typography>
            </Box>
            <Button
              onClick={() => handleMoveToCart(product)}
              sx={{ height: 40, px: 2, border: '1px solid #DCDCDC', color: '#111111', borderRadius: 0 }}
            >
              장바구니 담기
            </Button>
            <Box
              component="button"
              onClick={() => handleRemove(product.product_id)}
              aria-label="관심목록 삭제"
              sx={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: '#3157FF' }}
            >
              <Heart size={22} fill="#3157FF" />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
