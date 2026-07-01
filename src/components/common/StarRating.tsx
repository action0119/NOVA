import { Box } from '@mui/material'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export default function StarRating({ value, onChange, size = 18 }: StarRatingProps) {
  const interactive = Boolean(onChange)
  return (
    <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Box
          key={n}
          component={interactive ? 'button' : 'span'}
          onClick={interactive ? () => onChange?.(n) : undefined}
          sx={{
            display: 'inline-flex',
            p: 0,
            border: 'none',
            background: 'none',
            cursor: interactive ? 'pointer' : 'default',
            lineHeight: 0,
          }}
        >
          <Star
            size={size}
            fill={n <= value ? '#111111' : 'none'}
            color={n <= value ? '#111111' : '#DCDCDC'}
            strokeWidth={1.5}
          />
        </Box>
      ))}
    </Box>
  )
}
