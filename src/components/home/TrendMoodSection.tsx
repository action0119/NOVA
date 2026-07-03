import { useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import SectionContainer from './SectionContainer'
import { useToast } from '../../context/ToastContext'
import { moodImage, MOODS, MOOD_LABELS } from '../../constants/moodImages'
import { objectPositionFor } from '../../utils/objectPosition'

const HASHTAG_LABELS: Record<string, string> = { ...MOOD_LABELS, Daily: '데일리' }
const HASHTAGS = ['Minimal', 'Street', 'Casual', 'Vintage', 'Office', 'Daily']

const CARD_WIDTH = 205
const CARD_HEIGHT = 275
const CARD_GAP = 20
const VISIBLE_CARDS = 4

const arrowBtnSx = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '50%',
  bgcolor: 'rgba(255,255,255,0.5)',
  color: '#111111',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
}

export default function TrendMoodSection() {
  const showToast = useToast()
  const [selected, setSelected] = useState<string | null>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const handleSelect = (mood: string) => {
    setSelected(mood)
    showToast(`${HASHTAG_LABELS[mood] ?? mood} 무드의 스타일을 탐색합니다.`)
  }

  return (
    <SectionContainer bgcolor="#F8F8F8">
      <Box sx={{ display: 'flex', gap: 8 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>02</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            트렌드 &amp; 무드
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555', mb: 3 }}>
            이번 시즌 주목해야 할 트렌드와 당신의 무드를 탐색해보세요.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {HASHTAGS.map((tag) => {
              const isSelected = selected === tag
              return (
                <Box
                  key={tag}
                  component="button"
                  onClick={() => handleSelect(tag)}
                  sx={{
                    height: 40,
                    px: '18px',
                    borderRadius: '20px',
                    border: `1px solid ${isSelected ? '#111111' : '#DCDCDC'}`,
                    bgcolor: isSelected ? '#111111' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#111111',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  #{HASHTAG_LABELS[tag] ?? tag}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: CARD_WIDTH * VISIBLE_CARDS + CARD_GAP * (VISIBLE_CARDS - 1),
            maxWidth: '100%',
          }}
        >
          <Box component="button" ref={prevRef} aria-label="이전 무드" sx={{ ...arrowBtnSx, left: -18 }}>
            ←
          </Box>
          <Box component="button" ref={nextRef} aria-label="다음 무드" sx={{ ...arrowBtnSx, right: -18 }}>
            →
          </Box>

          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={CARD_GAP}
            onBeforeInit={(swiper: SwiperType) => {
              // @ts-expect-error swiper's navigation params accept element refs at runtime
              swiper.params.navigation.prevEl = prevRef.current
              // @ts-expect-error see above
              swiper.params.navigation.nextEl = nextRef.current
            }}
            navigation
            style={{ overflow: 'hidden' }}
          >
            {MOODS.map((mood, index) => (
              <SwiperSlide key={mood} style={{ width: CARD_WIDTH }}>
                <Box
                  onClick={() => handleSelect(mood)}
                  sx={{
                    position: 'relative',
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={moodImage(mood, 0)}
                    alt={MOOD_LABELS[mood]}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPositionFor(index) }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: selected === mood ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
                      {MOOD_LABELS[mood]}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </SectionContainer>
  )
}
