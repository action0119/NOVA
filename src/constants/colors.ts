// 상품 컬러명(영문, DB 고정값) → 실제 표시 hex. 상세페이지 컬러 버튼 배경에 사용.
export const COLOR_HEX: Record<string, string> = {
  Black: '#111111',
  White: '#FFFFFF',
  Beige: '#E8DCC8',
  Navy: '#1B2A4A',
  Grey: '#9C9C9C',
  Brown: '#6B4226',
  Blue: '#3157FF',
  Ivory: '#FFFFF0',
  Khaki: '#8B8362',
  Skyblue: '#87CEEB',
  Green: '#4B6B3A',
}

// 상대 휘도 기준으로 밝은/어두운 톤을 판별해 버튼 글자색(흰/검)을 자동 결정한다.
export function isDarkColor(hex: string): boolean {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.6
}
