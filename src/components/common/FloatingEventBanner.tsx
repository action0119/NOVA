import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Pause, X } from 'lucide-react'
import { MOODS, moodImage } from '../../constants/moodImages'

const STORAGE_KEY = 'nova_hide_banner_date'
const SLIDE_INTERVAL = 3000

const SLIDES = MOODS.map((mood, i) => ({ mood, src: moodImage(mood, i + 1) }))

const CAPTIONS: Record<(typeof MOODS)[number], string> = {
  Minimal: '미니멀 룩 시즌 오프',
  Street: '스트릿 신상 입고',
  Casual: '여름 특가 세일',
  Vintage: '시즌 한정 할인 아이템',
  Office: '브랜드를 찾아라',
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const controlBtnSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#555555',
}

export default function FloatingEventBanner() {
  const location = useLocation()
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === todayISO())
  const [closed, setClosed] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (dismissed || closed || !playing) return
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [dismissed, closed, playing])

  if (location.pathname !== '/' || dismissed || closed) return null

  const handleHideToday = () => {
    localStorage.setItem(STORAGE_KEY, todayISO())
    setDismissed(true)
  }

  const goPrev = () => setSlideIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  const goNext = () => setSlideIndex((i) => (i + 1) % SLIDES.length)

  const slide = SLIDES[slideIndex]

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 24,
        bottom: 24,
        width: 300,
        zIndex: 200,
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box sx={{ position: 'relative', width: 300, height: 225 }}>
        <Box
          component="img"
          src={slide.src}
          alt={slide.mood}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            px: '8px',
            height: 22,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '11px',
            bgcolor: 'rgba(0,0,0,0.45)',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {slideIndex + 1}/{SLIDES.length}
        </Box>
        <Typography
          sx={{
            position: 'absolute',
            left: 16,
            bottom: 14,
            fontSize: 16,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {CAPTIONS[slide.mood]}
        </Typography>
      </Box>

      <Box
        sx={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '14px',
        }}
      >
        <Box
          component="button"
          onClick={handleHideToday}
          sx={{
            border: 'none',
            background: 'none',
            p: 0,
            cursor: 'pointer',
            fontSize: 12,
            color: '#888888',
          }}
        >
          오늘 하루 보지 않기
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Box component="button" onClick={goPrev} aria-label="이전" sx={controlBtnSx}>
            <ChevronLeft size={16} strokeWidth={1.5} />
          </Box>
          <Box component="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? '정지' : '재생'} sx={controlBtnSx}>
            {playing ? <Pause size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} />}
          </Box>
          <Box component="button" onClick={goNext} aria-label="다음" sx={controlBtnSx}>
            <ChevronRight size={16} strokeWidth={1.5} />
          </Box>
          <Box component="button" onClick={() => setClosed(true)} aria-label="닫기" sx={controlBtnSx}>
            <X size={14} strokeWidth={1.5} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
