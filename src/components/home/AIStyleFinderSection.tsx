import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
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

export default function AIStyleFinderSection() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { isWishlisted, toggle } = useWishlistToggle()
  const [products, setProducts] = useState<ProductWithBrand[]>([])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const mood = user ? await fetchRecommendedMood(user.id) : null

      let query = supabase
        .from('product')
        .select('*, brand!product_brand_id_fkey(brand_id, brand_name)')
        .order('created_at', { ascending: false })
        .limit(5)

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>01</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            AI가 추천하는 나만의 상품
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555' }}>
            관심상품과 선호 무드를 분석해 어울리는 상품을 추천해드립니다.
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={() => navigate('/ai-style-finder')}
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: '#3157FF',
            border: 'none',
            background: 'none',
            p: 0,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          AI 스타일 파인더 바로가기 →
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '20px' }}>
        {products.map((product) => (
          <RecommendProductCard
            key={product.product_id}
            product={product}
            brandName={product.brand?.brand_name}
            isWishlisted={isWishlisted(product.product_id)}
            onToggleWishlist={() => toggle(product.product_id)}
          />
        ))}
      </Box>
    </SectionContainer>
  )
}
