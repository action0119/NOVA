// 인물이 담긴 이미지(Hero, Trend&Mood, 상세페이지 착용컷 등)에서 얼굴이 잘리지 않도록
// 인덱스별로 다른 object-position을 순환 배정한다.
const OBJECT_POSITIONS = ['center top', '50% 20%', '50% 35%', 'center 15%', '50% 25%', 'center 10%']

export function objectPositionFor(index: number): string {
  return OBJECT_POSITIONS[Math.abs(index) % OBJECT_POSITIONS.length]
}

// product_id/brand_id처럼 안정적인 문자열 키를 해시해 인덱스를 순환시킨다.
// 목록 어디서든 같은 id는 항상 같은 object-position을 받아 리렌더에도 흔들리지 않는다.
export function objectPositionForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return objectPositionFor(hash)
}
