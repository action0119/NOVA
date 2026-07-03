import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import SectionContainer from './SectionContainer'
import RecommendProductCard from './RecommendProductCard'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'
import { useWishlistToggle } from '../../hooks/useWishlistToggle'
import type { ProductWithBrand } from '../../hooks/useProducts'

// 실제 AI 없이 데모로 "추천"을 흉내낸다: 로그인 + 위시리스트가 있으면 그 상품들의
// mood 최빈값으로 상품을 추천하고, 없으면 AI PICK 태그 상품을 보여준다.
async function fetchRecommendedMood(userId: string): Promise<string | null> {
  const { data } = await supabase.from('wishlist').select('product(mood)').eq('user_id', userId)
  const moods = (data ?? [])
    .map((row) => (row.product as unknown as { mood: string | null } | null)?.mood)
    .filter((m): m is string => Boolean(m))
  if (moods.length === 0) return null
  const counts = new Map<string, number>()
  for (const m of moods) counts.set(m, (counts.get(m) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

const CARD_WIDTH = 205
const CARD_HEIGHT = 275
const CARD_GAP = 20
const VISIBLE_CARDS = 4

const arrowBtnSx = {
  position: 'absolute' as const,
  top: CARD_HEIGHT / 2,
  transform: 'translateY(-50%)',
  zIndex: 2,
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '50%',
  bgcolor: 'rgba(255,255,255,0.5)',
  color: '#111111',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
}

export default function AIStyleFinderSection() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { isWishlisted, toggle } = useWishlistToggle()
  const [products, setProducts] = useState<ProductWithBrand[]>([])
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const mood = user ? await fetchRecommendedMood(user.id) : null

      let query = supabase
        .from('product')
        .select('*, brand!product_brand_id_fkey(brand_id, brand_name)')
        .order('created_at', { ascending: false })
        .limit(8)

      query = mood ? query.eq('mood', mood) : query.eq('product_tag', 'AI PICK')

      const { data } = await query
      if (cancelled) return
      setProducts((data as ProductWithBrand[]) ?? [])
    }

    run()
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <SectionContainer>
      <Box sx={{ display: 'flex', gap: 8 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>01</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            AI가 추천하는 나만의 상품
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555', mb: 3 }}>
            관심상품과 선호 무드를 분석해 어울리는 상품을 추천해드립니다.
          </Typography>
          <Box
            component="button"
            onClick={() => navigate('/ai-style-finder')}
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: '#3157FF',
              border: 'none',
              background: 'none',
              p: 0,
              cursor: 'pointer',
            }}
          >
            AI 스타일 파인더 바로가기 →
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: CARD_WIDTH * VISIBLE_CARDS + CARD_GAP * (VISIBLE_CARDS - 1),
            maxWidth: '100%',
          }}
        >
          <Box component="button" ref={prevRef} aria-label="이전 추천 상품" sx={{ ...arrowBtnSx, left: -18 }}>
            ←
          </Box>
          <Box component="button" ref={nextRef} aria-label="다음 추천 상품" sx={{ ...arrowBtnSx, right: -18 }}>
            →
          </Box>

          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={CARD_GAP}
            onBeforeInit={(swiper: SwiperType) => {
              // @ts-expect-error swiper's navigation params accept element refs at runtime
              swiper.params.navigation.prevEl = prevRef.current
              // @ts-expect-error see above
              swiper.params.navigation.nextEl = nextRef.current
            }}
            navigation
            style={{ overflow: 'hidden' }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.product_id} style={{ width: CARD_WIDTH }}>
                <RecommendProductCard
                  product={product}
                  brandName={product.brand?.brand_name}
                  isWishlisted={isWishlisted(product.product_id)}
                  onToggleWishlist={() => toggle(product.product_id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </SectionContainer>
  )
}
