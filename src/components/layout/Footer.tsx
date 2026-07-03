import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useToast } from '../../context/ToastContext'
import novaLogo from '../../assets/nova-logo-2.png'

// lucide-react dropped brand/logo glyphs, so the two SNS marks are drawn
// inline to match the rest of the header/footer's 1.5px line-icon style.
function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="#111111" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth={1.5}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="#111111" stroke="none" />
    </svg>
  )
}

function KakaotalkIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth={1.5}>
      <path d="M12 4C6.98 4 3 7.28 3 11.32c0 2.58 1.66 4.85 4.16 6.15-.18.66-.66 2.4-.75 2.77-.12.46.17.45.36.33.15-.1 2.36-1.6 3.32-2.25.62.09 1.26.14 1.91.14 5.02 0 9-3.28 9-7.32C21 7.28 17.02 4 12 4z" />
    </svg>
  )
}

const FOOTER_MENUS = [
  { title: '회사', items: ['소개', '문의하기', '채용정보'] },
  { title: '고객센터', items: ['자주 묻는 질문', '1:1 문의', '배송 안내', '교환/반품'] },
  { title: '이용정책', items: ['이용약관', '개인정보처리방침'] },
]

export default function Footer() {
  const showToast = useToast()
  const [email, setEmail] = useState('')

  const handleSubscribe = () => {
    if (!email.trim()) {
      showToast('이메일을 입력해주세요.')
      return
    }
    showToast('뉴스레터 구독이 완료되었습니다.')
    setEmail('')
  }

  return (
    <Box component="footer" sx={{ bgcolor: '#EAE3D9', pt: 10, pb: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
          <Box sx={{ maxWidth: 320 }}>
            <Box component="img" src={novaLogo} alt="NOVA" sx={{ height: 150, width: 'auto', mb: 3 }} />
            <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: '#555555', mb: 3 }}>
              당신의 취향을 발견하는 패션 큐레이션 플랫폼, NOVA입니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: '14px', mb: 3 }}>
              <Box
                component="button"
                onClick={() => showToast('Instagram 연동은 데모입니다.')}
                aria-label="Instagram"
                sx={{ display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
              >
                <InstagramIcon />
              </Box>
              <Box
                component="button"
                onClick={() => showToast('YouTube 연동은 데모입니다.')}
                aria-label="Youtube"
                sx={{ display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
              >
                <YoutubeIcon />
              </Box>
              <Box
                component="button"
                onClick={() => showToast('KakaoTalk 연동은 데모입니다.')}
                aria-label="KakaoTalk"
                sx={{ display: 'flex', border: 'none', background: 'none', p: 0, cursor: 'pointer', color: '#111111' }}
              >
                <KakaotalkIcon />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111111', mb: 0.5 }}>고객센터</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111' }}>1588-0119</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 8 }}>
            {FOOTER_MENUS.map((menu) => (
              <Box key={menu.title}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 2 }}>
                  {menu.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {menu.items.map((item) => (
                    <Typography
                      key={item}
                      component="button"
                      onClick={() => showToast(`${item} 페이지는 준비 중입니다.`)}
                      sx={{
                        fontSize: 13,
                        color: '#555555',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        p: 0,
                        textAlign: 'left',
                        '&:hover': { color: '#111111' },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ minWidth: 280 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 1 }}>
              뉴스레터
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#555555', mb: 2 }}>
              NOVA의 새로운 브랜드와 스타일 소식을 받아보세요.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box
                component="input"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                sx={{
                  width: 240,
                  height: 44,
                  border: '1px solid #DCDCDC',
                  fontSize: 14,
                  px: 1.5,
                  fontFamily: 'inherit',
                  outline: 'none',
                  '&:focus': { borderColor: '#111111' },
                }}
              />
              <Box
                component="button"
                onClick={handleSubscribe}
                sx={{
                  width: 120,
                  height: 44,
                  bgcolor: '#111111',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                구독하기
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.15)', mt: 6, pt: 3 }}>
          <Typography sx={{ fontSize: 12, color: '#888888', textAlign: 'center' }}>
            © 2026 NOVA. 모든 권리 보유.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
