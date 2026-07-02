import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ShoppingBasket, User, Heart, Lock } from 'lucide-react'
import NavDropdown, { type DropdownKey } from './NavDropdown'
import { useToast } from '../../context/ToastContext'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import novaLogo from '../../assets/nova-logo.png'
import { LOGO_ROW_HEIGHT, NAV_ROW_HEIGHT, UTIL_ROW_HEIGHT } from './headerConstants'

const NAV_ITEMS = [
  { label: 'BEST', to: '/products?tag=BEST' },
  { label: 'Only', to: null },
  { label: 'Sale', to: '/products?tag=SALE' },
  { label: 'New', to: '/products?tag=NEW' },
  { label: 'Women', to: '/products?category=Women', dropdown: 'Women' as const },
  { label: 'Men', to: '/products?category=Men', dropdown: 'Men' as const },
  { label: 'Brands', to: null, dropdown: 'Brands' as const },
  { label: 'Editorial', to: null },
  { label: 'AI Styling', to: '/ai-style-finder', accent: true },
]

const iconBtnSx = {
  display: 'flex',
  border: 'none',
  background: 'none',
  p: 0,
  cursor: 'pointer',
  color: '#111111',
}

export default function Header() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const cartCount = useCartStore((s) => s.items.length)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const [searchValue, setSearchValue] = useState('')

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.to) {
      navigate(item.to)
    } else if (item.label === 'Editorial' || item.label === 'Only') {
      showToast(`${item.label}은(는) 준비 중입니다.`)
    }
  }

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const trimmed = searchValue.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <Box sx={{ position: 'relative' }} onMouseLeave={() => setActiveDropdown(null)}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        <Box sx={{ maxWidth: 1920, mx: 'auto', px: 6 }}>
          <Box sx={{ height: LOGO_ROW_HEIGHT, display: 'flex', alignItems: 'center' }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="img" src={novaLogo} alt="NOVA" sx={{ height: 72, width: 'auto' }} />
            </Box>
          </Box>

          <Box component="nav" sx={{ height: NAV_ROW_HEIGHT, display: 'flex', alignItems: 'center', gap: 5 }}>
            {NAV_ITEMS.map((item) => (
              <Box
                key={item.label}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => setActiveDropdown(item.dropdown ?? null)}
                sx={{
                  fontSize: 17,
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

          <Box sx={{ height: UTIL_ROW_HEIGHT, display: 'flex', alignItems: 'center', gap: '22px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 420,
                height: 40,
                border: '1px solid #DCDCDC',
                px: 1.5,
              }}
            >
              <Search size={18} strokeWidth={1.5} color="#888888" />
              <Box
                component="input"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="브랜드, 상품을 검색해보세요"
                sx={{
                  flex: 1,
                  ml: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  bgcolor: 'transparent',
                }}
              />
            </Box>

            <Box component="button" onClick={() => navigate('/login')} aria-label="로그인/회원가입" sx={iconBtnSx}>
              <Lock size={20} strokeWidth={1.5} />
            </Box>
            <Box component="button" onClick={() => navigate('/wishlist')} aria-label="관심상품" sx={iconBtnSx}>
              <Heart size={20} strokeWidth={1.5} />
            </Box>
            <Box component="button" onClick={() => navigate('/cart')} aria-label="장바구니" sx={{ ...iconBtnSx, position: 'relative' }}>
              <ShoppingBasket size={20} strokeWidth={1.5} />
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
              aria-label="마이페이지"
              sx={iconBtnSx}
            >
              <User size={20} strokeWidth={1.5} />
            </Box>
          </Box>
        </Box>
      </Box>

      <NavDropdown activeKey={activeDropdown} />
    </Box>
  )
}
