import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  from: 'user' | 'bot'
  text: string
}

const DEMO_REPLY = '문의가 접수되었습니다. NOVA AI톡은 데모 기능입니다.'

// 전 페이지 공통 우하단 AI톡 버튼. 실제 AI 응답 없이 고정 데모 메시지로 응답한다.
export default function AiTalkButton() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: '안녕하세요! NOVA AI톡입니다. 무엇을 도와드릴까요?' },
  ])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: DEMO_REPLY }])
    }, 400)
  }

  return (
    <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 200 }}>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 64,
            width: 320,
            height: 420,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, borderBottom: '1px solid #E5E5E5' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111111' }}>NOVA AI톡</Typography>
            <Box component="button" onClick={() => setOpen(false)} aria-label="닫기" sx={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: '#888888' }}>
              <X size={18} strokeWidth={1.5} />
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  bgcolor: m.from === 'user' ? '#111111' : '#F3F3F3',
                  color: m.from === 'user' ? '#FFFFFF' : '#111111',
                  fontSize: 13,
                  lineHeight: 1.5,
                  px: '12px',
                  py: '8px',
                  borderRadius: '10px',
                }}
              >
                {m.text}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderTop: '1px solid #E5E5E5' }}>
            <Box
              component="input"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
              placeholder="문의사항을 입력해주세요"
              sx={{
                flex: 1,
                height: 36,
                border: '1px solid #DCDCDC',
                px: 1.5,
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <Box
              component="button"
              onClick={handleSend}
              aria-label="전송"
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                bgcolor: '#111111',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <Send size={15} strokeWidth={1.5} />
            </Box>
          </Box>
        </Box>
      )}

      <Box
        component="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="AI톡 문의"
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          bgcolor: '#111111',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <MessageCircle size={22} strokeWidth={1.5} />}
      </Box>
    </Box>
  )
}
