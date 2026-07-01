import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import SectionContainer from './SectionContainer'
import { useToast } from '../../context/ToastContext'

const HASHTAGS = ['Minimal', 'Street', 'Casual', 'Vintage', 'Office', 'Daily']

const MOOD_CARDS = [
  { key: 'Minimal', seed: 'nova-trend-minimal' },
  { key: 'Street', seed: 'nova-trend-street' },
  { key: 'Casual', seed: 'nova-trend-casual' },
  { key: 'Vintage', seed: 'nova-trend-vintage' },
]

export default function TrendMoodSection() {
  const showToast = useToast()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (mood: string) => {
    setSelected(mood)
    showToast(`${mood} 무드의 스타일을 탐색합니다.`)
  }

  return (
    <SectionContainer bgcolor="#F8F8F8">
      <Box sx={{ display: 'flex', gap: 8 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#888888', mb: 2 }}>02</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
            Trend &amp; Mood
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
                  #{tag}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', gap: '20px' }}>
          {MOOD_CARDS.map((card) => (
            <Box
              key={card.key}
              onClick={() => handleSelect(card.key)}
              sx={{
                position: 'relative',
                flex: 1,
                height: 340,
                cursor: 'pointer',
                overflow: 'hidden',
                border: selected === card.key ? '2px solid #3157FF' : 'none',
              }}
            >
              <Box
                component="img"
                src={`https://picsum.photos/seed/${card.seed}/400/500`}
                alt={card.key}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor:
                    selected === card.key ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2.5,
                }}
              >
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>{card.key}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </SectionContainer>
  )
}
