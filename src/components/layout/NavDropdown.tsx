import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

const ITEMS = ['New Brands', 'Designer Brands', 'Minimal', 'Street', 'Casual', 'Vintage']
const MOODS = new Set(['Minimal', 'Street', 'Casual', 'Vintage'])

export default function NavDropdown() {
  const navigate = useNavigate()
  const showToast = useToast()

  const handleClick = (item: string) => {
    if (MOODS.has(item)) {
      navigate(`/products?mood=${item}`)
    } else {
      showToast(`${item}은(는) 준비 중입니다.`)
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 72,
        left: 0,
        right: 0,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 1920,
          mx: 'auto',
          px: 6,
          display: 'flex',
          gap: 6,
        }}
      >
        {ITEMS.map((item) => (
          <Box
            key={item}
            onClick={() => handleClick(item)}
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
    </Box>
  )
}
