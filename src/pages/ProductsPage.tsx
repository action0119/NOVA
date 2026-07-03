import { useMemo, useState } from 'react'
import { Box, Typography, TextField } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import QuickViewModal from '../components/common/QuickViewModal'
import { useProducts, type ProductWithBrand } from '../hooks/useProducts'
import { useBrands } from '../hooks/useBrands'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { MOODS, MOOD_LABELS } from '../constants/moodImages'
import { CATEGORY_LABELS } from '../constants/labels'

const SORTS = ['최신순', '인기순', '가격 낮은순', '가격 높은순'] as const

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')
  const mood = searchParams.get('mood')
  const tag = searchParams.get('tag')

  const [search, setSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sort, setSort] = useState<(typeof SORTS)[number]>('최신순')
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithBrand | null>(null)

  const brands = useBrands()
  const { products, loading } = useProducts({ category, mood, tag, brandNames: selectedBrands, search })
  const { isWishlisted, toggle } = useWishlistToggle()

  const sorted = useMemo(() => {
    const list = [...products]
    if (sort === '가격 낮은순') list.sort((a, b) => a.product_price - b.product_price)
    else if (sort === '가격 높은순') list.sort((a, b) => b.product_price - a.product_price)
    else if (sort === '인기순') {
      const rank = (p: ProductWithBrand) => (p.product_tag === 'BEST' ? 0 : p.product_tag === 'AI PICK' ? 1 : 2)
      list.sort((a, b) => rank(a) - rank(b))
    }
    return list
  }, [products, sort])

  const toggleBrand = (name: string) => {
    setSelectedBrands((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]))
  }

  const toggleMood = (m: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (next.get('mood') === m) next.delete('mood')
      else next.set('mood', m)
      return next
    })
  }

  const toggleCategory = (c: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (next.get('category') === c) next.delete('category')
      else next.set('category', c)
      return next
    })
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#111111', mb: 4 }}>상품</Typography>

      <Box sx={{ display: 'flex', gap: 6 }}>
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <TextField
            fullWidth
            placeholder="상품 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 4 }}
          />

          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 1.5 }}>카테고리</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
            {['Women', 'Men'].map((c) => (
              <Box
                key={c}
                component="button"
                onClick={() => toggleCategory(c)}
                sx={{
                  textAlign: 'left',
                  fontSize: 14,
                  color: category === c ? '#3157FF' : '#555555',
                  fontWeight: category === c ? 600 : 400,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  p: 0,
                }}
              >
                {CATEGORY_LABELS[c] ?? c}
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 1.5 }}>브랜드</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
            {brands.map((b) => (
              <Box
                key={b.brand_id}
                component="button"
                onClick={() => toggleBrand(b.brand_name)}
                sx={{
                  textAlign: 'left',
                  fontSize: 14,
                  color: selectedBrands.includes(b.brand_name) ? '#3157FF' : '#555555',
                  fontWeight: selectedBrands.includes(b.brand_name) ? 600 : 400,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  p: 0,
                }}
              >
                {b.brand_name}
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 1.5 }}>무드</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {MOODS.map((m) => (
              <Box
                key={m}
                component="button"
                onClick={() => toggleMood(m)}
                sx={{
                  height: 32,
                  px: 1.5,
                  borderRadius: '16px',
                  border: `1px solid ${mood === m ? '#111111' : '#DCDCDC'}`,
                  bgcolor: mood === m ? '#111111' : '#FFFFFF',
                  color: mood === m ? '#FFFFFF' : '#111111',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                #{MOOD_LABELS[m]}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 14, color: '#888888' }}>총 {sorted.length}개</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {SORTS.map((s) => (
                <Box
                  key={s}
                  component="button"
                  onClick={() => setSort(s)}
                  sx={{
                    fontSize: 13,
                    color: sort === s ? '#111111' : '#888888',
                    fontWeight: sort === s ? 600 : 400,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </Box>
              ))}
            </Box>
          </Box>

          {!loading && sorted.length === 0 && (
            <Typography sx={{ fontSize: 14, color: '#888888', py: 8, textAlign: 'center' }}>
              조건에 맞는 상품이 없습니다.
            </Typography>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {sorted.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                brandName={product.brand?.brand_name}
                onQuickView={(p) => setQuickViewProduct(p as ProductWithBrand)}
                showWishlist
                isWishlisted={isWishlisted(product.product_id)}
                onToggleWishlist={() => toggle(product.product_id)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Box>
  )
}
