# 홈 Research Highlights 자동 게시 — 설계 문서

- 날짜: 2026-07-14
- 상태: 승인됨 (구현 계획 대기)

## 배경

홈페이지(`/`)의 "Research highlights" 섹션에 Research Highlights 컬렉션 최신 2건이
자동으로 노출되기를 원한다. 현재는 CMS에서 컬렉션에 새 항목을 넣어도 홈에 반영되지
않는다.

## 근본 원인 (systematic-debugging 진단)

1. **데이터 출처 분리** — 홈 섹션은 Research Highlights 컬렉션이 아니라 별도 수기 파일
   `src/content/home/research-featured.json`(CMS의 'Home · Research highlights', 2장)에서
   카드를 가져온다. 그래서 컬렉션에 항목을 추가해도 홈에 변화가 없다.
2. **이미지 파이프라인 불일치** — CMS의 research-highlights 이미지 필드는
   `public/research`에 업로드하도록 설정돼 있으나, 코드(`research.astro`의 `getFigure`)는
   `src/assets/research/`의 파일명을 glob으로 찾는다. 결과적으로 CMS로 올린 하이라이트
   이미지는 원래부터 렌더링되지 않는다. 새 구리 항목의 이미지가
   `/recruiting/Cu-Cu bonding.jpg`(절대 public 경로)로 저장돼 `/research`에서도 안 뜨는 것이
   이 문제의 증상이다.

## 검증된 기존 패턴 (참고 기준)

히어로 슬라이드(`HeroSlideshow.astro`)가 "CMS 업로드 + Astro 최적화 이미지"의 검증된
방식을 이미 사용한다.

- CMS: `media_folder: /src/assets/hero`, `public_folder: /hero` → 값은 `/hero/<파일명>` 저장
- 코드: `import.meta.glob('/src/assets/hero/*')` 후 basename으로 해석 → astro `<Image>` 최적화

Research Highlights 이미지도 이 패턴에 맞춘다.

## 결정 사항 (사용자 승인)

- 큐레이션 방식: **수기 시스템 완전 제거**, 홈은 컬렉션 최신 2건만 자동 표시(단일 출처).
- 이미지 문제: **이번 작업에서 함께 수정**.

## 변경 사항

### 1. 이미지 해석 공용 유틸 신설 — `src/utils/researchFigure.ts`

`src/assets/research/*.{jpg,jpeg,png,webp}`를 eager glob하고 basename으로 최적화 이미지를
반환하는 `getResearchFigure(path?)`. 맨 파일명(`2026-foo.png`)이든 접두 경로가 붙은
형태(`/research/2026-foo.png`)든 모두 해석한다. 히어로의 `resolve`와 동일한 구조.

### 2. `research.astro` — 로컬 `getFigure` 제거, 공용 유틸로 교체

로컬 `figureModules` / `getFigure` 정의를 삭제하고 `getResearchFigure`를 import.
호출부 `getFigure(entry.image)` → `getResearchFigure(entry.image)`. 그 외 로직 불변.

### 3. `ResearchHighlightCard.astro` — 미디어 렌더링 전환

`MediaCarousel`(public URL 문자열) 대신 `FigureSlot`(astro:assets `<Image>` 최적화)로
이미지를 렌더링. props를 `figure: ImageMetadata | null`로 교체(기존 `media` 제거). 카드
레이아웃·호버 효과 등 나머지 스타일 유지. `MediaCarousel`은 News가 계속 사용하므로 유지.

> 이유: 컬렉션 이미지는 `src/assets/research/`에 있어 astro:assets 최적화 경로로만
> 렌더링된다. public URL 문자열을 쓰는 `MediaCarousel`로는 404가 난다.

### 4. `index.astro` — 컬렉션 기반 자동화

`research-featured.json` import·매핑 제거. 대신:

```
getCollection('research-highlights')
  → date 내림차순 정렬
  → 상위 2건
  → 카드 매핑: eyebrow = `${journal} · ${year}`, title, summary,
              link = doi, figure = getResearchFigure(image)
```

### 5. 수기 큐레이션 시스템 완전 제거

- `src/content/home/research-featured.json` 삭제
- `public/research-featured/*` 이미지 2장 삭제
- `public/admin/config.yml`의 `research-featured` 파일 컬렉션 정의 삭제

### 6. 구리 항목 이미지 정상화

- `public/recruiting/Cu-Cu bonding.jpg`
  → `src/assets/research/2026-untangling-copper-electromigration.jpg`(공백 제거)로 이동
- 해당 항목 `.md`의 `image:` 필드를 새 파일명으로 수정(기존 은박막·ML 항목과 동일하게
  맨 파일명 형식)
- 원본 `public/recruiting/Cu-Cu bonding.jpg` 삭제

### 7. CMS 설정 정합화 — `public/admin/config.yml` (research-highlights 이미지 필드)

- `media_folder`: `/public/research` → `/src/assets/research`
- `public_folder`: `/research` 유지
- hint 문구를 히어로 패턴에 맞게 갱신

앞으로 CMS로 올리는 하이라이트 이미지가 `src/assets/research/`에 저장되고 `/research/<파일명>`
으로 기록되어 `getResearchFigure`가 최적화 이미지로 해석한다.

## 검증 기준

- `npm run build` 성공(astro build + pagefind).
- 홈에 최신 2건(구리 · 은박막)이 이미지와 함께 노출.
- `/research`의 구리 항목 그림이 정상 표시.
- 로컬 빌드 산출물에서 두 페이지 모두 구리 이미지가 `<img>`로 렌더링됨을 확인.

## 작업 전 전제

- 로컬이 `origin/main`보다 뒤처져 있고(`news.astro` 수정 중), 구리 항목 `.md`·이미지 파일은
  `origin/main`에만 존재한다. 작업 전 `origin/main` 동기화 필요. `news.astro` 수정분은 보존
  (upstream 변경 없음 확인됨).

## 범위 밖 (건드리지 않음)

- `research-themes` 컬렉션 및 그 이미지 필드.
- `MediaCarousel` 컴포넌트 내부 로직(News가 계속 사용).
- 홈 카드 summary 길이 관련 `line-clamp`(기본은 `/research`와 동일한 전문 노출). 필요 시
  후속 조정.
