import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ShoppingBasket, User } from 'lucide-react'
import NavDropdown from './NavDropdown'
import { useToast } from '../../context/ToastContext'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import novaLogo from '../../assets/nova-logo.png'

const NAV_ITEMS = [
  { label: 'Women', to: '/products?category=Women' },
  { label: 'Men', to: '/products?category=Men' },
  { label: 'Brands', to: null },
  { label: 'Editorial', to: null },
  { label: 'AI Styling', to: '/ai-style-finder', accent: true },
]

export default function Header() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const cartCount = useCartStore((s) => s.items.length)
  const [brandsOpen, setBrandsOpen] = useState(false)

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.to) {
      navigate(item.to)
    } else if (item.label === 'Editorial') {
      showToast('Editorial 페이지는 준비 중입니다.')
    }
  }

  return (
    <Box sx={{ position: 'relative' }} onMouseLeave={() => setBrandsOpen(false)}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 72,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        <Box
          sx={{
            maxWidth: 1920,
            mx: 'auto',
            px: 6,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', height: 26 }}>
            <Box component="img" src={novaLogo} alt="NOVA" sx={{ height: 26, width: 'auto' }} />
          </Box>

          <Box component="nav" sx={{ display: 'flex', gap: 5 }}>
            {NAV_ITEMS.map((item) => (
              <Box
                key={item.label}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => setBrandsOpen(item.label === 'Brands')}
                sx={{
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: '-0.2px',
                  color: item.accent ? '#3157FF' : '#111111',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <Box
              component="button"
              onClick={() => navigate('/search')}
              aria-label="검색"
              sx={{ display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
            >
              <Search size={22} strokeWidth={1.5} />
            </Box>
            <Box
              component="button"
              onClick={() => navigate('/cart')}
              aria-label="장바구니"
              sx={{ position: 'relative', display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
            >
              <ShoppingBasket size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    minWidth: 16,
                    height: 16,
                    px: '3px',
                    borderRadius: '8px',
                    bgcolor: '#3157FF',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </Box>
              )}
            </Box>
            <Box
              component="button"
              onClick={() => navigate(user ? '/mypage' : '/login')}
              aria-label="로그인"
              sx={{ display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
            >
              <User size={22} strokeWidth={1.5} />
            </Box>
          </Box>
        </Box>
      </Box>

      {brandsOpen && <NavDropdown />}
    </Box>
  )
}
