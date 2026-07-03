import { useRef, useState } from 'react'
import { Box, Typography, Button, GlobalStyles } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { HERO_VIDEO_SRC, heroImage } from '../../constants/moodImages'
import { objectPositionFor } from '../../utils/objectPosition'

// Brand film opens on a text card — skip ahead to the clean footage and loop
// back to this point instead of 0s so the intro text never replays.
const HERO_VIDEO_START = 3
const AUTOPLAY_DELAY = 5000
const SLIDE_SPEED = 800

const SLIDES = [
  {
    type: 'video' as const,
    eyebrow: '2026 봄 / 여름',
    title: '당신의 다음 스타일을 찾다',
    desc: '사용자의 취향을 발견하는 패션 큐레이션 플랫폼',
  },
  {
    type: 'image' as const,
    src: heroImage(0),
    eyebrow: '신상 입고',
    title: '시즌 오프, 미니멀',
    desc: '이번 시즌 가장 먼저 만나는 신상 컬렉션',
  },
  {
    type: 'image' as const,
    src: heroImage(1),
    eyebrow: '당신을 위한 큐레이션',
    title: '당신만의 스타일',
    desc: 'NOVA가 선별한 브랜드와 스타일을 만나보세요',
  },
  {
    type: 'image' as const,
    src: heroImage(2),
    eyebrow: '트렌드 쇼핑하기',
    title: '더 특별한 일상',
    desc: '일상을 완성하는 트렌드 아이템',
  },
]

export default function HeroBanner() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)
  const [playing, setPlaying] = useState(true)

  const handleVideoLoaded = () => {
    if (videoRef.current) videoRef.current.currentTime = HERO_VIDEO_START
  }

  const handleVideoTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    if (v.currentTime >= v.duration - 0.15) {
      v.currentTime = HERO_VIDEO_START
      v.play()
    }
  }

  const togglePlaying = () => {
    const swiper = swiperRef.current
    if (!swiper) return
    if (playing) {
      swiper.autoplay.stop()
    } else {
      swiper.autoplay.start()
    }
    setPlaying((p) => !p)
  }

  return (
    <Box>
      <GlobalStyles
        styles={{
          '.hero-swiper .swiper-wrapper': { transitionTimingFunction: 'ease-in' },
          '.hero-progressbar .swiper-pagination-progressbar-fill': { background: '#111111' },
        }}
      />
      <Box sx={{ position: 'relative', height: 720 }}>
        <Swiper
          className="hero-swiper"
          modules={[Navigation, Pagination, Autoplay]}
          loop
          speed={SLIDE_SPEED}
          autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onBeforeInit={(swiper: SwiperType) => {
            // @ts-expect-error swiper's navigation params accept element refs at runtime
            swiper.params.navigation.prevEl = prevRef.current
            // @ts-expect-error see above
            swiper.params.navigation.nextEl = nextRef.current
            // @ts-expect-error swiper's pagination params accept an element ref at runtime
            swiper.params.pagination.el = progressRef.current
          }}
          navigation
          pagination={{ type: 'progressbar' }}
          style={{ height: '100%' }}
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box sx={{ position: 'relative', height: 720 }}>
                {slide.type === 'video' ? (
                  <Box
                    component="video"
                    ref={videoRef}
                    src={HERO_VIDEO_SRC}
                    autoPlay
                    muted
                    playsInline
                    onLoadedMetadata={handleVideoLoaded}
                    onTimeUpdate={handleVideoTimeUpdate}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={slide.src}
                    alt={slide.title}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: objectPositionFor(index),
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(248,248,248,0.92) 0%, rgba(248,248,248,0.55) 38%, rgba(248,248,248,0) 70%)',
                  }}
                />
                <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 520, ml: '96px' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '1px', color: '#111111', mb: 2 }}>
                      {slide.eyebrow}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 52,
                        fontWeight: 700,
                        lineHeight: 1.08,
                        letterSpacing: '-2px',
                        color: '#111111',
                        mb: 3,
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: '#555555', mb: 4 }}>
                      {slide.desc}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '12px' }}>
                      <Button
                        onClick={() => navigate('/products')}
                        sx={{
                          width: 180,
                          height: 52,
                          bgcolor: '#3157FF',
                          color: '#FFFFFF',
                          border: '1px solid #3157FF',
                          fontSize: 14,
                          fontWeight: 600,
                          borderRadius: 0,
                          '&:hover': { bgcolor: '#111111', borderColor: '#111111' },
                        }}
                      >
                        컬렉션 보기
                      </Button>
                      <Button
                        onClick={() => navigate('/ai-style-finder')}
                        sx={{
                          width: 180,
                          height: 52,
                          bgcolor: 'transparent',
                          color: '#111111',
                          border: '1px solid #111111',
                          fontSize: 14,
                          fontWeight: 600,
                          borderRadius: 0,
                          '&:hover': { bgcolor: '#111111', color: '#FFFFFF' },
                        }}
                      >
                        AI 스타일 찾기
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Hero 하단 컨트롤: 이전/진행바/다음/재생-정지 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', mt: '16px' }}>
        <Box
          component="button"
          ref={prevRef}
          aria-label="이전 슬라이드"
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: '#111111',
          }}
        >
          ←
        </Box>

        <Box
          ref={progressRef}
          className="hero-progressbar"
          sx={{
            width: 1202,
            maxWidth: '60vw',
            height: 18,
            bgcolor: 'transparent',
            position: 'relative',
            '& .swiper-pagination-progressbar-fill': { height: '100%' },
          }}
        />

        <Box
          component="button"
          ref={nextRef}
          aria-label="다음 슬라이드"
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: '#111111',
          }}
        >
          →
        </Box>

        <Box
          component="button"
          onClick={togglePlaying}
          aria-label={playing ? '슬라이드 정지' : '슬라이드 재생'}
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: '#111111',
          }}
        >
          {playing ? <Pause size={16} strokeWidth={1.5} /> : <Play size={16} strokeWidth={1.5} />}
        </Box>
      </Box>
    </Box>
  )
}
