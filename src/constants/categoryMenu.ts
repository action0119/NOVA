export interface MegaMenuColumn {
  title: string
  items: string[]
}

export const WOMEN_MEGA_MENU: MegaMenuColumn[] = [
  { title: '의류', items: ['아우터', '원피스', '상의', '하의', '니트'] },
  { title: '가방', items: ['숄더백', '크로스백', '토트백', '백팩', '지갑'] },
  { title: '신발', items: ['스니커즈', '로퍼', '샌들', '부츠'] },
  { title: '액세서리', items: ['주얼리', '모자', '시계', '아이웨어'] },
  { title: '해외 브랜드', items: ['의류', '가방', '신발', '액세서리'] },
]

export const MEN_MEGA_MENU: MegaMenuColumn[] = [
  { title: '의류', items: ['아우터', '셔츠', '티셔츠', '팬츠', '니트'] },
  { title: '가방', items: ['백팩', '크로스백', '숄더백', '토트백', '지갑'] },
  { title: '신발', items: ['스니커즈', '로퍼', '샌들', '부츠'] },
  { title: '액세서리', items: ['벨트', '시계', '모자', '아이웨어'] },
  { title: '해외 브랜드', items: ['의류', '가방', '신발', '액세서리'] },
]
