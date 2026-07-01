import { useEffect, useState } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../utils/format'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { useToast } from '../context/ToastContext'
import ProductCard from '../components/common/ProductCard'
import QuickViewModal from '../components/common/QuickViewModal'
import StarRating from '../components/common/StarRating'
import type { Tables } from '../types/database'
import type { ProductWithBrand } from '../hooks/useProducts'

type Product = Tables<'product'> & { brand: { brand_id: string; brand_name: string } | null }
type Review = Tables<'review'>

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const addToCart = useCartStore((s) => s.addItem)
  const { isWishlisted, toggle } = useWishlistToggle()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<ProductWithBrand[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [color, setColor] = useState<string | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithBrand | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('product')
      .select('*, brand(brand_id, brand_name)')
      .eq('product_id', id)
      .single()
      .then(({ data }) => {
        const p = data as Product | null
        setProduct(p)
        setColor(p?.color?.[0] ?? null)
        setSize(p?.size?.[0] ?? null)
      })

    supabase
      .from('review')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []))
  }, [id])

  useEffect(() => {
    if (!product) return
    supabase
      .from('product')
      .select('*, brand(brand_id, brand_name)')
      .eq('mood', product.mood ?? '')
      .neq('product_id', product.product_id)
      .limit(4)
      .then(({ data }) => setRelated((data as ProductWithBrand[]) ?? []))

    if (user) {
      supabase.from('recent_view').insert({ user_id: user.id, product_id: product.product_id })
    }
  }, [product, user])

  if (!product) return null

  const handleAddToCart = () => {
    addToCart({ product_id: product.product_id, selected_color: color, selected_size: size, quantity })
    showToast('장바구니에 추가되었습니다.')
  }

  const handleSubmitReview = async () => {
    if (!user) {
      showToast('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }
    if (!reviewText.trim()) {
      showToast('리뷰 내용을 입력해주세요.')
      return
    }
    const { data, error } = await supabase
      .from('review')
      .insert({ product_id: product.product_id, user_id: user.id, review_content: reviewText, rating: reviewRating })
      .select()
      .single()
    if (error || !data) {
      showToast('리뷰 등록에 실패했습니다.')
      return
    }
    setReviews((prev) => [data, ...prev])
    setReviewText('')
    showToast('리뷰가 등록되었습니다.')
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Box sx={{ display: 'flex', gap: 8, mb: 10 }}>
        <Box
          component="img"
          src={product.product_image ?? undefined}
          alt={product.product_name}
          sx={{ width: 480, height: 600, objectFit: 'cover', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, pt: 2 }}>
          <Typography sx={{ fontSize: 14, color: '#888888', mb: 1 }}>{product.brand?.brand_name}</Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 600, color: '#111111', mb: 2 }}>{product.product_name}</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111111', mb: 3 }}>
            {formatPrice(product.product_price)}
          </Typography>
          <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: '#555555', mb: 4 }}>
            {product.product_description}
          </Typography>

          {product.color && product.color.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: '#888888', mb: 1 }}>컬러</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.color.map((c) => (
                  <Box
                    key={c}
                    component="button"
                    onClick={() => setColor(c)}
                    sx={{
                      height: 36,
                      px: 2,
                      border: `1px solid ${color === c ? '#111111' : '#DCDCDC'}`,
                      bgcolor: color === c ? '#111111' : '#FFFFFF',
                      color: color === c ? '#FFFFFF' : '#111111',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {product.size && product.size.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: '#888888', mb: 1 }}>사이즈</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.size.map((s) => (
                  <Box
                    key={s}
                    component="button"
                    onClick={() => setSize(s)}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `1px solid ${size === s ? '#111111' : '#DCDCDC'}`,
                      bgcolor: size === s ? '#111111' : '#FFFFFF',
                      color: size === s ? '#FFFFFF' : '#111111',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 13, color: '#888888', mb: 1 }}>수량</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #DCDCDC', width: 'fit-content' }}>
              <Box component="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ display: 'flex', p: 1, border: 'none', background: 'none', cursor: 'pointer' }}>
                <Minus size={14} />
              </Box>
              <Typography sx={{ px: 2, fontSize: 14 }}>{quantity}</Typography>
              <Box component="button" onClick={() => setQuantity((q) => q + 1)} sx={{ display: 'flex', p: 1, border: 'none', background: 'none', cursor: 'pointer' }}>
                <Plus size={14} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              onClick={handleAddToCart}
              sx={{ height: 52, bgcolor: '#111111', color: '#FFFFFF', fontSize: 14, fontWeight: 600, borderRadius: 0, '&:hover': { bgcolor: '#3157FF' } }}
            >
              장바구니
            </Button>
            <Box
              component="button"
              onClick={() => toggle(product.product_id)}
              aria-label="관심목록"
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #DCDCDC',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <Heart size={20} fill={isWishlisted(product.product_id) ? '#3157FF' : 'none'} color={isWishlisted(product.product_id) ? '#3157FF' : '#111111'} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 10 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111', mb: 1 }}>
          리뷰 {reviews.length > 0 && `(${reviews.length})`}
        </Typography>
        {avgRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <StarRating value={Math.round(Number(avgRating))} size={16} />
            <Typography sx={{ fontSize: 14, color: '#555555' }}>{avgRating} / 5</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 5 }}>
          <StarRating value={reviewRating} onChange={setReviewRating} />
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="상품에 대한 리뷰를 남겨주세요."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button onClick={handleSubmitReview} sx={{ height: 56, px: 3, bgcolor: '#111111', color: '#FFFFFF', borderRadius: 0, flexShrink: 0 }}>
            등록
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map((r) => (
            <Box key={r.review_id} sx={{ borderBottom: '1px solid #E5E5E5', pb: 2 }}>
              <StarRating value={r.rating} size={14} />
              <Typography sx={{ fontSize: 14, color: '#555555', mt: 1 }}>{r.review_content}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {related.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111', mb: 3 }}>관련 상품</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {related.map((p) => (
              <ProductCard key={p.product_id} product={p} brandName={p.brand?.brand_name} onQuickView={(pr) => setQuickViewProduct(pr as ProductWithBrand)} />
            ))}
          </Box>
        </Box>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Box>
  )
}
