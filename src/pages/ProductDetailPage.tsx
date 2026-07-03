import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../utils/format'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { useToast } from '../context/ToastContext'
import ProductCard from '../components/common/ProductCard'
import QuickViewModal from '../components/common/QuickViewModal'
import StarRating from '../components/common/StarRating'
import Modal from '../components/common/Modal'
import SizeGuideDiagram from '../components/product/SizeGuideDiagram'
import { COLOR_HEX, isDarkColor } from '../constants/colors'
import { moodImage, type Mood } from '../constants/moodImages'
import type { Tables } from '../types/database'
import type { ProductWithBrand } from '../hooks/useProducts'

type Product = Tables<'product'> & { brand: { brand_id: string; brand_name: string } | null }
type Review = Tables<'review'>

const TABS = [
  { key: 'detail', label: '상세정보' },
  { key: 'review', label: '리뷰' },
  { key: 'qna', label: 'Q&A' },
  { key: 'shipping', label: '환불&배송' },
] as const

type TabKey = (typeof TABS)[number]['key']

const DEMO_QNA = [
  { question: '세탁은 어떻게 하나요?', answer: '드라이클리닝을 권장하며, 단독 손세탁도 가능합니다.', date: '2026.06.02', secret: false },
  { question: '재입고 예정 있나요?', answer: '다음 시즌 재입고 예정이며, 알림 신청 시 안내드립니다.', date: '2026.06.10', secret: false },
  { question: '사이즈 문의드립니다.', answer: '비공개 문의입니다.', date: '2026.06.15', secret: true },
]

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
  const [reviewerNames, setReviewerNames] = useState<Record<string, string>>({})
  const [color, setColor] = useState<string | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithBrand | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('detail')
  const [qnaOpen, setQnaOpen] = useState(false)
  const [qnaText, setQnaText] = useState('')

  const detailRef = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLDivElement>(null)
  const qnaRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const sectionRefs: Record<TabKey, React.RefObject<HTMLDivElement | null>> = {
    detail: detailRef,
    review: reviewRef,
    qna: qnaRef,
    shipping: shippingRef,
  }

  useEffect(() => {
    if (!id) return
    supabase
      .from('product')
      .select('*, brand!product_brand_id_fkey(brand_id, brand_name)')
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
      .then(async ({ data }) => {
        const revs = data ?? []
        setReviews(revs)
        const ids = [...new Set(revs.map((r) => r.user_id))]
        if (ids.length === 0) return
        const { data: users } = await supabase.from('users').select('id, user_name').in('id', ids)
        const map: Record<string, string> = {}
        for (const u of users ?? []) map[u.id] = u.user_name
        setReviewerNames(map)
      })
  }, [id])

  useEffect(() => {
    if (!product) return
    supabase
      .from('product')
      .select('*, brand!product_brand_id_fkey(brand_id, brand_name)')
      .eq('mood', product.mood ?? '')
      .neq('product_id', product.product_id)
      .limit(4)
      .then(({ data }) => setRelated((data as ProductWithBrand[]) ?? []))

    if (user) {
      supabase.from('recent_view').insert({ user_id: user.id, product_id: product.product_id })
    }
  }, [product, user])

  if (!product) return null

  const normalPrice = product.product_price
  const discountRate = product.discount_rate ?? 0
  const couponPrice = discountRate > 0 ? Math.round(normalPrice * (1 - discountRate / 100)) : normalPrice
  const mood = (product.mood as Mood | null) ?? null

  const handleAddToCart = () => {
    addToCart({ product_id: product.product_id, selected_color: color, selected_size: size, quantity })
    showToast('장바구니에 추가되었습니다.')
  }

  const handleBuyNow = () => {
    addToCart({ product_id: product.product_id, selected_color: color, selected_size: size, quantity })
    navigate('/cart')
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    showToast('상품 링크가 복사되었습니다.')
  }

  const handleClaimCoupon = () => {
    showToast('쿠폰이 발급되었습니다. (데모)')
  }

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key)
    sectionRefs[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setReviewPhotos(files.map((f) => URL.createObjectURL(f)))
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
    setReviewPhotos([])
    showToast('리뷰가 등록되었습니다.')
  }

  const handleSubmitQna = () => {
    if (!qnaText.trim()) {
      showToast('문의 내용을 입력해주세요.')
      return
    }
    setQnaText('')
    setQnaOpen(false)
    showToast('문의가 접수되었습니다. (데모)')
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Box sx={{ display: 'flex', gap: 8, mb: 6 }}>
        <Box
          component="img"
          src={product.product_image ?? undefined}
          alt={product.product_name}
          sx={{ width: 480, height: 600, objectFit: 'cover', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography sx={{ fontSize: 14, color: '#888888', mb: 1 }}>{product.brand?.brand_name}</Typography>
            <Box component="button" onClick={handleShare} aria-label="공유하기" sx={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: '#888888' }}>
              <Share2 size={20} strokeWidth={1.5} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 600, color: '#111111', mb: 2 }}>{product.product_name}</Typography>

          <Box sx={{ mb: 2 }}>
            {discountRate > 0 && (
              <Typography sx={{ fontSize: 14, color: '#AAAAAA', textDecoration: 'line-through' }}>
                정상가 {formatPrice(normalPrice)}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {discountRate > 0 && (
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#E5484D' }}>{discountRate}%</Typography>
              )}
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111' }}>{formatPrice(couponPrice)}</Typography>
            </Box>
            {discountRate > 0 && (
              <Typography sx={{ fontSize: 12, color: '#3157FF', mt: 0.5 }}>쿠폰적용가 {formatPrice(couponPrice)}</Typography>
            )}
          </Box>

          <Button
            onClick={handleClaimCoupon}
            sx={{ height: 36, px: 2, mb: 3, border: '1px solid #3157FF', color: '#3157FF', fontSize: 13, fontWeight: 600, borderRadius: 0 }}
          >
            쿠폰받기
          </Button>

          <Box sx={{ borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', py: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, fontSize: 13, color: '#555555' }}>
              <Typography sx={{ fontSize: 13, color: '#888888', width: 72, flexShrink: 0 }}>배송정보</Typography>
              <Typography sx={{ fontSize: 13, color: '#555555' }}>일반배송</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, fontSize: 13, color: '#555555', mt: 1 }}>
              <Typography sx={{ fontSize: 13, color: '#888888', width: 72, flexShrink: 0 }}>배송비</Typography>
              <Typography sx={{ fontSize: 13, color: '#555555' }}>3,000원 (50,000원 이상 무료배송)</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: '#555555', mb: 4 }}>
            {product.product_description}
          </Typography>

          {product.color && product.color.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: '#888888', mb: 1 }}>컬러</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.color.map((c) => {
                  const hex = COLOR_HEX[c] ?? '#DDDDDD'
                  const active = color === c
                  const dark = isDarkColor(hex)
                  return (
                    <Box
                      key={c}
                      component="button"
                      onClick={() => setColor(c)}
                      sx={{
                        height: 36,
                        px: 2,
                        border: `1px solid ${active ? '#111111' : '#DCDCDC'}`,
                        bgcolor: hex,
                        color: dark ? '#FFFFFF' : '#111111',
                        fontSize: 13,
                        cursor: 'pointer',
                        outline: active ? '2px solid #3157FF' : 'none',
                        outlineOffset: '1px',
                      }}
                    >
                      {c}
                    </Box>
                  )
                })}
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
              sx={{ height: 52, bgcolor: '#FFFFFF', color: '#111111', border: '1px solid #111111', fontSize: 14, fontWeight: 600, borderRadius: 0, '&:hover': { bgcolor: '#F8F8F8' } }}
            >
              장바구니
            </Button>
            <Button
              fullWidth
              onClick={handleBuyNow}
              sx={{ height: 52, bgcolor: '#111111', color: '#FFFFFF', fontSize: 14, fontWeight: 600, borderRadius: 0, '&:hover': { bgcolor: '#3157FF' } }}
            >
              바로구매
            </Button>
            <Box
              component="button"
              onClick={() => toggle(product.product_id)}
              aria-label="관심상품"
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

      {/* 탭 메뉴 */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 5, bgcolor: '#FFFFFF', borderTop: '1px solid #111111', borderBottom: '1px solid #E5E5E5', display: 'flex', mb: 8 }}>
        {TABS.map((tab) => (
          <Box
            key={tab.key}
            component="button"
            onClick={() => handleTabClick(tab.key)}
            sx={{
              flex: 1,
              height: 56,
              fontSize: 15,
              fontWeight: activeTab === tab.key ? 700 : 400,
              color: activeTab === tab.key ? '#111111' : '#888888',
              borderBottom: activeTab === tab.key ? '2px solid #111111' : '2px solid transparent',
              border: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {tab.key === 'review' ? `리뷰(${reviews.length})` : tab.label}
          </Box>
        ))}
      </Box>

      {/* 상세정보 */}
      <Box ref={detailRef} sx={{ mb: 10 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111', mb: 3 }}>상세정보</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mood && (
            <Box
              component="img"
              src={moodImage(mood, 6)}
              alt="상품 착용 이미지"
              sx={{ width: '100%', maxWidth: 640, height: 800, objectFit: 'cover', objectPosition: 'center 15%', mx: 'auto' }}
            />
          )}
          {mood && (
            <Box
              component="img"
              src={moodImage(mood, 7)}
              alt="상품 디테일 이미지"
              sx={{ width: '100%', maxWidth: 640, height: 500, objectFit: 'cover', objectPosition: '50% 30%', mx: 'auto' }}
            />
          )}
          <SizeGuideDiagram />
          <Typography sx={{ fontSize: 13, color: '#888888', textAlign: 'center' }}>
            제품 실측은 측정 방법에 따라 1~3cm 오차가 있을 수 있습니다.
          </Typography>
        </Box>
      </Box>

      {/* 리뷰 */}
      <Box ref={reviewRef} sx={{ mb: 10 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111', mb: 1 }}>
          리뷰({reviews.length})
        </Typography>
        {avgRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <StarRating value={Math.round(Number(avgRating))} size={16} />
            <Typography sx={{ fontSize: 14, color: '#555555' }}>{avgRating} / 5</Typography>
          </Box>
        )}

        {user ? (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1.5 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button component="label" sx={{ height: 36, px: 2, border: '1px solid #DCDCDC', color: '#555555', fontSize: 13, borderRadius: 0 }}>
                사진 첨부
                <input type="file" accept="image/*" multiple hidden onChange={handlePhotoSelect} />
              </Button>
              {reviewPhotos.map((src, i) => (
                <Box key={i} component="img" src={src} alt="첨부 사진 미리보기" sx={{ width: 44, height: 44, objectFit: 'cover' }} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, p: 2, bgcolor: '#F8F8F8' }}>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>로그인 후 리뷰를 작성할 수 있습니다.</Typography>
            <Button onClick={() => navigate('/login')} sx={{ height: 36, px: 2, bgcolor: '#111111', color: '#FFFFFF', fontSize: 13, borderRadius: 0 }}>
              로그인하기
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.length === 0 && (
            <Typography sx={{ fontSize: 14, color: '#888888', py: 4, textAlign: 'center' }}>아직 등록된 리뷰가 없습니다.</Typography>
          )}
          {reviews.map((r) => (
            <Box key={r.review_id} sx={{ borderBottom: '1px solid #E5E5E5', pb: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>
                {reviewerNames[r.user_id] ?? 'NOVA 회원'}
              </Typography>
              <StarRating value={r.rating} size={14} />
              <Typography sx={{ fontSize: 14, color: '#555555', mt: 1 }}>{r.review_content}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Q&A */}
      <Box ref={qnaRef} sx={{ mb: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111' }}>Q&amp;A</Typography>
          <Button onClick={() => setQnaOpen(true)} sx={{ height: 40, px: 2.5, border: '1px solid #111111', color: '#111111', fontSize: 13, borderRadius: 0 }}>
            문의하기
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {DEMO_QNA.map((qna, i) => (
            <Box key={i} sx={{ borderBottom: '1px solid #E5E5E5', pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111111' }}>
                  Q. {qna.secret ? '비공개 문의입니다.' : qna.question}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#888888' }}>{qna.date}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: '#555555', mt: 1 }}>A. {qna.answer}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 환불&배송 */}
      <Box ref={shippingRef} sx={{ mb: 10 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111111', mb: 3 }}>환불&amp;배송</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { title: '배송정보', desc: '평균 1~3일 이내 출고되며, 택배사 사정에 따라 지연될 수 있습니다.' },
            { title: '배송비', desc: '3,000원 (50,000원 이상 구매 시 무료배송)' },
            { title: '교환 안내', desc: '상품 수령 후 7일 이내 신청 가능하며, 왕복 배송비가 발생할 수 있습니다.' },
            { title: '반품 안내', desc: '상품 수령 후 7일 이내 신청 가능하며, 단순 변심 시 반품 배송비가 부과됩니다.' },
            { title: '환불 안내', desc: '반품 상품 확인 후 3영업일 이내 결제 수단으로 환불됩니다.' },
          ].map((row) => (
            <Box key={row.title} sx={{ display: 'flex', gap: 3, borderBottom: '1px solid #E5E5E5', pb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', width: 100, flexShrink: 0 }}>{row.title}</Typography>
              <Typography sx={{ fontSize: 14, color: '#555555' }}>{row.desc}</Typography>
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

      <Modal open={qnaOpen} onClose={() => setQnaOpen(false)}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111111', mb: 2 }}>상품 문의하기</Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="문의하실 내용을 입력해주세요."
          value={qnaText}
          onChange={(e) => setQnaText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          onClick={handleSubmitQna}
          sx={{ height: 48, bgcolor: '#111111', color: '#FFFFFF', fontSize: 14, fontWeight: 600, borderRadius: 0, '&:hover': { bgcolor: '#3157FF' } }}
        >
          문의 등록
        </Button>
      </Modal>
    </Box>
  )
}
