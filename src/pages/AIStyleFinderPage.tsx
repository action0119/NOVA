import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../context/ToastContext'
import type { ProductWithBrand } from '../hooks/useProducts'

const GENDERS = ['Women', 'Men']
const PRICE_RANGES = [
  { label: '10만원 이하', min: 0, max: 100000 },
  { label: '10~20만원', min: 100000, max: 200000 },
  { label: '20~30만원', min: 200000, max: 300000 },
  { label: '30만원 이상', min: 300000, max: Infinity },
]
const COLORS = ['Black', 'White', 'Beige', 'Navy', 'Grey', 'Brown', 'Blue']
const STYLES = ['Minimal', 'Street', 'Vintage', 'Casual', 'Office']
const MOODS = ['Minimal', 'Street', 'Vintage', 'Casual', 'Office']

function SelectRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111111', mb: 1.5 }}>{label}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map((opt) => (
          <Box
            key={opt}
            component="button"
            onClick={() => onChange(opt)}
            sx={{
              height: 40,
              px: 2,
              border: `1px solid ${value === opt ? '#111111' : '#DCDCDC'}`,
              bgcolor: value === opt ? '#111111' : '#FFFFFF',
              color: value === opt ? '#FFFFFF' : '#111111',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {opt}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function AIStyleFinderPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const user = useAuthStore((s) => s.user)

  const [gender, setGender] = useState<string | null>(null)
  const [priceLabel, setPriceLabel] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ProductWithBrand[] | null>(null)

  const handleRecommend = async () => {
    if (!gender || !priceLabel || !color || !style) {
      showToast('모든 항목을 선택해주세요.')
      return
    }
    setLoading(true)
    const range = PRICE_RANGES.find((r) => r.label === priceLabel)!

    const { data } = await supabase
      .from('product')
      .select('*, brand(brand_id, brand_name), category(category_name, parent_category:parent_category_id(category_name))')

    type Row = ProductWithBrand & { category: { category_name: string; parent_category: { category_name: string } | null } | null }
    const rows = (data as Row[]) ?? []

    const scored = rows
      .filter((r) => r.category?.parent_category?.category_name === gender)
      .filter((r) => r.product_price >= range.min && r.product_price < range.max)
      .map((r) => {
        let score = 0
        if (r.mood === style) score += 2
        if (mood && r.mood === mood) score += 1
        if (r.color?.includes(color)) score += 1
        return { row: r, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.row)

    setResults(scored)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) {
      showToast('로그인이 필요한 기능입니다.')
      navigate('/login')
      return
    }
    if (!results || results.length === 0) return

    await supabase.from('ai_styling').insert({
      user_id: user.id,
      product_id: results[0].product_id,
      mood: style,
      brand_name: results[0].brand?.brand_name ?? null,
      price_range: priceLabel,
    })
    showToast('추천 결과가 저장되었습니다.')
  }

  const recommendedBrands = results
    ? [...new Set(results.map((r) => r.brand?.brand_name).filter(Boolean))].slice(0, 3)
    : []

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 6, py: 10 }}>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#111111', mb: 1 }}>AI Style Finder</Typography>
      <Typography sx={{ fontSize: 16, color: '#555555', mb: 6 }}>
        당신의 취향을 알려주시면 어울리는 브랜드와 상품을 추천해드립니다.
      </Typography>

      <SelectRow label="성별" options={GENDERS} value={gender} onChange={setGender} />
      <SelectRow label="가격대" options={PRICE_RANGES.map((r) => r.label)} value={priceLabel} onChange={setPriceLabel} />
      <SelectRow label="선호 색상" options={COLORS} value={color} onChange={setColor} />
      <SelectRow label="스타일" options={STYLES} value={style} onChange={setStyle} />
      <SelectRow label="선호 무드" options={MOODS} value={mood} onChange={setMood} />

      <Button
        fullWidth
        disabled={loading}
        onClick={handleRecommend}
        sx={{ height: 52, bgcolor: '#3157FF', color: '#FFFFFF', fontSize: 15, fontWeight: 600, borderRadius: 0, mb: 8, '&:hover': { bgcolor: '#111111' } }}
      >
        AI 추천 시작
      </Button>

      {results && (
        <Box>
          {results.length === 0 ? (
            <Typography sx={{ fontSize: 14, color: '#888888', textAlign: 'center', py: 6 }}>
              조건에 맞는 추천 결과가 없습니다. 다른 조건을 선택해보세요.
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 2 }}>추천 브랜드</Typography>
              <Typography sx={{ fontSize: 15, color: '#555555', mb: 5 }}>{recommendedBrands.join(', ')}</Typography>

              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111111', mb: 3 }}>추천 상품</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', mb: 5 }}>
                {results.map((p) => (
                  <ProductCard key={p.product_id} product={p} brandName={p.brand?.brand_name} />
                ))}
              </Box>

              <Button
                fullWidth
                onClick={handleSave}
                sx={{ height: 48, border: '1px solid #111111', color: '#111111', fontSize: 14, fontWeight: 600, borderRadius: 0 }}
              >
                추천 결과 저장
              </Button>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
