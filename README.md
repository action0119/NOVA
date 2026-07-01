# NOVA — Find Your Next Style

AI 기반 패션 큐레이션 플랫폼 포트폴리오 프로젝트. React + MUI + Supabase 기반의
데스크탑 전용(1920px 기준) 웹사이트입니다.

## 기술 스택

- Vite + React + TypeScript
- MUI (Material UI)
- React Router (`HashRouter`, GitHub Pages 대응)
- Supabase (Postgres + Auth)
- Zustand (전역 상태: 인증/장바구니/위시리스트)
- lucide-react (라인 아이콘)
- Pretendard (폰트)

## 로컬 개발

```bash
npm install
cp .env.example .env   # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 입력
npm run dev
```

## 빌드 / 프리뷰

```bash
npm run build
npm run preview
```

## 데이터베이스

Supabase 프로젝트 "NOVA project"에 14개 테이블(회원/상품/브랜드/카테고리/위시리스트/
장바구니/주문/주문상세/리뷰/검색어/최근본상품/AI추천/이벤트/쿠폰)을 구축했습니다.
스키마와 RLS 정책은 `supabase/migrations/`에 기록되어 있으며, Supabase MCP를 통해
라이브 프로젝트에 직접 적용되었습니다.

- 인증은 Supabase Auth(이메일/비밀번호)를 사용하며, `public.users`는 프로필 테이블로
  `auth.users`와 1:1 연결됩니다(비밀번호는 `auth.users`에만 저장).
- 소셜 로그인(카카오/네이버/구글/애플) 버튼은 UI 데모입니다(실제 OAuth 미연동).
- 비회원 장바구니는 로컬스토리지 기반이며, 로그인 시 계정 장바구니와 동기화됩니다.
- 위시리스트/AI 추천 저장은 로그인이 필요합니다.

## 배포

`main` 브랜치에 push되면 `.github/workflows/deploy.yml`이 자동으로 빌드 후
GitHub Pages(Actions 배포 방식)에 배포합니다.

### 배포 전 필요한 수동 설정

1. **Repository Secrets 추가** (Settings → Secrets and variables → Actions)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **GitHub Pages 소스 설정**: Settings → Pages → Build and deployment → Source를
   **GitHub Actions**로 설정
3. **Supabase Auth 이메일 확인 비활성화** (선택이지만 권장): Authentication →
   Providers → Email → "Confirm email" 끄기 — 켜져 있으면 SMTP 미설정 시
   회원가입 후 즉시 로그인이 되지 않습니다.
4. 배포 후 확인: `https://<github-username>.github.io/NOVA/`

## 폴더 구조

```
src/
├── components/
│   ├── common/   # Modal, Toast, ProductCard, QuickViewModal, StarRating
│   ├── layout/   # Header, NavDropdown, Footer, Layout
│   └── home/     # 메인 페이지 5개 섹션
├── pages/        # 라우트별 페이지
├── hooks/        # useProducts, useBrands, useWishlistToggle
├── store/        # zustand: auth / cart / wishlist
├── context/      # ToastContext
├── theme/        # MUI 테마, 폰트
└── lib/          # supabase client
supabase/migrations/  # 적용된 SQL 마이그레이션 기록
```
