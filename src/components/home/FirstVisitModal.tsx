import { useEffect, useState } from 'react'
import { Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'

const STORAGE_KEY = 'nova_hide_popup_date'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function FirstVisitModal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === todayISO()) return
    const timer = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleHideToday = () => {
    localStorage.setItem(STORAGE_KEY, todayISO())
    setOpen(false)
  }

  const handleStart = () => {
    setOpen(false)
    navigate('/ai-style-finder')
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Typography sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: '#111111', mb: 2 }}>
        Find Your Style with AI
      </Typography>
      <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#555555', mb: 4 }}>
        간단한 질문으로 당신의 취향을 분석하고 어울리는 브랜드와 스타일을 추천해드립니다.
      </Typography>
      <Button
        fullWidth
        onClick={handleStart}
        sx={{
          height: 52,
          bgcolor: '#3157FF',
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 0,
          mb: 1,
          '&:hover': { bgcolor: '#111111' },
        }}
      >
        AI 스타일 추천 시작하기
      </Button>
      <Button
        fullWidth
        onClick={handleHideToday}
        sx={{
          height: 44,
          bgcolor: 'transparent',
          color: '#888888',
          fontSize: 14,
          fontWeight: 400,
          borderRadius: 0,
          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
        }}
      >
        오늘 하루 보지 않기
      </Button>
    </Modal>
  )
}
