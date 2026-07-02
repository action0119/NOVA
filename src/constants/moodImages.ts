export const MOODS = ['Minimal', 'Street', 'Casual', 'Vintage', 'Office'] as const
export type Mood = (typeof MOODS)[number]

// Files living under public/image/<Mood>/ — served as-is by Vite (see vite.config base).
const MOOD_FILES: Record<Mood, string[]> = {
  Minimal: [
    'imgi_9_hnmmain8375831020260624083138.jpg',
    'imgi_563_hnm40B1341783_1.jpg',
    'imgi_569_hnm40B1355349_1347870001_202604_LB_0092-S.jpg',
    'imgi_578_hnm40B1199734_3.jpg',
    'imgi_586_hnm40B1355354_1351063001_202604_LB_1112-S.jpg',
    'imgi_593_hnm40B1355350_1351062001_202604_LB_1021-S.jpg',
    'imgi_599_hnm40B1355350_40B1207453.jpg',
    'imgi_600_hnm40B1355348_1341945002_202604_LB_1025-S.jpg',
  ],
  Street: [
    'imgi_65_M-3A_Collections_e41139a1-b5fd-4e24-a391-e1c3faf20ff5.jpg',
    'imgi_67_M-3A_Denim_813a9980-b0c3-4b57-8f0e-931bd6fbeca7.jpg',
    'imgi_69_M-3A_Outerwear_9a9934d2-39e5-485f-a158-7d23599c94bd.jpg',
    'imgi_70_M-3A_Knitwear_e6b82753-5d96-4063-b1f1-fa3dbecad68a.jpg',
    'imgi_124_Final_260305_Mens_Spring_101_KHM035083-413_1643_95674ca6-e505-426d-945a-a673d6b565fe.jpg',
    'imgi_126_Final_260305_Mens_Spring_101_KHM035075-413_1628_8f0f3386-c7ef-4a27-9a93-f0ff967f3b11.jpg',
    'imgi_128_Final_260305_Mens_Spring_101_KHM035074-101_1683_b7ea591f-7447-4d62-9c53-9977af894e46.jpg',
    'imgi_138_Final_Mens_Knicks_Ecomm_KHM034277_0217_910ad1eb-0da2-4193-b575-bbeea326b492.jpg',
  ],
  Casual: [
    'imgi_193_ff5da733388fe0aebf15bebe7b30a630d42951d2.jpg',
    'imgi_197_768c8977f85b7b8e303ed6b30828a4a004dc086f.jpg',
    'imgi_200_872ee02d4bc874b4b25e1cb0cb017c0c9e24c65b.jpg',
    'imgi_221_6b620cc29caa59b4c33fe2ee50cf285838508b02.jpg',
    'imgi_236_fdb354df725401f61163931ea2ad05237735c7e6.jpg',
    'imgi_246_0b6e302e36cae6a33d52f9c01b3cdcc5a22047c7.jpg',
    'imgi_253_251f1e3746bd9190b1b54c1222cb7033c1669119.jpg',
    'imgi_254_a9db1b0dfe3bc71f3dcfd93928757eca4c58dd97.jpg',
    'imgi_259_2f4f54a8440b46505d13bf829d8152cbe1db2e53.jpg',
  ],
  Vintage: [
    'imgi_24_UO-DESKTOP-HP-4UP-US-1.jpg',
    'imgi_25_UO-DESKTOP-HP-4UP-US-2.jpg',
    'imgi_38_UO-DESKTOP-HP-4UP-US-3.jpg',
    'imgi_39_UO-DESKTOP-HP-4UP-US-4.jpg',
    'imgi_66_102633245_010_b.webp',
    'imgi_68_105931919_001_b.webp',
    'imgi_70_104747019_004_b.webp',
    'imgi_71_100290162_050_b.webp',
    'imgi_72_107382723_037_b.webp',
    'imgi_83_100290162_050_b.webp',
    'imgi_89_111509584_003_b.webp',
  ],
  Office: [
    'imgi_13_promo_c01.jpg',
    'imgi_135_s7-AI282P07695001_alternate2.webp',
    'imgi_146_s7-AI282P07685001_alternate1.webp',
    'imgi_150_s7-AI282P07681001_alternate2.webp',
    'imgi_153_s7-AI282P07669001_alternate2.webp',
    'imgi_175_s7-AI211910743514_alternate10.webp',
    'imgi_180_s7-AI211B17443002_alternate10.webp',
    'imgi_181_s7-AI211B30509001_alternate10.webp',
    'imgi_183_s7-AI211B17780001_alternate10.webp',
    'imgi_184_s7-AI211B17231001_alternate10.webp',
  ],
}

const HERO_FILES = ['2.jpg', '3.jpg', '4.jpg']

export function moodImage(mood: Mood, index = 0) {
  const files = MOOD_FILES[mood]
  return `${import.meta.env.BASE_URL}image/${mood}/${files[index % files.length]}`
}

export function heroImage(index: number) {
  return `${import.meta.env.BASE_URL}image/Hero/${HERO_FILES[index % HERO_FILES.length]}`
}

export const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}film/brand-film.mp4`
