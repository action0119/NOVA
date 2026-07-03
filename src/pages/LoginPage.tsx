import { useState } from 'react'
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import novaLogo from '../assets/nova-logo-2.png'

const SOCIAL_PROVIDERS = ['네이버', '카카오', '구글', '애플']

export default function LoginPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)
  const [saveId, setSaveId] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!loginId.trim() || !password) {
      showToast('아이디(이메일)와 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      let email = loginId.trim()
      if (!email.includes('@')) {
        const { data, error } = await supabase.rpc('get_email_by_login_id', { p_login_id: email })
        if (error || !data) {
          showToast('일치하는 계정을 찾을 수 없습니다.')
          return
        }
        email = data
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        showToast('로그인에 실패했습니다. 정보를 다시 확인해주세요.')
        return
      }
      showToast('로그인되었습니다.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', py: 12, px: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box component={Link} to="/" sx={{ display: 'flex' }}>
          <Box component="img" src={novaLogo} alt="NOVA" sx={{ height: 40, width: 'auto' }} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#111111', mb: 5, textAlign: 'center' }}>
        로그인
      </Typography>

      <TextField
        fullWidth
        placeholder="아이디 또는 이메일"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)} />}
          label={<Typography sx={{ fontSize: 13, color: '#555555' }}>자동 로그인</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={saveId} onChange={(e) => setSaveId(e.target.checked)} />}
          label={<Typography sx={{ fontSize: 13, color: '#555555' }}>아이디 저장</Typography>}
        />
      </Box>

      <Button
        fullWidth
        disabled={loading}
        onClick={handleLogin}
        sx={{
          height: 52,
          bgcolor: '#111111',
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 0,
          mb: 1.5,
          '&:hover': { bgcolor: '#3157FF' },
        }}
      >
        로그인
      </Button>
      <Button
        fullWidth
        onClick={() => navigate('/cart')}
        sx={{
          height: 44,
          bgcolor: 'transparent',
          color: '#111111',
          border: '1px solid #DCDCDC',
          fontSize: 14,
          fontWeight: 500,
          borderRadius: 0,
          mb: 3,
        }}
      >
        비회원 주문
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Typography
          component="button"
          onClick={() => showToast('아이디 찾기는 데모입니다.')}
          sx={{ fontSize: 13, color: '#555555', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          아이디 찾기
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#DCDCDC' }}>|</Typography>
        <Typography
          component="button"
          onClick={() => showToast('비밀번호 찾기는 데모입니다.')}
          sx={{ fontSize: 13, color: '#555555', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          비밀번호 찾기
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#DCDCDC' }}>|</Typography>
        <Typography
          component={Link}
          to="/signup"
          sx={{ fontSize: 13, color: '#3157FF', cursor: 'pointer' }}
        >
          회원가입
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {SOCIAL_PROVIDERS.map((provider) => (
          <Button
            key={provider}
            fullWidth
            onClick={() => showToast(`${provider} 로그인은 데모입니다.`)}
            sx={{
              height: 48,
              bgcolor: '#FFFFFF',
              color: '#111111',
              border: '1px solid #DCDCDC',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 0,
              '&:hover': { bgcolor: '#F8F8F8' },
            }}
          >
            {provider} 로그인
          </Button>
        ))}
      </Box>
    </Box>
  )
}
