import { useEffect, useState } from 'react'
import { Box, Typography, TextField } from '@mui/material'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import QuickViewModal from '../components/common/QuickViewModal'
import { useProducts, type ProductWithBrand } from '../hooks/useProducts'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabaseClient'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [popularKeywords, setPopularKeywords] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithBrand | null>(null)

  const user = useAuthStore((s) => s.user)
  const { products, loading } = useProducts({ search: q })
  const { isWishlisted, toggle } = useWishlistToggle()

  useEffect(() => {
    supabase
      .from('search_keyword')
      .select('keyword')
      .order('searched_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        const counts = new Map<string, number>()
        for (const row of data ?? []) counts.set(row.keyword, (counts.get(row.keyword) ?? 0) + 1)
        const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k)
        setPopularKeywords(top)
      })
  }, [q])

  const runSearch = (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return
    setSearchParams({ q: trimmed })
    supabase.from('search_keyword').insert({ keyword: trimmed, user_id: user?.id ?? null })
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: 8 }}>
      <Box sx={{ maxWidth: 480, mx: 'auto', mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #DCDCDC', px: 2 }}>
          <Search size={18} color="#888888" />
          <TextField
            fullWidth
            variant="standard"
            placeholder="브랜드, 상품을 검색해보세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(input)}
            slotProps={{ input: { disableUnderline: true } }}
            sx={{ ml: 1 }}
          />
        </Box>

        {popularKeywords.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Typography sx={{ fontSize: 13, color: '#888888', mr: 1 }}>인기 검색어</Typography>
            {popularKeywords.map((k) => (
              <Box
                key={k}
                component="button"
                onClick={() => {
                  setInput(k)
                  runSearch(k)
                }}
                sx={{ fontSize: 13, color: '#555555', border: 'none', background: 'none', cursor: 'pointer', p: 0 }}
              >
                #{k}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {q && (
        <Typography sx={{ fontSize: 16, color: '#111111', mb: 3 }}>
          '{q}' 검색 결과 {products.length}건
        </Typography>
      )}

      {q && !loading && products.length === 0 && (
        <Typography sx={{ fontSize: 14, color: '#888888', py: 8, textAlign: 'center' }}>
          검색 결과가 없습니다.
        </Typography>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {products.map((product) => (
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

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Box>
  )
}
