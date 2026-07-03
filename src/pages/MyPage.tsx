import { useEffect, useState } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../utils/format'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../context/ToastContext'
import { objectPositionForId } from '../utils/objectPosition'
import type { Tables } from '../types/database'

type UserRow = Tables<'users'>
type Order = Tables<'orders'>
type AiStyling = Tables<'ai_styling'>
type RecentView = Tables<'recent_view'> & { product: Tables<'product'> | null }

export default function MyPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  const [profile, setProfile] = useState<UserRow | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ user_name: '', phone_number: '', address: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [aiHistory, setAiHistory] = useState<AiStyling[]>([])
  const [recentViews, setRecentViews] = useState<RecentView[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('users').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data)
        setForm({ user_name: data.user_name, phone_number: data.phone_number ?? '', address: data.address ?? '' })
      }
    })
    supabase.from('orders').select('*').eq('user_id', user.id).order('order_date', { ascending: false }).then(({ data }) => setOrders(data ?? []))
    supabase.from('ai_styling').select('*').eq('user_id', user.id).order('recommended_at', { ascending: false }).then(({ data }) => setAiHistory(data ?? []))
    supabase
      .from('recent_view')
      .select('*, product(*)')
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setRecentViews((data as RecentView[]) ?? []))
  }, [user])

  if (!user) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', py: 15, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, color: '#555555', mb: 3 }}>로그인이 필요한 페이지입니다.</Typography>
        <Button onClick={() => navigate('/login')} sx={{ height: 48, px: 4, bgcolor: '#111111', color: '#FFFFFF', borderRadius: 0 }}>
          로그인하기
        </Button>
      </Box>
    )
  }

  const handleSaveProfile = async () => {
    const { error } = await supabase.from('users').update(form).eq('id', user.id)
    if (error) {
      showToast('회원정보 수정에 실패했습니다.')
      return
    }
    setProfile((prev) => (prev ? { ...prev, ...form } : prev))
    setEditing(false)
    showToast('회원정보가 수정되었습니다.')
  }

  const handleLogout = async () => {
    await signOut()
    showToast('로그아웃되었습니다.')
    navigate('/')
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 6, py: 10 }}>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#111111', mb: 6 }}>마이페이지</Typography>

      <Box component="section" sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111' }}>회원정보</Typography>
          {!editing && (
            <Box component="button" onClick={() => setEditing(true)} sx={{ fontSize: 13, color: '#3157FF', border: 'none', background: 'none', cursor: 'pointer' }}>
              수정
            </Box>
          )}
        </Box>

        {profile && !editing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>이름: {profile.user_name}</Typography>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>아이디: {profile.user_login_id}</Typography>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>이메일: {profile.email}</Typography>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>전화번호: {profile.phone_number || '-'}</Typography>
            <Typography sx={{ fontSize: 14, color: '#555555' }}>주소: {profile.address || '-'}</Typography>
          </Box>
        )}

        {editing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 360 }}>
            <TextField label="이름" value={form.user_name} onChange={(e) => setForm((f) => ({ ...f, user_name: e.target.value }))} />
            <TextField label="전화번호" value={form.phone_number} onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))} />
            <TextField label="주소" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleSaveProfile} sx={{ height: 44, px: 3, bgcolor: '#111111', color: '#FFFFFF', borderRadius: 0 }}>
                저장
              </Button>
              <Button onClick={() => setEditing(false)} sx={{ height: 44, px: 3, border: '1px solid #DCDCDC', color: '#111111', borderRadius: 0 }}>
                취소
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box component="section" sx={{ mb: 8 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 2 }}>바로가기</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => navigate('/wishlist')} sx={{ height: 40, px: 2, border: '1px solid #DCDCDC', color: '#111111', borderRadius: 0 }}>
            관심목록
          </Button>
          <Button onClick={() => navigate('/cart')} sx={{ height: 40, px: 2, border: '1px solid #DCDCDC', color: '#111111', borderRadius: 0 }}>
            장바구니
          </Button>
        </Box>
      </Box>

      <Box component="section" sx={{ mb: 8 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 2 }}>주문 내역</Typography>
        {orders.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: '#888888' }}>주문 내역이 없습니다.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {orders.map((o) => (
              <Box key={o.order_id} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5', py: 1.5 }}>
                <Typography sx={{ fontSize: 13, color: '#888888' }}>{new Date(o.order_date).toLocaleDateString('ko-KR')}</Typography>
                <Typography sx={{ fontSize: 13, color: '#555555' }}>{o.order_status}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111111' }}>{formatPrice(o.total_price)}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box component="section" sx={{ mb: 8 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 2 }}>AI 추천 기록</Typography>
        {aiHistory.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: '#888888' }}>추천 기록이 없습니다.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {aiHistory.map((h) => (
              <Typography key={h.recommendation_id} sx={{ fontSize: 14, color: '#555555' }}>
                {new Date(h.recommended_at).toLocaleDateString('ko-KR')} · {h.mood} 무드 · {h.brand_name} · {h.price_range}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      <Box component="section" sx={{ mb: 8 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 2 }}>최근 본 상품</Typography>
        {recentViews.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: '#888888' }}>최근 본 상품이 없습니다.</Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {recentViews.map((rv) =>
              rv.product ? (
                <Box
                  key={rv.recent_view_id}
                  onClick={() => navigate(`/products/detail/${rv.product!.product_id}`)}
                  sx={{ width: 120, flexShrink: 0, cursor: 'pointer' }}
                >
                  <Box component="img" src={rv.product.product_image ?? undefined} alt={rv.product.product_name} sx={{ width: 120, height: 150, objectFit: 'cover', objectPosition: objectPositionForId(rv.product.product_id), mb: 1 }} />
                  <Typography sx={{ fontSize: 12, color: '#555555' }}>{rv.product.product_name}</Typography>
                </Box>
              ) : null
            )}
          </Box>
        )}
      </Box>

      <Button onClick={handleLogout} sx={{ height: 44, px: 3, border: '1px solid #DCDCDC', color: '#555555', borderRadius: 0 }}>
        로그아웃
      </Button>
    </Box>
  )
}
