import { useState } from 'react'
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import { loadDaumPostcodeScript } from '../lib/daumPostcode'
import { formatPhoneNumber } from '../utils/phone'
import novaLogo from '../assets/nova-logo-2.png'

const LOGIN_ID_PATTERN = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,13}$/
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,13}$/

export default function SignupPage() {
  const navigate = useNavigate()
  const showToast = useToast()

  const [name, setName] = useState('')
  const [zonecode, setZonecode] = useState('')
  const [roadAddress, setRoadAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [addressManual, setAddressManual] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [loginIdChecked, setLoginIdChecked] = useState<'idle' | 'ok' | 'taken'>('idle')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [referrerId, setReferrerId] = useState('')
  const [infoAgree, setInfoAgree] = useState(false)
  const [marketingAgree, setMarketingAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordMatch: 'idle' | 'match' | 'mismatch' =
    !passwordConfirm ? 'idle' : password === passwordConfirm ? 'match' : 'mismatch'

  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript()
      new window.daum!.Postcode({
        oncomplete: (data) => {
          setZonecode(data.zonecode)
          setRoadAddress(data.roadAddress || data.jibunAddress)
          setAddressManual(false)
        },
      }).open()
    } catch {
      showToast('주소 검색 서비스를 불러오지 못했습니다. 기본주소를 직접 입력해주세요.')
      setAddressManual(true)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const handleSendCode = () => {
    if (!phone.trim()) {
      showToast('전화번호를 입력해주세요.')
      return
    }
    setPhoneCodeSent(true)
    showToast('인증번호가 발송되었습니다. (데모: 아무 6자리 숫자 입력)')
  }

  const handleVerifyCode = () => {
    if (!/^\d{6}$/.test(phoneCode)) {
      showToast('6자리 숫자를 입력해주세요.')
      return
    }
    setPhoneVerified(true)
    showToast('전화번호가 인증되었습니다.')
  }

  const handleCheckLoginId = async () => {
    if (!LOGIN_ID_PATTERN.test(loginId)) {
      showToast('아이디는 영문/숫자/특수문자 포함 8~13자여야 합니다.')
      return
    }
    const { data } = await supabase.rpc('check_login_id_available', { p_login_id: loginId })
    setLoginIdChecked(data ? 'ok' : 'taken')
    showToast(data ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
  }

  const handleSubmit = async () => {
    const fullAddress = `${roadAddress} ${addressDetail}`.trim()
    if (!name.trim() || !roadAddress.trim() || !email.trim() || !phone.trim()) {
      showToast('필수 항목을 모두 입력해주세요.')
      return
    }
    if (!phoneVerified) {
      showToast('전화번호 인증을 완료해주세요.')
      return
    }
    if (loginIdChecked !== 'ok') {
      showToast('아이디 중복확인을 완료해주세요.')
      return
    }
    if (!PASSWORD_PATTERN.test(password)) {
      showToast('비밀번호는 영문, 숫자, 특수문자를 포함한 8~13자여야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!infoAgree) {
      showToast('정보 수신에 동의해주세요.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: name,
            user_login_id: loginId,
            phone_number: phone,
            address: fullAddress,
            marketing_agree: marketingAgree,
            referrer_id: referrerId || null,
          },
        },
      })
      if (error) {
        showToast(error.message.includes('already') ? '이미 가입된 이메일입니다.' : '회원가입에 실패했습니다.')
        return
      }
      showToast('회원가입이 완료되었습니다.')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', py: 10, px: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box component={Link} to="/" sx={{ display: 'flex' }}>
          <Box component="img" src={novaLogo} alt="NOVA" sx={{ height: 40, width: 'auto' }} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#111111', mb: 5, textAlign: 'center' }}>
        회원가입
      </Typography>

      <TextField fullWidth label="이름" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField fullWidth label="우편번호" value={zonecode} sx={{ flex: '0 0 140px' }} disabled />
        <Button onClick={handleAddressSearch} sx={{ flexShrink: 0, height: 56, border: '1px solid #DCDCDC', borderRadius: 0, color: '#111111' }}>
          주소 검색
        </Button>
      </Box>
      <TextField
        fullWidth
        label="기본주소"
        value={roadAddress}
        onChange={(e) => setRoadAddress(e.target.value)}
        disabled={!addressManual}
        sx={{ mb: 2 }}
      />
      <TextField fullWidth label="상세주소" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} sx={{ mb: 2 }} />

      <TextField fullWidth label="이메일" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          label="전화번호"
          placeholder="010-1234-5678"
          value={phone}
          onChange={handlePhoneChange}
          disabled={phoneVerified}
        />
        <Button
          onClick={handleSendCode}
          disabled={phoneVerified}
          sx={{ flexShrink: 0, height: 56, border: '1px solid #DCDCDC', borderRadius: 0, color: '#111111' }}
        >
          인증번호 발송
        </Button>
      </Box>
      {phoneCodeSent && !phoneVerified && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField fullWidth label="인증번호 6자리" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} />
          <Button onClick={handleVerifyCode} sx={{ flexShrink: 0, height: 56, border: '1px solid #DCDCDC', borderRadius: 0, color: '#111111' }}>
            확인
          </Button>
        </Box>
      )}
      {phoneVerified && (
        <Typography sx={{ fontSize: 12, color: '#3157FF', mb: 2 }}>전화번호 인증 완료</Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="아이디 (영문/숫자/특수문자 포함 8~13자)"
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value)
            setLoginIdChecked('idle')
          }}
        />
        <Button onClick={handleCheckLoginId} sx={{ flexShrink: 0, height: 56, border: '1px solid #DCDCDC', borderRadius: 0, color: '#111111' }}>
          중복확인
        </Button>
      </Box>

      <TextField
        fullWidth
        type="password"
        label="비밀번호 (영문/숫자/특수문자 포함 8~13자)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        label="비밀번호 확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        sx={{ mb: passwordMatch === 'idle' ? 2 : 0.5 }}
      />
      {passwordMatch !== 'idle' && (
        <Typography sx={{ fontSize: 12, color: passwordMatch === 'match' ? '#3157FF' : '#E5484D', mb: 2 }}>
          {passwordMatch === 'match' ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
        </Typography>
      )}

      <TextField
        fullWidth
        label="추천인 아이디 (선택)"
        value={referrerId}
        onChange={(e) => setReferrerId(e.target.value)}
        sx={{ mb: 3 }}
      />

      <FormControlLabel
        control={<Checkbox checked={infoAgree} onChange={(e) => setInfoAgree(e.target.checked)} />}
        label={<Typography sx={{ fontSize: 13, color: '#111111' }}>[필수] 정보 수신에 동의합니다.</Typography>}
      />
      <FormControlLabel
        control={<Checkbox checked={marketingAgree} onChange={(e) => setMarketingAgree(e.target.checked)} />}
        label={<Typography sx={{ fontSize: 13, color: '#555555' }}>[선택] 마케팅 정보 수신에 동의합니다.</Typography>}
      />

      <Button
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          height: 52,
          bgcolor: '#111111',
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 0,
          mt: 3,
          '&:hover': { bgcolor: '#3157FF' },
        }}
      >
        회원가입
      </Button>
    </Box>
  )
}
