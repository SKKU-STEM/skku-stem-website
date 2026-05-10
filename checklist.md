# SKKU-STEM Website — Checklist

## Stage 1 — Project Init & Design Tokens (current)

- [x] `package.json` — name `skku-stem-website`, scripts (dev/build/preview/check)
- [x] Astro 5 + TypeScript strict 설정 (`astro.config.mjs`, `tsconfig.json`)
- [x] Tailwind CSS 4 via `@tailwindcss/vite` (Tailwind 3용 `@astrojs/tailwind` 미사용)
- [x] Self-hosted variable fonts: Inter / Newsreader / JetBrains Mono (`@fontsource-variable/*`)
- [x] Astro Image (sharp) 서비스 명시
- [x] Astro Content Collections placeholder (`src/content.config.ts`)
- [x] Pagefind devDependency + build 스크립트 통합 (`astro build && pagefind --site dist`)
- [x] MDX, sitemap 통합
- [x] 디자인 토큰 (`src/styles/global.css` — `@theme` 블록)
  - [x] `--color-cream: #FAF9F5`
  - [x] `--color-ink: #141413`
  - [x] `--color-coral: #CC785C`
  - [x] cream/ink/coral 파생 톤 스케일
  - [x] `--font-sans` (Inter), `--font-serif`/`--font-display` (Newsreader), `--font-mono` (JetBrains Mono)
  - [x] radius / shadow / container 토큰
- [x] Base layer (html/body/h1-h6/focus/selection)
- [x] `container-page`, `container-prose` 커스텀 utility
- [x] `BaseLayout.astro` — header/nav/footer + skip-link + OG/canonical
- [x] `index.astro` — placeholder + token swatch
- [x] `.gitignore`
- [x] `checklist.md`, `context-notes.md`
- [x] `npm install` 통과 (447 packages, 50s)
- [x] `astro check` 통과 (6 files: 0 errors / 0 warnings / 0 hints)

## Stage 2 — Header / Footer / Layout chrome

- [x] `src/assets/logo.svg` — placeholder 워드마크 (currentColor 단일 톤)
- [x] `Logo.astro` — Astro 5 stable SVG component import 래퍼
- [x] `Header.astro` — 64px / cream / 하단 ink/10 보더 / 데스크톱 nav 6항목 / 모바일 햄버거 + ESC 닫기
- [x] `Footer.astro` — 주소 / 4 외부 링크 (placeholder) / © 2026 / `text-ink/70`
- [x] BaseLayout 리팩토링 — Header/Footer 분리, `min-h-dvh flex flex-col`로 footer 하단 고정
- [x] 디자인 토큰 업데이트 — `--container-page` 1120px, `--container-prose` 720px, `container-page` 패딩 20/32px, `section-stack` 56/96px utility
- [x] `astro check` 통과 (9 파일 / 0/0/0)
- [ ] **TODO(content)**: Footer 외부 링크 4개의 실제 URL (학과 / 학교 / GitHub / ORCID)
- [ ] **TODO(content)**: 진짜 로고 SVG (사용자가 추후 제공) → `src/assets/logo.svg` 교체
- [ ] favicon.svg (`public/`에 배치 — 현재 404)

## Stage 3 — Page content

- [x] Home — split hero + 3 highlight cards + by-the-numbers stats + 한글 recruiting
  - [ ] **TODO(content)**: hero 그룹 사진 (현재 cream-300 placeholder)
  - [ ] **TODO(content)**: highlight 3편의 실제 논문 정보 + DOI
  - [ ] **TODO(content)**: stat 4개 정확한 수치 확인 (60+ pubs / 3 N/S / 2 OSS / 8 members)
- [x] Research — 이전 사이트 highlights 마이그레이션 (28 entries, 역연대기 timeline)
  - [x] `src/data/research-highlights.ts`로 데이터 분리 + 신규 항목 추가 절차 주석
  - [x] 연도별 그룹핑 + 좌측 sticky year column + 상단 year jump nav
  - [x] DOI / Code / mention 표기 (entry별 옵션 필드)
  - [x] entry별 4:3 figure 슬롯 (lg+ 텍스트 우측, 그 이하 텍스트 아래 stack)
  - [x] `src/components/FigureSlot.astro` (재사용 가능 — aspect/label 변경 가능) + `src/assets/research/README.md`
  - [ ] **TODO(content)**: 28개 entry 각각의 대표 figure 업로드 (현재 모두 placeholder)
- [x] People — 이전 사이트 Members 페이지 마이그레이션 (`/people` index + `/people/pi`)
  - [x] PI feature 카드 + Postdocs(2) + Ph.D. Candidates(12) + Undergrad(1) + Alumni(15)
  - [x] 모든 멤버/alumni 카드에 portrait 슬롯 추가 — 우측 상단 3:4 (`w-24`), Astro Image + 점선 placeholder
  - [x] `src/components/PortraitBox.astro` + `src/assets/people/README.md`
  - [x] PI 별도 페이지: bio + Education + Research Experience + Honors + Selected Publications + Contact
  - [x] Selected Publications — Microscopy-based Materials Science (18) + AI Microscopy (6), `src/data/pi-publications.ts`로 분리
  - [ ] **TODO(content)**: PI 사진 (현재 placeholder)
  - [ ] **TODO(content)**: 각 논문 DOI URL 추가 (현재 doi 필드 비어있음)
  - [ ] **TODO(content)**: 이전 사이트에 더 있던 항목 — talks / patents / service — 있으면 추가
  - [ ] **TODO(check)**: 정호현이 MS course지만 이전 사이트가 "Ph.D. Candidates" 섹션에 둠. 분류 유지/이동 PI 확인
- [ ] Research — 연구 주제 (group themes, projects)
- [ ] People — PI / 연구원 / 졸업생
- [ ] Publications — Content Collection (year/type 필터, BibTeX export 검토)
- [ ] Gallery — Astro Image responsive grid
- [ ] Facilities — 장비/시설 카탈로그
- [ ] News — Content Collection (date sort, RSS)
- [ ] Join — 모집 공고 + apply flow
- [ ] Contact — 위치/지도/이메일
- [ ] Pagefind UI 컴포넌트 (`/pagefind/pagefind-ui.js` 동적 로드)
- [ ] 404 페이지
- [ ] `robots.txt` + `sitemap.xml` 검증

- [x] Publications — 이전 사이트 3-layer 구조 마이그레이션
  - [x] `/publications` (메인) — SKKU 시기 SCI 논문 179편 (`src/data/publications-skku.ts`)
  - [x] `/publications/before-skku` — Pre-SKKU 시기 52편 (`src/data/publications-pre-skku.ts`)
  - [x] `/publications/non-sci-patents` — 29 items mixed (Korean/US patents + non-SCI papers + book) (`src/data/publications-non-sci-patents.ts`)
  - [x] Lead authorship coral 강조 + DOI 링크. 각 데이터 파일 상단에 신규 항목 추가 절차 주석
  - [x] Sub-page 탭 nav, year jump nav, 좌측 sticky year column, compact 2-3 line entry
  - [ ] **TODO(content)**: lead 휴리스틱(YK*)이 captured한 lead 분류를 PI가 검토 — 이전 사이트 청색 분류와 다른 항목은 데이터 파일에서 boolean 토글
  - [ ] **TODO(content)**: 이전 사이트의 Presentations 페이지는 사용자 요청대로 마이그레이션 제외

## Stage 4 — Polish

- [ ] 다크 모드 결정 (cream/ink 반전 vs 단일 라이트 테마)
- [ ] 한국어/영어 i18n (Astro i18n routing) 필요 여부 확인
- [ ] OG 이미지 자동 생성 (Satori 등)
- [ ] Lighthouse / a11y 점검
- [x] 배포 타겟 확정 — Cloudflare Pages (skkustem.org)

## Stage 5 — CMS 도입 (PRD §10)

진행 단위는 PRD §10.5의 8단계. 오늘은 **steps 2~4** (마이그레이션)만, OAuth/admin은 다음 세션.

### 5.1 마이그레이션 (2026-05-10 완료)

- [x] `tsx` devDep 추가 (마이그레이션 스크립트 실행용)
- [x] `src/content.config.ts` — zod 스키마 9개 정의
  - [x] publications-skku / before-skku / non-sci-patents / pi-selected (file collection, JSON array)
  - [x] news (folder, .md, frontmatter-only — body 필드도 frontmatter에)
  - [x] members (folder, .md, section enum 필드로 분류)
  - [x] research-highlights / facilities (folder, .md, summary/description도 frontmatter)
  - [x] gallery-events (folder, .md)
- [x] `scripts/migrate-to-content.ts` — TS data → src/content/* 변환 (npx tsx 실행, 일회성)
- [x] 스크립트 실행 + 산출물 spot-check
  - 결과: publications 4 JSON (179+52+29+24=284 entries) + news 8 + members 30 + research-highlights 28 + facilities 2 + gallery-events 52 = 총 7개 컬렉션, 404 entries
- [x] 페이지 10개 재연결 (`getCollection`)
  - [x] index.astro / research.astro
  - [x] people/index.astro (인라인 members 데이터 285줄 제거)
  - [x] people/pi.astro
  - [x] publications/{index, before-skku, non-sci-patents}.astro
  - [x] news.astro / gallery.astro / facilities.astro
- [x] `src/data/*.ts` 9개 파일 + 디렉토리 제거
- [x] `npm run check` — 0 errors / 0 warnings / 0 hints (35 files)
- [x] `npm run build` — 성공, 10 pages + sitemap + pagefind 인덱싱
- [x] 페이지 헤더 주석 + src/assets/*/README.md의 데이터 경로 안내를 새 src/content/* 경로로 업데이트
- [ ] 시각 회귀 — `npm run dev`로 10개 페이지 모두 기존과 동일하게 렌더되는지 확인 (사용자 검토)

### 5.2 CMS UI (2026-05-10)

- [x] 사전 정리 — Members 스키마에서 unused `portrait` 필드 제거 + PortraitBox/people 페이지 정리
- [x] 사전 정리 — News 스키마 `body` → `summary` 리네임 (Sveltia/Decap이 `body`를 markdown body로 예약)
- [x] 사전 정리 — Publications JSON 4개를 `[...]` → `{ "items": [...] }` 래퍼로 감싸고 file() loader에 `parser` 추가 (Sveltia/Decap의 file collection은 객체 루트 요구)
- [x] OAuth 프록시 — `functions/oauth/auth.js` + `callback.js` (Cloudflare Pages Functions, `wrangler` 불필요)
- [x] 관리자 셸 — `public/admin/index.html` (Sveltia CMS 번들 외부 CDN 로드)
- [x] 컬렉션 매핑 — `public/admin/config.yml` (9 컬렉션, zod 스키마와 1:1)
- [x] `public/robots.txt` — `/admin/`, `/oauth/` Disallow 추가
- [x] `npm run check` — 0/0/0
- [ ] `npm run build` — 통과 확인 (Pages Functions는 빌드에 영향 없음)
- [ ] GitHub OAuth App 생성 (사용자 직접) — Homepage `https://skkustem.org`, Callback `https://skkustem.org/oauth/callback`
- [ ] Cloudflare Pages env 변수 등록: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (Encrypt) — 사용자 직접
- [ ] git push → Pages 빌드 1~3분 대기 → `https://skkustem.org/admin` 접속 → GitHub 인증 → 한 entry(예: news) 편집 → 라이브 반영 확인
