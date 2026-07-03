import { Box, Typography } from '@mui/material'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/format'
import type { Tables } from '../../types/database'

type Product = Tables<'product'>

interface RecommendProductCardProps {
  product: Product
  brandName?: string
  isWishlisted: boolean
  onToggleWishlist: () => void
}

// 콘텐츠1 "AI가 추천하는 나만의 상품" 전용 카드. 205x275 이미지 + 좌측 정렬 정보,
// 하트가 이미지 우하단에 위치한다는 점이 목록/검색용 ProductCard와 달라 별도 컴포넌트로 분리.
export default function RecommendProductCard({ product, brandName, isWishlisted, onToggleWishlist }: RecommendProductCardProps) {
  const navigate = useNavigate()
  const discountRate = product.discount_rate ?? 0
  const finalPrice = discountRate > 0 ? Math.round(product.product_price * (1 - discountRate / 100)) : product.product_price

  return (
    <Box
      sx={{
        width: 205,
        cursor: 'pointer',
        '&:hover .recommend-card-image': { transform: 'scale(1.05)' },
      }}
      onClick={() => navigate(`/products/detail/${product.product_id}`)}
    >
      <Box sx={{ position: 'relative', width: 205, height: 275, bgcolor: '#F3F3F3', overflow: 'hidden' }}>
        <Box
          component="img"
          className="recommend-card-image"
          src={product.product_image ?? undefined}
          alt={product.product_name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />
        <Box
          component="button"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onToggleWishlist()
          }}
          aria-label="관심상품"
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Heart size={16} fill={isWishlisted ? '#E5484D' : 'none'} color={isWishlisted ? '#E5484D' : '#111111'} />
        </Box>
      </Box>

      <Box sx={{ pt: 1.5, textAlign: 'left' }}>
        {brandName && (
          <Typography sx={{ fontSize: 13, color: '#888888', mb: 0.5 }}>{brandName}</Typography>
        )}
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111111', mb: 0.5 }}>
          {product.product_name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {discountRate > 0 && (
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#E5484D' }}>{discountRate}%</Typography>
          )}
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>{formatPrice(finalPrice)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
