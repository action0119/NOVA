import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SectionContainer from './SectionContainer'
import Modal from '../common/Modal'
import { useToast } from '../../context/ToastContext'

const STYLES = [
  { key: 'Minimal', label: 'Minimal', desc: '미니멀', seed: 'nova-style-minimal' },
  { key: 'Street', label: 'Street', desc: '스트릿', seed: 'nova-style-street' },
  { key: 'Vintage', label: 'Vintage', desc: '빈티지', seed: 'nova-style-vintage' },
  { key: 'Casual', label: 'Casual', desc: '캐주얼', seed: 'nova-style-casual' },
  { key: 'Office', label: 'Office', desc: '오피스', seed: 'nova-style-office' },
]

export default function AIStyleFinderSection() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [selected, setSelected] = useState('Minimal')
  const [introOpen, setIntroOpen] = useState(false)

  const handleSelect = (style: (typeof STYLES)[number]) => {
    setSelected(style.key)
    showToast(`${style.label} 무드를 선택했습니다.`)
  }

  return (
    <SectionContainer>
      <Box sx={{ display: 'flex', gap: 8 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>01</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            AI Style Finder
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555', mb: 3 }}>
            간단한 질문으로 당신의 취향을 분석하고 어울리는 브랜드와 스타일을 추천합니다.
          </Typography>
          <Box
            component="button"
            onClick={() => setIntroOpen(true)}
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: '#3157FF',
              border: 'none',
              background: 'none',
              p: 0,
              cursor: 'pointer',
            }}
          >
            시작하기 →
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', gap: '20px' }}>
          {STYLES.map((style) => {
            const isSelected = selected === style.key
            return (
              <Box
                key={style.key}
                onClick={() => handleSelect(style)}
                sx={{
                  flex: 1,
                  height: 320,
                  bgcolor: '#FFFFFF',
                  border: `1px solid ${isSelected ? '#3157FF' : '#E5E5E5'}`,
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease',
                  '&:hover': { transform: 'translateY(-6px)' },
                  '&:hover .style-card-image': { transform: 'scale(1.06)' },
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ height: 230, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    className="style-card-image"
                    src={`https://picsum.photos/seed/${style.seed}/400/500`}
                    alt={style.label}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                </Box>
                <Box sx={{ p: '18px' }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#111111' }}>{style.label}</Typography>
                  <Typography sx={{ fontSize: 13, color: '#888888' }}>{style.desc}</Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Modal open={introOpen} onClose={() => setIntroOpen(false)}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
          AI Style Finder
        </Typography>
        <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555', mb: 4 }}>
          성별, 가격대, 색상, 스타일, 무드를 선택하면 NOVA가 당신에게 어울리는 브랜드와 상품을
          추천해드립니다.
        </Typography>
        <Button
          fullWidth
          onClick={() => {
            setIntroOpen(false)
            navigate('/ai-style-finder')
          }}
          sx={{
            height: 52,
            bgcolor: '#3157FF',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 0,
            '&:hover': { bgcolor: '#111111' },
          }}
        >
          AI 스타일 추천 시작하기
        </Button>
      </Modal>
    </SectionContainer>
  )
}
