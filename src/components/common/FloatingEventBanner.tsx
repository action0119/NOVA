import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { MOODS, moodImage } from '../../constants/moodImages'

const STORAGE_KEY = 'nova_hide_banner_date'
const SLIDE_INTERVAL = 2000

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

export default function FloatingEventBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === todayISO())
  const [closed, setClosed] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    if (dismissed || closed) return
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [dismissed, closed])

  if (dismissed || closed) return null

  const handleHideToday = () => {
    localStorage.setItem(STORAGE_KEY, todayISO())
    setDismissed(true)
  }

  const slide = SLIDES[slideIndex]

  return (
    <Box sx={{ position: 'fixed', left: 24, bottom: 24, width: 375, zIndex: 200, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}>
      <Box sx={{ position: 'relative', width: 375, height: 281, overflow: 'hidden' }}>
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
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            left: 20,
            bottom: 20,
            fontSize: 20,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {CAPTIONS[slide.mood]}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 375,
          height: 39,
          bgcolor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
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
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 15,
            color: '#777777',
          }}
        >
          오늘 하루 보지 않기
        </Box>
        <Box
          component="button"
          onClick={() => setClosed(true)}
          sx={{
            border: 'none',
            background: 'none',
            p: 0,
            cursor: 'pointer',
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 15,
            color: '#000000',
          }}
        >
          닫기
        </Box>
      </Box>
    </Box>
  )
}
