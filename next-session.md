# Next session — Lighthouse / a11y 감사 + 수정

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem) 전 페이지 Lighthouse · a11y 감사 후 발견된 이슈를 수정하자.

## 현재까지 (HEAD: 76731f3, 2026-05-11)

- Stage 5.2 CMS / Pagefind 검색 / Research Themes (6 thrusts + 모달 + auto-classification) / 404 페이지 / News RSS feed 모두 라이브 반영 완료.
- 남은 polish: **Lighthouse · a11y 감사** (이번), OG 자동 생성, i18n, PI 콘텐츠 TODO.

## 무엇을 만드는가

전 페이지(9개)의 Performance / Accessibility / Best Practices / SEO 점수 측정 + 의미 있는 이슈만 골라 수정. "100점 강박"은 피하고, 실제 사용자 영향 있는 항목 (대비, 키보드, 스크린리더, LCP, CLS, 이미지 최적화) 우선.

대상 URL (라이브):
- https://skkustem.org/
- https://skkustem.org/research/
- https://skkustem.org/people/
- https://skkustem.org/people/pi/
- https://skkustem.org/publications/
- https://skkustem.org/publications/before-skku/
- https://skkustem.org/publications/non-sci-patents/
- https://skkustem.org/news/
- https://skkustem.org/gallery/
- https://skkustem.org/facilities/
- https://skkustem.org/404 (간접 — 잘못된 URL로 접근)

## 사용자와 결정할 것 (코딩 전)

1. **측정 도구**:
   - (a) Chrome DevTools Lighthouse (수동, 사용자가 한 페이지씩 실행 후 결과 공유)
   - (b) `lighthouse` CLI (`npm install -g lighthouse` + 자동 스크립트로 9개 페이지 일괄)
   - (c) PageSpeed Insights API (네트워크 의존, 결과는 더 객관적)
   - (d) `@lhci/cli` (Lighthouse CI, 임계값 정의 + 회귀 방지에 가장 좋음 — 단 설정 복잡)
2. **수정 범위**:
   - (a) Critical만 (a11y red, perf <50)
   - (b) Critical + Major (a11y red/orange, perf <80)
   - (c) 모든 이슈 (편집증적 마무리)
3. **Performance budget**:
   - (a) 그냥 측정만 — 베이스라인 수립
   - (b) LCP < 2.5s, CLS < 0.1 등 web-vitals 임계값 잡고 그 이하 수정
4. **a11y 우선순위**:
   - (a) 이미지 alt + 헤딩 위계 + 폼 라벨 (정적)
   - (b) 위 + 키보드 네비게이션 + focus visibility (인터랙티브)
   - (c) 위 + 스크린리더 검증 (가장 깊음, 시간 많이 소요)

## 빠르게 점검할 의심 영역 (수정 전 self-check)

- **이미지 alt**: src/components/PortraitBox, NewsPhoto, GalleryPhoto, FacilityPhoto, FigureSlot — placeholder인 경우 alt 누락 가능성
- **색 대비**: cream/coral 토큰이 WCAG AA 통과하는지 (특히 `text-coral on bg-cream`, `text-ink/55`, `text-ink/65`)
- **헤딩 위계**: 일부 페이지에서 h2 → h4 점프하는지 (h3 누락)
- **포커스 표시**: button과 a 모두 `:focus-visible` 스타일 적용 확인
- **<dialog> 모달의 a11y**: SearchDialog, theme modal에 적절한 aria-label 존재 확인
- **Pagefind UI 안의 a11y**: 외부 라이브러리라 우리 통제 밖 — 이슈 보이면 PR 대신 wrapping 처리
- **LCP**: 각 페이지의 LCP 후보(hero figure / largest text block)가 lazy load 안 되어있는지
- **이미지 크기**: hero / gallery / news photos가 적절한 width, format(webp/avif), srcset인지
- **CLS**: header sticky · gallery mosaic · 모달 mount 시점에 layout shift 발생 안 하는지

## 구현 (결정 후)

### 도구 선택에 따라
- (a) 사용자 측정: Chrome → DevTools → Lighthouse → 9개 페이지 결과를 Claude에게 공유 → 이슈 우선순위 정리
- (b) CLI: `lighthouse https://skkustem.org/ --output=json --output-path=./lighthouse/<page>.json --chrome-flags="--headless"` 9번 → Claude가 JSON 파싱
- (d) LHCI: `.lighthouserc.json` 작성 + `npx lhci autorun --collect.url=...` (CI까지 들고 가면 GitHub Action도 추가)

### 수정 패턴
- a11y 이슈: 컴포넌트 단위로 alt/aria/role 보강
- 색 대비 이슈: 디자인 토큰 (`text-ink/55`)을 더 진한 alias로 교체 (전역 영향 큼 — 신중)
- 이미지 최적화: Astro `<Image>` srcset/format 옵션 추가
- LCP 개선: hero 이미지 priority hint (`fetchpriority="high"` + `loading="eager"`)

## 검증

- 수정 후 동일 페이지 재측정 → 점수 변화 기록
- `npm run check` + `npm run build` + `npm run preview`로 회귀 없음 확인
- 핵심 인터랙션 (검색 모달 / theme 모달 / mobile 햄버거 / gallery lightbox)이 키보드만으로 사용 가능한지 직접 시연

## 알아둘 것

- 외부 폰트(Fontsource self-hosted)는 이미 dist/ 안에 번들되어 있어 Performance 영향 적음.
- Pagefind UI는 첫 인터랙션 때 lazy-load라 initial 점수에 영향 없음.
- Cloudflare Web Analytics beacon은 prod에서만 로드 — Lighthouse는 비활성 토큰이면 영향 안 받음.
- 이미지가 placeholder인 페이지는 LCP가 텍스트로 잡힐 가능성 — 진짜 사진 업로드 후 다시 측정해야 정확.

## 우선 확인할 것

- 작업 시작 전 PRD.md §3 (디자인 시스템 색 대비 가정), checklist.md Stage 4 "Lighthouse / a11y 점검" 라인 주변, 컴포넌트 alt/aria 규칙(특히 PortraitBox, FigureSlot, GalleryPhoto)을 훑기.
- 위 4개 결정 사항을 사용자에게 단답형으로 묻고 합의된 후 측정.
- 첫 push 전 `npm run check` + `npm run build` + `npm run preview`로 수정 후 회귀 없음 확인.
```
