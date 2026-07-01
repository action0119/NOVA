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
