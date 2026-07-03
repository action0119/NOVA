import { Box } from '@mui/material'

// 실제 사이즈 이미지 자산이 없어 순수 SVG로 그린 의류 실루엣 + 측정 안내 다이어그램.
// 어깨너비/가슴단면/총장/소매길이 네 항목을 점선 치수선과 라벨로 표시한다.
export default function SizeGuideDiagram() {
  return (
    <Box sx={{ bgcolor: '#F8F8F8', display: 'flex', justifyContent: 'center', py: 4 }}>
      <svg width="320" height="360" viewBox="0 0 320 360" fill="none">
        {/* 의류 실루엣 */}
        <path
          d="M110 50 L140 50 L160 70 L180 50 L210 50 L245 85 L220 120 L200 105 L200 310 L120 310 L120 105 L100 120 L75 85 Z"
          stroke="#111111"
          strokeWidth="2"
          fill="#FFFFFF"
        />

        {/* 어깨너비 */}
        <line x1="110" y1="42" x2="210" y2="42" stroke="#3157FF" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="160" y="28" textAnchor="middle" fontSize="12" fill="#111111">어깨너비</text>

        {/* 가슴단면 */}
        <line x1="120" y1="130" x2="200" y2="130" stroke="#3157FF" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="160" y="150" textAnchor="middle" fontSize="12" fill="#111111">가슴단면</text>

        {/* 총장 */}
        <line x1="262" y1="50" x2="262" y2="310" stroke="#3157FF" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="270" y="182" textAnchor="start" fontSize="12" fill="#111111">총장</text>

        {/* 소매길이 */}
        <line x1="180" y1="50" x2="245" y2="85" stroke="#E5484D" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="255" y="70" textAnchor="start" fontSize="12" fill="#111111">소매길이</text>
      </svg>
    </Box>
  )
}
