import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import Modal from './Modal'
import { formatPrice } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import { useToast } from '../../context/ToastContext'
import { objectPositionForId } from '../../utils/objectPosition'
import type { Tables } from '../../types/database'

type Product = Tables<'product'>

interface QuickViewModalProps {
  product: (Product & { brand?: { brand_name: string } | null }) | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem)
  const showToast = useToast()
  const [size, setSize] = useState<string | null>(null)

  useEffect(() => {
    setSize(product?.size?.[0] ?? null)
  }, [product])

  if (!product) return null

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      selected_color: product.color?.[0] ?? null,
      selected_size: size,
      quantity: 1,
    })
    showToast('장바구니에 추가되었습니다.')
    onClose()
  }

  return (
    <Modal open={Boolean(product)} onClose={onClose} width={640}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box
          component="img"
          src={product.product_image ?? undefined}
          alt={product.product_name}
          sx={{ width: 240, height: 300, objectFit: 'cover', objectPosition: objectPositionForId(product.product_id), flexShrink: 0 }}
        />
        <Box sx={{ flex: 1 }}>
          {product.brand?.brand_name && (
            <Typography sx={{ fontSize: 13, color: '#888888', mb: 0.5 }}>{product.brand.brand_name}</Typography>
          )}
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#111111', mb: 1 }}>
            {product.product_name}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111111', mb: 3 }}>
            {formatPrice(product.product_price)}
          </Typography>

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

          <Button
            fullWidth
            onClick={handleAddToCart}
            sx={{
              height: 48,
              bgcolor: '#111111',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 0,
              '&:hover': { bgcolor: '#3157FF' },
            }}
          >
            장바구니 담기
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
