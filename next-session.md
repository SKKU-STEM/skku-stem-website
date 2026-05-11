# Next session — 이미지 최적화 (jpg/png → webp/avif + srcset)

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)의 LCP·CLS 잔여 이슈를 이미지 최적화로 해결하자.

## 현재까지 (HEAD: e18b631, 2026-05-11)

- Lighthouse a11y 통과: 전 10 페이지 a11y / best-practices / SEO 모두 100. 4종 위반(color-contrast, label-name-mismatch, link-in-text-block, target-size) 해소.
- 남은 perf 이슈 (라이브 측정 기준):
  - **people LCP 5079ms** — `/members/YMK.jpg` (PI 초상)이 LCP 후보. eager + fetchpriority="high" 적용했지만 원본이 무거워 여전히 5초대.
  - **home CLS 0.223** — 본문 paragraph가 폰트 swap 시 reflow.
  - **home LCP 2304ms** — 그룹 사진 `/photos/2026group-spring.jpg`도 동일.
  - **facilities LCP 2443ms** — 첫 article의 JEM-ARM300F webp는 이미 Astro Image 처리 중이라 상대적으로 양호.

## 무엇을 만드는가

`public/` 아래 미가공 jpg/png를 Astro `<Image>` 컴포넌트로 마이그레이션해 build 시 webp/avif 변환 + width 변형 + width/height 자동 부여로 LCP·CLS 개선.

대상 자산 (대략):
- `public/members/*.jpg` (~30 장, 멤버 초상화 — PortraitBox 컴포넌트가 사용)
- `public/photos/2026group-spring.jpg` (Home hero)
- `public/gallery/*.jpg` 또는 src/assets/gallery/* (GalleryPhoto 사용)
- `public/research/*` (research highlight figure — 아직 placeholder가 다수)

이미 `<Image>` 사용 중인 곳 (제외 또는 수정 불필요):
- `src/assets/facilities/*` (FacilityPhoto가 import.meta.glob + Image 사용)
- `src/assets/research/*` (FigureSlot 사용)

## 사용자와 결정할 것 (코딩 전)

1. **정적 자산 위치 전환 범위**:
   - (a) `public/members/`, `public/photos/` → `src/assets/members/`, `src/assets/photos/`로 이동 + Astro `<Image>`로 통일 (Recommended) — 빌드 시 자동 webp/avif·responsive variant
   - (b) public에 그대로 두고 한 번만 webp/avif 수동 변환 (sharp CLI) + `<picture>` 폴백 직접 작성 — 제어력 ↑, 자동화 ↓
2. **포맷**:
   - (a) webp만 (모든 모던 브라우저 지원, 가장 단순)
   - (b) avif + webp 폴백 (avif가 더 작지만 빌드 시간 늘고 일부 구형 환경 미지원)
3. **변형 너비 (srcset)**:
   - (a) 240w / 480w / 800w / 1200w (모든 자산 공통, 평균값)
   - (b) 컴포넌트별 최적화 (포트레이트 320w/480w, hero 800w/1200w/1600w 등)
4. **마이그레이션 절차**:
   - (a) 자동 — 노드 스크립트로 public → src/assets 이동 + 컴포넌트 import 수정
   - (b) 수동 — 컴포넌트별 한 번씩 손봄 (검증 쉬움, 시간 ↑)
5. **CMS 영향**:
   - 멤버 사진은 Sveltia CMS의 image widget으로 업로드되는데 현재 `media_folder: /public/members`. src/assets로 옮기면 CMS도 같이 갱신해야 함. 결정 필요 (그대로 public 두고 별도 처리 vs CMS 설정도 갱신).

## 빠르게 점검할 것

- `src/components/PortraitBox.astro` 의 현재 구현 (img 태그? Image? optional 분기?)
- Astro `image.service`는 sharp 사용 중 (astro.config.mjs 기 확인) — 빌드 시 자동 변환 가능
- public/members/*.jpg 평균 파일 크기 (대략 100~500KB? 측정 후 효과 예상)
- Astro Image의 `densities` / `widths` / `format` 옵션 활용

## 구현 (결정 후)

- `src/assets/members/` 등 이동 → import.meta.glob으로 일괄 로드 (FacilityPhoto 패턴 참고)
- 컴포넌트가 빌드 시 변형 자동 생성 → dist/_astro/* 에 webp/avif 생성 확인
- LCP 후보 (Home hero, People PI portrait, Facilities first photo)는 priority + width/height 명시
- CMS 영향 있을 시 public/admin/config.yml의 media_folder 동기화

## 검증

- `npm run build` 후 `dist/` 에 변환된 webp/avif 생성 확인
- `npm run preview` + Lighthouse CLI (`node scripts/lighthouse-audit.mjs --base=http://localhost:4321`) 로 LCP·CLS·perf 수치 변화 측정
- 라이브 배포 후 동일 스크립트로 재측정 (people LCP 5s → ~2s, home LCP 2.3s → 1.5s 목표)
- CMS에서 사진 업로드 → 빌드 → 라이브 round-trip 동작 확인 (옮겼다면)

## 알아둘 것

- `<Image>` 가 빌드 시 `mix-blend-darken` CSS와 호환되는지 (현재 home hero / facility 사진이 사용 중) 확인.
- 이미지 마이그레이션은 한 번만 하면 되는 일회성 작업이지만 잘못하면 모든 멤버 사진 깨짐 — 컴포넌트별 단계적 접근 권장.
- Pagefind 인덱스는 이미지 변경에 영향 없음 (이미지 alt 텍스트만 인덱싱).
- checklist의 Stage 4 polish 항목 추가 권장 ("이미지 최적화 — webp/avif").

## 우선 확인할 것

- 작업 시작 전 PRD.md §3 (디자인 시스템), src/components/PortraitBox.astro / NewsPhoto / GalleryPhoto / FacilityPhoto 현재 구현 비교, public/members /photos 파일 크기 측정.
- 위 5개 결정 사항을 사용자에게 단답형으로 묻고 합의 후 코딩.
- 첫 push 전 `npm run check` + `npm run build` + `npm run preview` + lighthouse-audit.mjs 재측정으로 회귀 없음 확인.
```
