import { Box } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionContainerProps {
  bgcolor?: string
  children: ReactNode
}

// Shared 1280px-max, 120px vertical / 48px horizontal padding wrapper used by
// all four home content sections.
export default function SectionContainer({ bgcolor = '#FFFFFF', children }: SectionContainerProps) {
  return (
    <Box sx={{ bgcolor, py: 15 }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6 }}>{children}</Box>
    </Box>
  )
}
