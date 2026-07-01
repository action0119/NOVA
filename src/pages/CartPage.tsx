import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../utils/format'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../context/ToastContext'
import type { Tables } from '../types/database'

type Product = Tables<'product'> & { brand: { brand_name: string } | null }

export default function CartPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clear)
  const [productMap, setProductMap] = useState<Record<string, Product>>({})

  useEffect(() => {
    const ids = items.map((i) => i.product_id)
    if (ids.length === 0) {
      setProductMap({})
      return
    }
    supabase
      .from('product')
      .select('*, brand!product_brand_id_fkey(brand_name)')
      .in('product_id', ids)
      .then(({ data }) => {
        const map: Record<string, Product> = {}
        for (const p of (data as Product[]) ?? []) map[p.product_id] = p
        setProductMap(map)
      })
  }, [items])

  const total = items.reduce((sum, item) => {
    const product = productMap[item.product_id]
    return sum + (product ? product.product_price * item.quantity : 0)
  }, 0)

  const handleOrder = async () => {
    if (items.length === 0) {
      showToast('장바구니가 비어있습니다.')
      return
    }
    if (!user) {
      showToast('비회원 주문이 접수되었습니다. (데모)')
      clearCart()
      navigate('/')
      return
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total_price: total, order_status: 'PENDING' })
      .select()
      .single()

    if (error || !order) {
      showToast('주문 처리 중 오류가 발생했습니다.')
      return
    }

    await supabase.from('order_details').insert(
      items.map((item) => ({
        order_id: order.order_id,
        product_id: item.product_id,
        product_price: productMap[item.product_id]?.product_price ?? 0,
        quantity: item.quantity,
        selected_color: item.selected_color,
        selected_size: item.selected_size,
      }))
    )

    await supabase.from('cart').delete().eq('user_id', user.id)
    clearCart()
    showToast('주문이 완료되었습니다.')
    navigate('/mypage')
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#111111', mb: 5 }}>Cart</Typography>

      {items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontSize: 14, color: '#888888', mb: 3 }}>장바구니가 비어있습니다.</Typography>
          <Button onClick={() => navigate('/products')} sx={{ height: 44, px: 3, border: '1px solid #DCDCDC', color: '#111111', borderRadius: 0 }}>
            쇼핑 계속하기
          </Button>
        </Box>
      )}

      {items.length > 0 && (
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {items.map((item) => {
              const product = productMap[item.product_id]
              if (!product) return null
              return (
                <Box
                  key={`${item.product_id}-${item.selected_color}-${item.selected_size}`}
                  sx={{ display: 'flex', gap: 3, alignItems: 'center', borderBottom: '1px solid #E5E5E5', pb: 3 }}
                >
                  <Box component="img" src={product.product_image ?? undefined} alt={product.product_name} sx={{ width: 100, height: 130, objectFit: 'cover' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 13, color: '#888888' }}>{product.brand?.brand_name}</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#111111' }}>{product.product_name}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#888888' }}>
                      {item.selected_color} / {item.selected_size}
                    </Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111111', mt: 1 }}>
                      {formatPrice(product.product_price * item.quantity)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #DCDCDC' }}>
                    <Box
                      component="button"
                      onClick={() =>
                        updateQuantity(item.product_id, item.selected_color, item.selected_size, Math.max(1, item.quantity - 1))
                      }
                      sx={{ display: 'flex', p: 1, border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </Box>
                    <Typography sx={{ px: 1.5, fontSize: 14 }}>{item.quantity}</Typography>
                    <Box
                      component="button"
                      onClick={() =>
                        updateQuantity(item.product_id, item.selected_color, item.selected_size, item.quantity + 1)
                      }
                      sx={{ display: 'flex', p: 1, border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </Box>
                  </Box>
                  <Box
                    component="button"
                    onClick={() => removeItem(item.product_id, item.selected_color, item.selected_size)}
                    aria-label="삭제"
                    sx={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: '#888888' }}
                  >
                    <X size={18} />
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Box sx={{ width: 320, flexShrink: 0 }}>
            <Box sx={{ border: '1px solid #E5E5E5', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: 14, color: '#555555' }}>총 주문 금액</Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111' }}>{formatPrice(total)}</Typography>
              </Box>
              <Button
                fullWidth
                onClick={handleOrder}
                sx={{ height: 52, bgcolor: '#111111', color: '#FFFFFF', fontSize: 15, fontWeight: 600, borderRadius: 0, mb: 1.5, '&:hover': { bgcolor: '#3157FF' } }}
              >
                주문하기
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/products')}
                sx={{ height: 44, border: '1px solid #DCDCDC', color: '#111111', fontSize: 14, borderRadius: 0 }}
              >
                쇼핑 계속하기
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
