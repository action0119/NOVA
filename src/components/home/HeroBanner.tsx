import { useRef } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { HERO_VIDEO_SRC, heroImage } from '../../constants/moodImages'

// Brand film opens on a text card — skip ahead to the clean footage and loop
// back to this point instead of 0s so the intro text never replays.
const HERO_VIDEO_START = 3

const SLIDES = [
  {
    type: 'video' as const,
    eyebrow: '2026 SPRING / SUMMER',
    title: 'Find Your Next Style',
    desc: '사용자의 취향을 발견하는 패션 큐레이션 플랫폼',
  },
  {
    type: 'image' as const,
    src: heroImage(0),
    eyebrow: 'NEW ARRIVAL',
    title: 'Season Off, Minimal',
    desc: '이번 시즌 가장 먼저 만나는 신상 컬렉션',
  },
  {
    type: 'image' as const,
    src: heroImage(1),
    eyebrow: 'CURATED FOR YOU',
    title: 'Style That Belongs To You',
    desc: 'NOVA가 선별한 브랜드와 스타일을 만나보세요',
  },
  {
    type: 'image' as const,
    src: heroImage(2),
    eyebrow: 'SHOP THE TREND',
    title: 'Everyday, Elevated',
    desc: '일상을 완성하는 트렌드 아이템',
  },
]

export default function HeroBanner() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)

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

  return (
    <Box sx={{ position: 'relative', height: 720 }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onBeforeInit={(swiper: SwiperType) => {
          // @ts-expect-error swiper's navigation params accept element refs at runtime
          swiper.params.navigation.prevEl = prevRef.current
          // @ts-expect-error see above
          swiper.params.navigation.nextEl = nextRef.current
          // @ts-expect-error swiper's pagination params accept an element ref at runtime
          swiper.params.pagination.el = paginationRef.current
        }}
        navigation
        pagination={{
          type: 'fraction',
          formatFractionCurrent: (n) => String(n).padStart(2, '0'),
          formatFractionTotal: (n) => String(n).padStart(2, '0'),
        }}
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
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
                      Explore Collection
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
                      AI Style Finder
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <Box
        sx={{
          position: 'absolute',
          right: 48,
          bottom: 32,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <Box
          ref={paginationRef}
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: '#111111',
            display: 'flex',
            '& .swiper-pagination-current': { fontWeight: 700 },
          }}
        />
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Box
            component="button"
            ref={prevRef}
            aria-label="이전 슬라이드"
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #111111',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: '#111111',
            }}
          >
            ←
          </Box>
          <Box
            component="button"
            ref={nextRef}
            aria-label="다음 슬라이드"
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #111111',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: '#111111',
            }}
          >
            →
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
