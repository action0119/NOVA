import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HERO_IMAGE = 'https://picsum.photos/seed/nova-hero/1920/720'

export default function HeroBanner() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: 'relative',
        height: 720,
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(248,248,248,0.92) 0%, rgba(248,248,248,0.55) 38%, rgba(248,248,248,0) 70%)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: 520, ml: '96px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '1px', color: '#111111', mb: 2 }}>
            2026 SPRING / SUMMER
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
            Find Your Next Style
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: '#555555', mb: 4 }}>
            사용자의 취향을 발견하는 패션 큐레이션 플랫폼
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
      <Typography
        sx={{
          position: 'absolute',
          right: 48,
          bottom: 32,
          fontSize: 13,
          fontWeight: 500,
          color: '#111111',
        }}
      >
        01 / 03
      </Typography>
    </Box>
  )
}
