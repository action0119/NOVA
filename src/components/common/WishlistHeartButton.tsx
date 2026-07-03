import { Box } from '@mui/material'
import { Heart } from 'lucide-react'

interface WishlistHeartButtonProps {
  active: boolean
  onToggle: () => void
}

// 이미지 우하단에 얹는 공통 하트 버튼. 배경은 항상 투명하고, 기본은 흰색 라인
// 아이콘, 클릭 시 빨간색으로 채워진다. AI 추천 상품 / 추천 컬렉션 카드에서 공유한다.
export default function WishlistHeartButton({ active, onToggle }: WishlistHeartButtonProps) {
  return (
    <Box
      component="button"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
        onToggle()
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
        bgcolor: 'transparent',
        border: 'none',
        p: 0,
        cursor: 'pointer',
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
      }}
    >
      <Heart size={20} strokeWidth={1.8} fill={active ? '#E5484D' : 'none'} color={active ? '#E5484D' : '#FFFFFF'} />
    </Box>
  )
}
