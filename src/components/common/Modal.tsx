import { Dialog, IconButton, Box } from '@mui/material'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  width?: number
  children: ReactNode
}

// Generic dialog shell used by FirstVisitModal, QuickViewModal, and the
// AI Style Finder intro popup — no browser alert() anywhere per spec.
export default function Modal({ open, onClose, width = 560, children }: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width,
            maxWidth: '90vw',
            borderRadius: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            p: 6,
            position: 'relative',
          },
        },
        backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.45)' } },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="닫기"
        sx={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, color: '#111111' }}
      >
        <X size={28} />
      </IconButton>
      <Box>{children}</Box>
    </Dialog>
  )
}
