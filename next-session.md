# Next session — Home CLS 0.224 수정 (폰트 preload + size-adjust)

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)에서 Home 페이지 CLS 0.224 (web-vitals "needs improvement" 경계)를 정리하자. Inter Variable / Newsreader Variable 폰트 swap 시 본문 paragraph가 reflow되는 게 원인.

## 현재까지 (HEAD: 872b8a3, 2026-05-11)

- Lighthouse a11y / best-practices / SEO 100 (전 페이지). 이미지 최적화로 perf 대폭 상승. OG 카드 자동 생성·라이브 적용.
- 라이브 마지막 측정 (mobile, simulated 4G):
  - **home CLS 0.224** ← 이번 세션 타겟
  - home LCP 2308ms (양호, eager hero 적용)
  - 다른 페이지 CLS는 모두 ≤ 0.05 (gallery/non-sci-patents 등은 0.000~0.048)
- 폰트는 Fontsource self-hosted woff2 변형 — global.css에서 `@import "@fontsource-variable/inter/index.css"` 등으로 로드.

## 무엇을 만드는가

Home 페이지 (특히 본문 paragraph "A laboratory at the intersection of...")의 폰트 swap reflow를 제거. 결과: CLS < 0.1 목표.

## 사용자와 결정할 것 (코딩 전)

1. **수정 접근**:
   - (a) 핵심 폰트 preload + size-adjust descriptors (fallback 폰트 metric을 실제 폰트와 일치) (Recommended) — 표준 web 패턴
   - (b) `font-display: optional` (시스템 폰트로만 첫 렌더, 폰트 다운로드 후 변경 안 함) — CLS 0이지만 첫 방문은 시스템 폰트로 노출
   - (c) Inline critical fonts as base64 in CSS (가장 즉시이지만 HTML/CSS 용량 ↑)
2. **preload 폰트 범위**:
   - (a) Inter (sans, 본문) 만 (Recommended) — 본문 reflow가 큰 원인
   - (b) Inter + Newsreader (display, 제목)
   - (c) 셋 다 (+ JetBrains Mono)
3. **fallback metric override**:
   - (a) `Adjusted Inter Fallback` / `Adjusted Newsreader Fallback` @font-face 정의 + size-adjust/ascent-override 등 metric override (사용자 측에서 npm `fontaine` 또는 수동 계산 필요)
   - (b) 무시 — preload만으로 충분하면 패스

## 빠르게 점검할 것

- Home `<p class="mt-8 max-w-xl text-base md:text-lg text-ink/80 leading-relaxed">` (본문 paragraph)이 LCP 후보 일 가능성 — 폰트 swap이 layout 영향
- `src/styles/global.css` 의 `@import "@fontsource-variable/inter/index.css"` 등 (font-display 기본값은 swap)
- BaseLayout `<head>` 에 폰트 `<link rel="preload">` 가 없는 상태 (Astro가 자동 inline 안 함)
- Lighthouse `font-display` 감사 통과 여부 (현재 통과)

## 구현 (결정 후)

### 옵션 (a) — preload + size-adjust 패턴
1. **폰트 preload**: BaseLayout `<head>`에 핵심 weight (Inter 400 latin) `<link rel="preload" as="font" type="font/woff2" crossorigin>` 추가. 파일 경로는 Vite가 dist/_astro/* 에 hash 처리하니 동적 import 또는 정적 경로 명시.
2. **fallback metric override**: `@font-face Inter Fallback` 정의 + `size-adjust: <value>` + `ascent-override` 등으로 시스템 폰트 metric을 Inter 와 거의 동일하게 만든다. 사용자 측 폰트 — Inter 의 metric은 이미 공개됨. 또는 `npm install fontaine` (auto-generation).
3. **CSS chain**: `font-family: "Inter Variable", "Inter Fallback", system-ui, ...`

### 옵션 (b) — font-display: optional
1. global.css 에서 `@import` 후 `@font-face { ... font-display: optional; }` override. 모든 변형에 적용.
2. 첫 방문은 시스템 폰트, 이후 캐시되면 Inter Variable 노출. CLS 0 보장.

## 검증

- `npm run build && npm run preview`
- `node scripts/lighthouse-audit.mjs --base=http://localhost:4321` 측정. CLS 0.224 → < 0.1 목표.
- 라이브 배포 후 동일 스크립트로 재측정.
- 시각 회귀 — Home, Research, People, Publications 가 의도한 폰트로 보이는지 직접 확인.
- font-display: optional 채택 시 강제 캐시 클리어로 첫 방문 시 시스템 폰트 노출 확인 (의도 동작인지 PI에게 보여줌).

## 알아둘 것

- Variable font 는 단일 파일(.woff2 ~50KB)이라 preload 비용 작음.
- size-adjust 는 Safari 14+, Chrome 92+, Firefox 89+ 모두 지원 (모던).
- Cloudflare Edge가 폰트 자산을 캐싱하므로 재방문 CLS 는 거의 0 (첫 방문이 문제).
- Pagefind / Sveltia CMS / OG 생성 모두 폰트 변경에 영향 없음.
- 다른 페이지 (people, research) 의 CLS도 자연스럽게 함께 낮아질 수 있음.

## 우선 확인할 것

- 작업 시작 전 src/styles/global.css 의 @import 부분, BaseLayout `<head>`, 라이브 lighthouse-reports/home.json 의 cls-culprits-insight 자세한 내용 확인.
- 위 3개 결정 사항을 사용자에게 단답형으로 묻고 합의 후 구현.
- 첫 push 전 lighthouse-audit.mjs 로 home CLS delta 확실히 측정 + 다른 페이지 회귀 없음 확인.
```
