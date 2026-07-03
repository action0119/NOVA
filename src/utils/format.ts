export function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`
}

export const TAG_COLORS: Record<string, string> = {
  NEW: '#111111',
  BEST: '#3157FF',
  'AI PICK': '#6B5BFF',
  SALE: '#E5484D',
  'SOLD OUT': '#BDBDBD',
}

export const TAG_LABELS: Record<string, string> = {
  NEW: '신상',
  BEST: '베스트',
  'AI PICK': 'AI 추천',
  SALE: '세일',
  'SOLD OUT': '품절',
}
