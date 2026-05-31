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
- [x] favicon.svg (`public/favicon.svg` + `favicon.png`)

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
- [ ] Research — 연구 주제 (group themes, projects) — next-session.md 참고
- [x] People — PI / 연구원 / 졸업생 (= 위 People 섹션 L55–60에서 완료)
- [x] Publications — Content Collection (= 위 Publications 섹션 L77–82 + Stage 5.1 마이그레이션)
- [x] Gallery — Astro Image responsive grid (`gallery.astro` + `PhotoMosaic.astro`, lightbox)
- [x] Facilities — 장비/시설 카탈로그 (`facilities.astro`, JEM-ARM300F + ARM200F)
- [x] News — Content Collection (`news` collection, date sort, category filter)
  - [x] RSS feed (`/rss.xml` endpoint via `@astrojs/rss`, BaseLayout `<link rel="alternate">` 자동 노출)
- [ ] ~~Join — 모집 공고 + apply flow~~ N/A (PRD §4 — Home recruiting 섹션 + footer 이메일로 통합, 별도 페이지 없음)
- [ ] ~~Contact — 위치/지도/이메일~~ N/A (PRD §4 — 동일 이유)
- [x] Pagefind UI 컴포넌트 (`/pagefind/pagefind-ui.js` 동적 로드) — `SearchDialog.astro` (Header 아이콘 + `<dialog>` 모달, Cmd/Ctrl+K · `/` 단축키, cream/coral 토큰 override)
- [x] 404 페이지 (`src/pages/404.astro` — witty headline + 사이트 검색 모달 트리거 + Home 버튼, Cloudflare Pages가 dist/404.html을 자동 fallback)
- [x] `robots.txt` + `sitemap.xml` 검증 — robots.txt(admin/oauth Disallow), `@astrojs/sitemap`이 sitemap-index.xml 생성, GSC 제출 완료 (PRD §11)

- [x] Publications — 이전 사이트 3-layer 구조 마이그레이션
  - [x] `/publications` (메인) — SKKU 시기 SCI 논문 179편 (`src/data/publications-skku.ts`)
  - [x] `/publications/before-skku` — Pre-SKKU 시기 52편 (`src/data/publications-pre-skku.ts`)
  - [x] `/publications/non-sci-patents` — 29 items mixed (Korean/US patents + non-SCI papers + book) (`src/data/publications-non-sci-patents.ts`)
  - [x] Lead authorship coral 강조 + DOI 링크. 각 데이터 파일 상단에 신규 항목 추가 절차 주석
  - [x] Sub-page 탭 nav, year jump nav, 좌측 sticky year column, compact 2-3 line entry
  - [ ] **TODO(content)**: lead 휴리스틱(YK*)이 captured한 lead 분류를 PI가 검토 — 이전 사이트 청색 분류와 다른 항목은 데이터 파일에서 boolean 토글
  - [ ] **TODO(content)**: 이전 사이트의 Presentations 페이지는 사용자 요청대로 마이그레이션 제외

## Stage 4 — Polish

- [x] 다크 모드 결정 — 보류 (context-notes §9, 라이트 가정 사진/그림 다수)
- [ ] 한국어/영어 i18n (Astro i18n routing) 필요 여부 확인
- [ ] OG 이미지 자동 생성 (Satori 등)
- [x] Lighthouse / a11y 점검 — 10 페이지 모두 a11y 100 / best-practices 100 / SEO 100. 색 대비, label 일치, link-in-text-block, target-size 4종 위반 모두 해소. perf는 라이브 CDN 기준 측정 필요 (script: scripts/lighthouse-audit.mjs).
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
- [x] 시각 회귀 — Stage 5.2 라이브 배포 + 끝-to-끝 검증 (2026-05-10) 으로 갈음

### 5.2 CMS UI (2026-05-10)

- [x] 사전 정리 — Members 스키마에서 unused `portrait` 필드 제거 + PortraitBox/people 페이지 정리
- [x] 사전 정리 — News 스키마 `body` → `summary` 리네임 (Sveltia/Decap이 `body`를 markdown body로 예약)
- [x] 사전 정리 — Publications JSON 4개를 `[...]` → `{ "items": [...] }` 래퍼로 감싸고 file() loader에 `parser` 추가 (Sveltia/Decap의 file collection은 객체 루트 요구)
- [x] OAuth 프록시 — `functions/oauth/auth.js` + `callback.js` (Cloudflare Pages Functions, `wrangler` 불필요)
- [x] 관리자 셸 — `public/admin/index.html` (Sveltia CMS 번들 외부 CDN 로드)
- [x] 컬렉션 매핑 — `public/admin/config.yml` (9 컬렉션, zod 스키마와 1:1)
- [x] `public/robots.txt` — `/admin/`, `/oauth/` Disallow 추가
- [x] `npm run check` — 0/0/0
- [x] `npm run build` — 통과 확인 (Pages Functions는 빌드에 영향 없음)
- [x] GitHub OAuth App 생성 — Homepage `https://skkustem.org`, Callback `https://skkustem.org/oauth/callback`
- [x] Cloudflare Pages env 변수 등록: `GITHUB_CLIENT_ID` (Text), `GITHUB_CLIENT_SECRET` (Secret)
- [x] git push → Pages 빌드 → `https://skkustem.org/admin` 접속 → GitHub 인증 → 9 컬렉션 노출 확인 (2026-05-10)
- [x] news entry 편집·저장·라이브 반영 끝-to-끝 확인 (2026-05-10, commit bed627f) — CMS는 SKKU-STEM author로 main에 직접 commit, 메시지 패턴은 `Update News post "{slug}"`

## 6. Hero 슬라이드쇼 (CMS, 2026-05-27)

- [x] 기존 히어로 사진을 `src/assets/photos/` → `src/assets/hero/`로 이동 (`git mv`)
- [x] 슬라이드 데이터 `src/content/home/hero.json` (`items[]`, image/alt/caption) 시드
- [x] `src/components/HeroSlideshow.astro` — 가로 슬라이드 캐러셀(화살표+점, 자동재생 5s, hover 정지, reduced-motion 존중)
- [x] `src/pages/index.astro` — 하드코딩 `<Image>` figure → `<HeroSlideshow slides={heroSlides} />`
- [x] `public/admin/config.yml` — `home` 컬렉션(`Home · Hero slides`, list min:1 max:3, image→/src/assets/hero) 추가
- [x] `src/assets/hero/README.md` — 업로드/명명/해상도 가이드
- [x] `npm run check` 0/0/0 / `npm run build` 통과 / 3장·1장 렌더 검증
- [ ] (배포) git push → Cloudflare Pages 라이브 반영 — 사용자 승인 후

## 7. Home Research highlights + Recent papers 개편 (2026-05-28)

- [x] `src/content/home/research-featured.json` — 홈 큐레이션 카드 2장 시드 (eyebrow/title/summary/link/media[])
- [x] `public/research-featured/` — 시드 이미지 2장 복사 (silver films, ML electrode)
- [x] `src/components/ResearchHighlightCard.astro` — 미디어 캐러셀(이미지/GIF ≤3장) + YouTube 클릭재생 facade + 호버 그라디언트 그림자, 제목=카드별 link
- [x] `src/pages/index.astro`
  - [x] 'Research highlights' 섹션 신설 — 2-카드 그리드, 우상단 'All research' 버튼(→/research), Recent papers 위에 배치
  - [x] 기존 'Recent highlights' → 'Recent papers'로 리네임 + 3-카드 그리드 → 컴팩트 3줄 리스트
  - [x] 'All publications'를 시각화된 아웃라인 pill 버튼으로
- [x] `public/admin/config.yml` — `home` 컬렉션에 research-featured 파일 추가(media: image/youtube/alt list max 3), 컬렉션 라벨 'Home'으로
- [x] `npm run check` 0/0/0 / `npm run build` 통과 (11 pages + pagefind)
- [x] (수정) YouTube 재생 iframe 크기 — 동적 생성 요소에 scoped CSS 미적용 → 인라인 스타일로 슬롯 채움
- [x] (수정) 캐러셀 자동 슬라이드(5s) 추가 — hover/focus·탭 비활성 정지, 동영상 재생 시 영구 정지
- [x] Hero — 좌측 텍스트/우측 사진 높이 동일화(grid items-stretch + 사진 height:100%·object-cover), 캡션을 사진 안쪽 하단 그라디언트 스크림 오버레이로 이동
- [x] (배포 완료) commit 0fb2593 → push → Cloudflare Pages 라이브 반영

## 8. News 미디어 일원화 (2026-05-28)

- [x] `src/components/MediaCarousel.astro` — 미디어 캐러셀 로직을 공용 컴포넌트로 추출(이미지/GIF/YouTube, 자동 슬라이드, `data-mc-*`, aspect prop)
- [x] `ResearchHighlightCard.astro` — 인라인 미디어를 `<MediaCarousel>`로 교체(카드 호버 글로우는 유지, 미디어 호버 sheen은 제거)
- [x] News `photoCount`(파일명 규칙) → `media[]`(image/youtube/alt) 일원화
  - [x] `content.config.ts` news 스키마 photoCount → media 배열
  - [x] 기존 8장 `src/assets/news/` → `public/news-media/` git mv, 6개 entry frontmatter 마이그레이션
  - [x] `news.astro` — NewsPhoto 그리드 → `<MediaCarousel>` (max-w-xl)
  - [x] orphan 제거: `NewsPhoto.astro`, `src/assets/news/`(README 포함)
  - [x] `public/admin/config.yml` news photoCount 필드 → media list(max 8, /public/news-media)
  - [x] `public/news-media/README.md` 새 안내
- [x] `npm run check` 0/0/0 / `npm run build` 통과 (11 pages, 홈 2 카드 + 뉴스 5 캐러셀 렌더 확인)

## 9. Gallery 미디어 일원화 (2026-05-28)

- [x] 사용자 결정: News처럼 MediaCarousel로 통일(모자이크+라이트박스 → 캐러셀, 이미지 최적화 약화 수용)
- [x] `content.config.ts` gallery-events 스키마 photoCount → media[] 배열
- [x] 일회성 스크립트로 52개 entry 마이그레이션 + 137장 `src/assets/gallery/` → `public/gallery-media/` 이동 (실행 후 스크립트 삭제)
  - [x] 슬러그 접두 충돌 방지(정확히 `<slug>-<n>.jpg` 매칭)
  - [x] 데이터 버그 수정: `2025-graduation-feb25.md`는 slug/year가 2026, 사진도 `2026-graduation-feb25-*` — 수동으로 media 연결 (파일명만 2025-, 표시는 frontmatter year 기준이라 무해 / 파일 rename은 보류·사용자 판단)
  - [x] 2023-bk-thesis: 기존 모자이크가 6장 cap이라 8장 dead였음 → 14장 전부 캐러셀로 노출(정리)
- [x] `gallery.astro` — PhotoMosaic → MediaCarousel(aspect 3/2, max-w-2xl), totalPhotos = media.length 합, alt 비면 행사 제목 fallback
- [x] `public/admin/config.yml` gallery-events photoCount → media list(max 20, /public/gallery-media)
- [x] orphan 제거: `PhotoMosaic.astro`, `src/assets/gallery/`(README 포함). `GalleryPhoto.astro`는 **기존부터 미사용**(dead code)이라 보존·언급만
- [x] `public/gallery-media/README.md` 새 안내
- [x] `npm run check` 0/0/0 / `npm run build` 통과 (gallery 52 캐러셀 + 137 이미지 + 헤더 52 events/137 photos 확인)
- [x] (배포 완료) commit 7572a25(News) + fd5bf03(Gallery) → push

## 10. 히어로 인포그래픽 + 버튼 애니메이션 (2026-05-28)

- [x] All research / All publications 버튼에 `animate-breathe`(숨쉬는 펄스) 추가 — Explore research와 동일 효과
- [x] 히어로 'Explore research' 버튼 삭제 (= All research와 기능 중복) → 동적 인포그래픽으로 대체
- [x] `src/components/HeroResearchInfographic.astro` — 처음엔 사실적 1장면(격자+스캔빔+EELS)으로 만들었으나, 사용자 요청으로 **은유적 아이콘 3개**로 재설계: Microscopy(초점 좁히는 조준 링)·Spectroscopy(살아있는 스펙트럼 막대)·Machine learning(펄스+신호흐름 뉴럴넷). SVG/CSS 애니, `prefers-reduced-motion` 정지
- [x] `npm run check` 0/0/0 / `npm run build` 통과 (Explore research 제거·인포그래픽·animate-breathe 3개 확인)
- [ ] (시각 확인) 로컬 `npm run dev`로 인포그래픽 애니메이션 확인
- [ ] (배포) git push → Cloudflare Pages 라이브 반영 — 사용자 승인 후

## 11. PI CV Publications 동적 그래픽 (2026-05-31)

범위: 사용자가 제안 1·2순위(Publications 두 그룹)만 우선 선택. 나머지 5섹션 보류.

- [x] `src/components/PublicationsGraphic.astro` — variant: lattice | denoise, 순수 Canvas + rAF
- [x] denoise: 노이즈 산포 → 코랄 정렬 격자 전이(주기 루프) / lattice: HAADF 원자 격자 미세 열진동 + 초점 링
- [x] 그룹 호버(`data-pub-group`) 시 intensify — denoise 즉시 복원, lattice 선명화
- [x] `prefers-reduced-motion` 정적 1프레임 / IntersectionObserver off-screen 정지
- [x] `pi.astro` 그룹 헤더 flex 래퍼에 삽입 (microscopy→lattice, ai→denoise)
- [x] `npm run check` 0/0/0
- [x] (시각 확인) dev 서버 + CDP 호버 주입 캡처 — lattice 선명화·denoise 복원 확인
- [x] (배포) commit 55d14b3 → push origin main (2026-05-31) → Cloudflare Pages 자동 배포

## 12. PI CV 나머지 5섹션 동적 그래픽 (2026-05-31)

- [x] `src/components/SectionGlyph.astro` — variant: beam|trajectory|lattice|diffraction, 순수 SVG+CSS
  - [x] beam(Education): 내려오는 전자빔 + 학위 노드
  - [x] trajectory(Experience): 기관 오가는 경력 궤적 아치 + 이동 점
  - [x] lattice(Honors): 3×3 수상 격자 순차 점등(대각 웨이브)
  - [x] diffraction(Contact): 4D-STEM 회절 패턴 + 맥동 링
- [x] `src/components/ProbeField.astro` — 헤더 backdrop canvas, 커서 추적 전자 프로브(국소 격자 정렬)
- [x] `pi.astro` — 4섹션 h2를 flex 래퍼로 감싸 글리프 삽입 + 헤더에 ProbeField(텍스트 relative로 위에)
- [x] reduced-motion 정지 / ProbeField는 IntersectionObserver+ResizeObserver 대응
- [x] `npm run check` 0/0/0 / `npm run build` 통과
- [x] (시각 확인) CDP 캡처 — 헤더 프로브(마우스 전/후)·4글리프 렌더 + 헤더 가독성 확인
- [ ] (배포) 사용자 승인 후 push
