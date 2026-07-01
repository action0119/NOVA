import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import SectionContainer from './SectionContainer'
import { useToast } from '../../context/ToastContext'
import { supabase } from '../../lib/supabaseClient'
import type { Tables } from '../../types/database'

type Brand = Tables<'brand'>

export default function FeaturedBrandsSection() {
  const showToast = useToast()
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    supabase
      .from('brand')
      .select('*')
      .order('brand_name')
      .then(({ data }) => setBrands(data ?? []))
  }, [])

  return (
    <SectionContainer>
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>03</Typography>
        <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
          Featured Brands
        </Typography>
        <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555' }}>
          NOVA가 선별한 브랜드의 철학과 스타일을 만나보세요.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: '24px' }}>
        {brands.map((brand) => (
          <Box key={brand.brand_id} sx={{ flex: 1 }}>
            <Box sx={{ height: 260, overflow: 'hidden' }}>
              <Box
                component="img"
                src={brand.brand_image ?? undefined}
                alt={brand.brand_name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>
            <Box sx={{ pt: '22px' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111111', mb: 1 }}>
                {brand.brand_name}
              </Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: '#555555', mb: 1.5 }}>
                {brand.brand_description}
              </Typography>
              <Box
                component="button"
                onClick={() => showToast(`${brand.brand_name} 브랜드 페이지는 데모입니다.`)}
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#111111',
                  textDecoration: 'underline',
                  border: 'none',
                  background: 'none',
                  p: 0,
                  cursor: 'pointer',
                  '&:hover': { color: '#3157FF' },
                }}
              >
                View More
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  )
}
