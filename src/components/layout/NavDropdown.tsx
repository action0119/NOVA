import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { HEADER_HEIGHT } from './headerConstants'

const MOODS = ['Minimal', 'Street', 'Casual', 'Vintage', 'Office']
const BRAND_TIER_ITEMS = ['New Brands', 'Designer Brands']

export type DropdownKey = 'Women' | 'Men' | 'Brands' | null

interface NavDropdownProps {
  activeKey: DropdownKey
}

export default function NavDropdown({ activeKey }: NavDropdownProps) {
  const navigate = useNavigate()
  const showToast = useToast()
  const open = activeKey !== null

  const handleMoodClick = (category: 'Women' | 'Men', mood: string) => {
    navigate(`/products?category=${category}&mood=${mood}`)
  }

  const handleBrandTierClick = (item: string) => {
    if (MOODS.includes(item)) {
      navigate(`/products?mood=${item}`)
    } else {
      showToast(`${item}은(는) 준비 중입니다.`)
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        bgcolor: '#FFFFFF',
        borderBottom: open ? '1px solid #E5E5E5' : 'none',
        overflow: 'hidden',
        maxHeight: open ? 220 : 0,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'max-height 0.35s ease, opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <Box sx={{ maxWidth: 1920, mx: 'auto', px: 6, py: 4 }}>
        {(activeKey === 'Women' || activeKey === 'Men') && (
          <Box sx={{ display: 'flex', gap: 6 }}>
            {MOODS.map((mood) => (
              <Box
                key={mood}
                onClick={() => handleMoodClick(activeKey, mood)}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#111111',
                  cursor: 'pointer',
                  '&:hover': { color: '#3157FF' },
                }}
              >
                {mood}
              </Box>
            ))}
          </Box>
        )}

        {activeKey === 'Brands' && (
          <Box sx={{ display: 'flex', gap: 6 }}>
            {[...BRAND_TIER_ITEMS, ...MOODS].map((item) => (
              <Box
                key={item}
                onClick={() => handleBrandTierClick(item)}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#111111',
                  cursor: 'pointer',
                  '&:hover': { color: '#3157FF' },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
