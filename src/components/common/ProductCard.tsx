import { Box, Typography, Button } from '@mui/material'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, TAG_COLORS, TAG_LABELS } from '../../utils/format'
import type { Tables } from '../../types/database'

type Product = Tables<'product'>

interface ProductCardProps {
  product: Product
  brandName?: string
  onQuickView?: (product: Product) => void
  showWishlist?: boolean
  isWishlisted?: boolean
  onToggleWishlist?: () => void
}

export default function ProductCard({
  product,
  brandName,
  onQuickView,
  showWishlist = false,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover .product-card-image': { transform: 'scale(1.05)' },
        '&:hover .product-card-quickview': { opacity: 1, pointerEvents: 'auto' },
      }}
      onClick={() => navigate(`/products/detail/${product.product_id}`)}
    >
      <Box sx={{ position: 'relative', height: 300, bgcolor: '#F3F3F3', overflow: 'hidden' }}>
        <Box
          component="img"
          className="product-card-image"
          src={product.product_image ?? undefined}
          alt={product.product_name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
        {product.product_tag && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              height: 24,
              px: 1,
              display: 'flex',
              alignItems: 'center',
              bgcolor: TAG_COLORS[product.product_tag] ?? '#111111',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {TAG_LABELS[product.product_tag] ?? product.product_tag}
          </Box>
        )}
        {showWishlist && (
          <Box
            component="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onToggleWishlist?.()
            }}
            aria-label="관심목록"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.9)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Heart size={18} fill={isWishlisted ? '#3157FF' : 'none'} color={isWishlisted ? '#3157FF' : '#111111'} />
          </Box>
        )}
        {onQuickView && (
          <Button
            className="product-card-quickview"
            onClick={(e) => {
              e.stopPropagation()
              onQuickView(product)
            }}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 150,
              height: 42,
              bgcolor: '#111111',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease',
              '&:hover': { bgcolor: '#111111' },
            }}
          >
            빠른보기
          </Button>
        )}
      </Box>
      <Box sx={{ pt: 2 }}>
        {brandName && (
          <Typography sx={{ fontSize: 13, color: '#888888', mb: 0.5 }}>{brandName}</Typography>
        )}
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#111111', mb: 0.5 }}>
          {product.product_name}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111111' }}>
          {formatPrice(product.product_price)}
        </Typography>
      </Box>
    </Box>
  )
}
