// 인물이 담긴 이미지(Hero, Trend&Mood, 상세페이지 착용컷 등)에서 얼굴이 잘리지 않도록
// 인덱스별로 다른 object-position을 순환 배정한다.
const OBJECT_POSITIONS = ['center top', '50% 20%', '50% 35%', 'center 15%', '50% 25%', 'center 10%']

export function objectPositionFor(index: number): string {
  return OBJECT_POSITIONS[Math.abs(index) % OBJECT_POSITIONS.length]
}
