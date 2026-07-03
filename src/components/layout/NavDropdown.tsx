import { Box, Typography } from '@mui/material'
import { useToast } from '../../context/ToastContext'
import { HEADER_HEIGHT } from './headerConstants'
import { WOMEN_MEGA_MENU, MEN_MEGA_MENU, type MegaMenuColumn } from '../../constants/categoryMenu'

export type DropdownKey = 'Women' | 'Men' | null

interface NavDropdownProps {
  activeKey: DropdownKey
}

const MENUS: Record<'Women' | 'Men', MegaMenuColumn[]> = {
  Women: WOMEN_MEGA_MENU,
  Men: MEN_MEGA_MENU,
}

// 여성/남성 메뉴 hover 시 헤더 바로 아래 전체 너비로 펼쳐지는 5컬럼 카테고리 메가메뉴.
// 절대 위치 오버레이라 열려도 헤더 높이는 흔들리지 않는다.
export default function NavDropdown({ activeKey }: NavDropdownProps) {
  const showToast = useToast()
  const open = activeKey !== null
  const columns = activeKey ? MENUS[activeKey] : []

  const handleItemClick = (item: string) => {
    showToast(`${item} 카테고리 페이지는 데모입니다.`)
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
        maxHeight: open ? 300 : 0,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'max-height 0.3s ease, opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, py: '36px', display: 'flex', gap: '56px' }}>
        {columns.map((column) => (
          <Box key={column.title} sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: 'Pretendard', fontSize: 15, fontWeight: 700, color: '#111111', mb: 2 }}>
              {column.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {column.items.map((item) => (
                <Box
                  key={item}
                  component="button"
                  onClick={() => handleItemClick(item)}
                  sx={{
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    p: 0,
                    cursor: 'pointer',
                    fontFamily: 'Pretendard',
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.9,
                    color: '#555555',
                    '&:hover': { color: '#3157FF' },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
