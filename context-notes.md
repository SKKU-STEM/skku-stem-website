# SKKU-STEM Website — Context Notes

다음 세션이 처음부터 다시 추론하지 않도록, 이번 단계에서 내린 결정과 그 이유를 기록한다.

## 0. Scope

- 목적: SKKU 에너지과학과 김영민 교수 연구실(SKKU-STEM Lab) 공식 웹사이트.
- 본 단계(Stage 1) 산출물은 "프로젝트 초기화 + 디자인 토큰"까지. 페이지 콘텐츠는 다음 단계에서 채운다.

## 1. Project layout

- 작업 디렉토리(`Projects/skkustem`)가 비어 있어 **in-place로 초기화**했다. 별도의 `skku-stem-website/` 하위 폴더를 만들지 않았다. `package.json`의 `name` 필드만 `skku-stem-website`로 설정.
- 향후 모노레포 또는 별도 backend가 필요해지면 폴더 이동 비용은 낮음(아직 내용물이 거의 없음).

## 2. Astro 5 + Tailwind 4 통합 방식

- **Tailwind 4는 `@tailwindcss/vite` 플러그인**을 통해 통합한다. Astro 측 통합 패키지인 `@astrojs/tailwind`는 Tailwind 3 전용이므로 사용하지 않는다.
- 따라서 `npx astro add tailwind`도 사용하지 않았고, 수동으로 다음을 셋업했다.
  - `astro.config.mjs`의 `vite.plugins`에 `tailwindcss()` 등록.
  - `src/styles/global.css` 첫 줄에 `@import "tailwindcss";`.
  - 디자인 토큰은 동일 파일의 `@theme { ... }` 블록에 CSS 변수로 선언 (Tailwind 4 CSS-first config).

## 3. 디자인 토큰

요청 사양:

| Token  | Value     | Tailwind utility 예시 |
|--------|-----------|------------------------|
| cream  | `#FAF9F5` | `bg-cream`, `text-cream`  |
| ink    | `#141413` | `bg-ink`, `text-ink`      |
| coral  | `#CC785C` | `bg-coral`, `text-coral`  |

- `@theme` 안에 `--color-cream`, `--color-ink`, `--color-coral`로 등록 → Tailwind 4가 자동으로 `bg-*`, `text-*`, `border-*`, `ring-*` 유틸리티를 생성한다.
- 단일 톤만으로는 본문/카드/구분선 등 UI 계층을 표현하기 어려워, **cream/ink/coral 각각의 파생 톤 스케일**(예: `cream-200`, `ink-700`, `coral-600`)을 함께 정의했다. 사양 외 색상은 추가하지 않았다(요구된 3색의 음영 변주만).
- `--color-bg`, `--color-fg`, `--color-accent`, `--color-muted`, `--color-border` 시멘틱 alias도 함께 둠 — 다크 모드 도입 시 alias만 재바인딩하면 된다.

## 4. 폰트 self-host 전략

- Google Fonts CDN을 직접 임베드하지 않는다(개인정보/성능). 대신 **Fontsource Variable** 패키지 사용.
  - `@fontsource-variable/inter` → `font-sans`
  - `@fontsource-variable/newsreader` (regular + italic) → `font-serif` / `font-display`
  - `@fontsource-variable/jetbrains-mono` → `font-mono`
- `global.css`에서 각 패키지의 `index.css`를 `@import`해 빌드 시 폰트 파일이 `dist/`에 같이 번들되도록 했다.
- `--font-display`는 `--font-serif`의 alias. 의미상 헤드라인용임을 컴포넌트 코드에서 분명히 하려는 목적.

## 5. Pagefind 통합

- Pagefind는 빌드 후 정적 인덱싱 도구. `build` 스크립트를 `astro build && pagefind --site dist`로 체이닝.
- `dist/pagefind/`가 결과물이며, 배포 시 그대로 서빙된다.
- 검색 UI 컴포넌트(`/pagefind/pagefind-ui.js` 클라이언트 로드)는 다음 단계 작업.

## 6. Content Collections

- `src/content.config.ts`를 빈 객체로 두었다. Publications / News / People 컬렉션 스키마는 다음 단계에서 정의(요구되는 필드가 콘텐츠 작성 시점에야 명확해지므로 미리 짜지 않음 — Rule 2 Simplicity First).

## 7. 경로 alias

`tsconfig.json`에 다음 alias 정의(`baseUrl: "."`):

- `@/*` → `src/*`
- `@components/*`, `@layouts/*`, `@styles/*`, `@content/*`

`src/layouts/BaseLayout.astro`와 `src/pages/index.astro`에서 이미 사용 중.

## 8. 검증 계획

CLAUDE.md Rule 8에 따라 다음을 확인한다.

1. `npm install` — peer 의존성 충돌 없음 확인.
2. `npm run check` (= `astro check`) — 타입 + 컴포넌트 props 정합성.
3. (선택) `npm run build` — Tailwind/Pagefind/sharp 모두 작동하는지 end-to-end 확인. 단, Pagefind는 `dist/`에 인덱싱할 콘텐츠가 거의 없는 상태라 빈 인덱스 경고가 날 수 있음 — 무해.

## 9. 미결정 / 다음 세션이 결정해야 할 사항

- **i18n**: 학과 웹사이트는 보통 KO/EN 병행. Astro 5의 i18n routing 사용할지, 단일 영어 + 일부 한국어 페이지로 갈지 미정.
- **다크 모드**: cream/ink 반전이 자연스럽지만, 연구실 사진/그림이 라이트 톤 가정으로 찍힐 가능성 있어 보류.
- **배포 타겟**: Vercel/Netlify/GitHub Pages/SKKU 내부 호스팅 중 미정. 현재 `astro.config.mjs`의 `site`는 placeholder(`https://skku-stem.example.com`).
- **Publications 데이터 소스**: BibTeX import 방식인지 수동 MDX인지 미정.

## 10. 디렉토리 트리(현재)

```
skkustem/
├── .gitignore
├── astro.config.mjs
├── checklist.md
├── context-notes.md
├── package.json
├── tsconfig.json
└── src/
    ├── content.config.ts
    ├── env.d.ts
    ├── layouts/
    │   └── BaseLayout.astro
    ├── pages/
    │   └── index.astro
    └── styles/
        └── global.css
```
