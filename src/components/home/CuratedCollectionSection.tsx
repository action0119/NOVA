import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import SectionContainer from './SectionContainer'
import ProductCard from '../common/ProductCard'
import QuickViewModal from '../common/QuickViewModal'
import { supabase } from '../../lib/supabaseClient'
import type { Tables } from '../../types/database'

type Product = Tables<'product'> & { brand: { brand_name: string } | null }

const TABS = [
  { label: 'New Arrival', tag: 'NEW' },
  { label: 'Best Item', tag: 'BEST' },
  { label: 'AI Pick', tag: 'AI PICK' },
] as const

export default function CuratedCollectionSection() {
  const [activeTag, setActiveTag] = useState<string>('NEW')
  const [products, setProducts] = useState<Product[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  useEffect(() => {
    supabase
      .from('product')
      .select('*, brand!product_brand_id_fkey(brand_name)')
      .eq('product_tag', activeTag)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setProducts((data as Product[]) ?? []))
  }, [activeTag])

  return (
    <SectionContainer bgcolor="#F8F8F8">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>04</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            Curated Collection
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555' }}>
            NOVA가 이번 시즌 가장 먼저 추천하는 상품들입니다.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {TABS.map((tab) => (
            <Box
              key={tab.tag}
              component="button"
              onClick={() => setActiveTag(tab.tag)}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: '#111111',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                pb: 1,
                borderBottom: activeTag === tab.tag ? '2px solid #111111' : '2px solid transparent',
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '24px' }}>
        {products.map((product) => (
          <Box key={product.product_id} sx={{ flex: 1 }}>
            <ProductCard
              product={product}
              brandName={product.brand?.brand_name}
              onQuickView={(p) => setQuickViewProduct(p as Product)}
            />
          </Box>
        ))}
      </Box>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </SectionContainer>
  )
}
