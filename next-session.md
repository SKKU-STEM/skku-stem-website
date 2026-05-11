# Next session — OG 이미지 자동 생성 (Satori)

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)에 페이지별 동적 OG 이미지(1200×630)를 Satori로 생성하자. Twitter / Slack / LinkedIn / Discord 공유 미리보기를 코랄/cream 디자인 토큰과 일치하는 카드로 통일.

## 현재까지 (HEAD: 51c1128, 2026-05-11)

- Lighthouse a11y 100 / best-practices 100 / SEO 100 (전 10 페이지). 이미지 최적화로 people LCP 5.08s → 2.53s 달성.
- BaseLayout이 `<meta property="og:image">`를 props로 받지만 현재 사이트는 ogImage 한 번도 지정 안 함 — 공유 미리보기는 빈 이미지 또는 Cloudflare/플랫폼 자동 캡처.
- 자산: src/assets/logo.svg (워드마크), public/logo-mark.png (로고 심볼), 디자인 토큰 cream/coral/ink + Newsreader/Inter 폰트.

## 무엇을 만드는가

페이지(또는 페이지 카테고리)별 1200×630 PNG/JPG OG 이미지. 빌드 시 사전 생성되어 dist/og/<slug>.png 으로 서빙. BaseLayout의 ogImage prop을 자동 채움.

타입:
1. **Site-wide default** — 로고 + 슬로건 ("Decoding matter, atom by atom")
2. **Page-specific** — 페이지 제목 + (옵션) 부제 + 로고 마크. 동적 텍스트 fit 처리 필요.
3. **News article** — News 제목 + 카테고리 배지 + 날짜 (가장 공유될 가능성 높음)
4. **Publication** — 저널명 + 논문 제목 (DOI 클릭 시 OG 카드)

스코프 결정 필요 — 일단 (1)+(2)부터.

## 사용자와 결정할 것 (코딩 전)

1. **렌더 엔진**:
   - (a) Satori + sharp (Vercel OG 패턴, JSX → SVG → PNG, build-time) (Recommended)
   - (b) `@vercel/og` (런타임 edge function, Cloudflare Pages Functions로도 가능 — 빌드 시간 0이지만 매 요청 마다 렌더)
   - (c) Astro Image 외 직접 SVG → PNG (가장 단순, Astro 표준 패턴 없음)
2. **디자인 템플릿**:
   - (a) 텍스트만 (제목 + 부제 + 로고 우하단)
   - (b) 텍스트 + 코랄 액센트 그래픽 (예: 우측에 stylized 원자 격자 + 제목 좌측)
   - (c) 페이지마다 다른 시각 (Research = 에너지 지형 SVG 변형, People = 노드 네트워크 등 — hero SVG 재사용)
3. **적용 범위**:
   - (a) 9 정적 페이지 (home, research, people, people-pi, publications×3, news, gallery, facilities)
   - (b) (a) + News 8 entries 각자 OG (per-entry)
   - (c) (a) + News + Publication entries (~270편 — 매우 많음)
4. **폰트**:
   - (a) Inter Variable (현재 sans, 가독성 ↑)
   - (b) Newsreader (현재 display, 학술적 느낌 ↑)
   - (c) Inter (헤더) + Newsreader (본문) 혼용

## 빠르게 점검할 것

- BaseLayout.astro의 `<meta property="og:image">` 가 어떻게 props로 받는지 (현재 옵셔널)
- Satori는 React-like JSX를 받는데 Astro 외부에서 호출. 통상 `astro:build:setup` 훅이나 별도 스크립트로 dist/og/* 생성.
- 한국어 글리프 (예: 김영민) 렌더링은 한글 폰트 fallback 필요 — Noto Sans KR variable 또는 Pretendard subset.
- Cloudflare Pages 정적 호스팅이라 .png는 그냥 dist/에 두면 OK.

## 구현 (결정 후)

### 패키지
```
npm install satori sharp @resvg/resvg-js  # satori는 SVG, resvg/sharp가 PNG 변환
# 또는 Vercel OG: npm install @vercel/og
```

### 디렉토리
- `scripts/generate-og.mjs` — 페이지 메타 → SVG → PNG 생성
- `dist/og/<slug>.png` 결과물 (sitemap에서 제외)
- `public/og/_template.svg` (옵션 — 정적 베이스 템플릿)

### Astro 통합
- `astro.config.mjs`의 `integrations`에 커스텀 integration 추가, `astro:build:done` 훅에서 generate-og.mjs 실행
- BaseLayout: ogImage 기본값을 페이지 slug로 자동 매핑 (`og/${slug}.png`)

### News per-entry (선택 시)
- `getCollection('news')` 순회 → 각 entry slug로 PNG 생성
- News page entry에 absolute URL 메타 삽입 — Astro endpoint나 정적 page route가 없으니 OG는 /news#news-<slug> URL 직접 매핑은 안 되고, 전체 News에 site-wide OG 사용 권장.

## 검증

- `npm run build` → dist/og/* 생성 확인
- `dist/og/home.png` 등을 직접 열어 시각 확인
- https://www.opengraph.xyz/ 또는 https://socialsharepreview.com/ 에 배포 후 URL 입력 → 카드 미리보기
- Twitter card validator (https://cards-dev.twitter.com/validator) 도 가능
- 한국어 글리프 깨짐 여부 (PI 페이지에 "김영민" 포함)

## 알아둘 것

- Satori는 CSS subset만 지원 — Tailwind 그대로는 못 씀. 인라인 style만.
- Cloudflare Pages는 PNG 정적 자산 캐싱 — 빌드마다 새 파일 OK.
- 절대 URL 필요 (ogImage는 https://skkustem.org/og/<slug>.png 형식). astro.config.mjs의 site 사용.
- 1200×630이 표준 (Twitter / FB / LinkedIn / Discord 모두). 정사각 1080×1080은 Mastodon에 더 잘 맞지만 표준 16:8.4 우선.

## 우선 확인할 것

- 작업 시작 전 BaseLayout.astro의 OG 메타 부분, src/assets/logo.svg, 디자인 토큰 (global.css의 @theme 색상) 훑기.
- 위 4개 결정 사항을 사용자에게 단답형으로 묻고 합의 후 코딩.
- 첫 push 전 `npm run check` + `npm run build` + 라이브 외부 OG validator로 시각 확인.
```
