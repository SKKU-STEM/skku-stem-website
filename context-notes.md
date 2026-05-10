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

## 11. CMS 마이그레이션 (Stage 5, 2026-05-10 시작)

PRD §10에 따라 Decap CMS 도입 준비. 오늘 세션은 §10.5의 **steps 2~4** (Astro Content Collections로 데이터 이전 + 페이지 재연결)까지. OAuth App / Cloudflare Workers / `/admin` UI는 다음 세션.

### 11.1 단위(granularity) 결정

사용자 확정 (2026-05-10):

- **Publications**: JSON 파일 컬렉션 (entry당 1 파일이 아닌, 카테고리당 1 JSON 파일에 array). 이유: 260건을 .md로 분할하면 git diff가 노이즈가 되고 Decap의 array 편집 위젯으로 충분.
- **나머지**: per-entry Markdown (folder collection). News/Research highlights/Facilities는 본문(body) 필드가 있고, Members/Gallery는 frontmatter-only이지만 일관성을 위해 .md.

이 결정은 향후 Decap config의 `files:` vs `folder:` 컬렉션 매핑을 직결한다.

### 11.2 ID 전략

Astro 5의 `file()` loader는 JSON 배열의 각 엔트리에 `id` 필드를 요구한다. 매핑:

| 컬렉션 | id |
|---|---|
| publications/skku.json | `<number>` (그대로 유지, 231~) |
| publications/before-skku.json | `<number>` |
| publications/non-sci-patents.json | `<number>` |
| publications/pi-selected.json | `<year>-<slugified-title>` |
| news | `<slug>` (기존 `slug` 필드 그대로 파일명) |
| research-highlights | `<year>-<slug-from-title>` |
| facilities | `<slug>` |
| gallery-events | `<slug>` |
| members | `<photoPath의 베이스명>` 예: MHJ, EBP. 사진 없으면 nameEn 이니셜에서 생성 |

### 11.3 Members 분류 필드

기존 people/index.astro는 `postdocs`/`phdCandidates`/`undergrads`/`alumni` 4개 배열로 분리. Markdown으로 옮기면서 frontmatter에 `section: 'postdoc' | 'phd' | 'undergrad' | 'alumni'`를 추가. `position`, `program`, `yearRange`, `email`, `orcid`, `kri?`, `coAdvisor?`, `photoPath?`, `portrait?`는 그대로. Alumni는 `role`, `currentAffiliation?`도 보존.

### 11.4 마이그레이션 스크립트 전략

Node가 .ts를 native 실행하지 못하므로 **`tsx`를 devDep로 추가**해서 `npx tsx scripts/migrate-to-content.ts`로 실행. 한 번 실행하고 더 이상 필요 없는 도구지만 dep 추가 비용은 적음.

대안(검토 후 폐기): TS 파일을 텍스트로 읽고 regex/eval 파싱 — 데이터에 백틱/중괄호가 섞여 있어 brace-balancing이 복잡해지고 디버깅 비용이 더 큼.

스크립트는:
1. `src/data/*.ts` 9개 모듈을 dynamic import
2. People 데이터는 `src/pages/people/index.astro`의 frontmatter 영역에서 인라인 배열 4개를 추출하기 어려우므로, 스크립트 내부에 직접 동일 데이터 배열 4개를 인라인으로 두고(소스 진실은 .astro 파일이지만 일회성 마이그레이션이므로 OK), 마이그레이션 후엔 .astro에서 inline 데이터를 제거.
3. publications: JSON.stringify(array, null, 2)로 출력
4. news/research-highlights/facilities: `---\n<yaml>\n---\n\n<body>\n` Markdown 출력
5. members/gallery-events: frontmatter-only Markdown 출력

### 11.5 `field()` vs `glob()` 로더

Astro 5 content layer의 두 loader 사용:
- `file('src/content/publications/skku.json')` — JSON 배열을 entry 컬렉션으로
- `glob({ pattern: '**/*.md', base: './src/content/news' })` — 폴더의 .md 파일들을 entry로

### 11.6 페이지 재연결 패턴

각 페이지의 import 변경:

```ts
// before
import { skkuPublications } from '@/data/publications-skku';

// after
import { getCollection } from 'astro:content';
const entries = await getCollection('publications-skku');
const skkuPublications = entries.map(e => e.data);
```

화학식 렌더링(`formatChemistry`)과 정렬은 그대로 페이지 내부 로직 유지. 데이터 형태는 동일하므로 이후 변환 코드는 거의 변경 없음.

### 11.7 다음 세션이 결정할 것

- Decap config의 `files:` 컬렉션 한 개 안에 4개 publications JSON을 묶을지, `folder:` collection으로 폼-기반 array editor를 노출할지.
- Members의 `photoPath`(public/) vs `portrait`(src/assets/) 이중 경로를 통합할지 — CMS UI에서 업로드하면 `public/uploads/`로 떨어지므로 `photoPath`만 남기는 게 단순함.
- pi-publications와 publications/skku 사이 중복 — selected pubs는 보통 main 컬렉션에서 PI가 toggle하는 식이 자연스러움. 별도 컬렉션 유지 vs `featured: true` 필드로 통합 검토.

## 12. CMS UI (Stage 5.2, 2026-05-10)

PRD §10.5의 steps 5–8. 사용자 결정 4건:

- **CMS**: Sveltia CMS (Decap config.yml 호환, 더 활발히 유지보수). `public/admin/index.html`이 unpkg에서 `@sveltia/cms` 번들 로드. 문제 시 버전 고정.
- **Workflow**: `publish_mode: simple` — main에 즉시 commit. PI 단독 운영이라 PR 검토 단계 불필요.
- **pi-publications**: 별도 컬렉션 유지 (Pre-SKKU 항목이 publications-skku에 없어 통합하면 데이터 이동 필요). 페이지 코드 무변경.
- **portrait 필드**: 스키마에서 제거. `photoPath` 단일화. PortraitBox에서 Astro Image fallback 분기와 people/index.astro의 `portraitModules`/`getPortrait`도 함께 제거.

### 12.1 OAuth 호스팅: Cloudflare Pages Functions로 일원화

PRD 원문은 "Cloudflare Workers OAuth 프록시"였으나 같은 Pages 프로젝트의 `functions/oauth/auth.js` + `callback.js`로 대체. 같은 도메인(`skkustem.org/oauth/*`)이라 CORS 무관, `wrangler`/별도 Worker 도메인 불필요. 런타임은 동일한 Cloudflare Workers.

핸드셰이크 프로토콜 (Decap/Sveltia 공통):
1. 팝업 로드 → opener에 `'authorizing:github'` 송신
2. opener (CMS) → 팝업에 같은 메시지로 ack
3. 팝업 → opener에 `'authorization:github:success:{"token":"...","provider":"github"}'`

`callback.js`는 위 3단계를 모두 구현. opener의 ack가 늦더라도 `message` 리스너가 잡는다.

### 12.2 Publications JSON 래퍼 변환

Sveltia/Decap의 file collection은 객체 루트를 요구하므로, `[ {...}, {...} ]` 형태였던 4개 publications JSON을 `{ "items": [ {...}, {...} ] }`로 감쌌다. (`scripts/wrap-publications-json.mjs` 일회성 실행, 이후 삭제 가능하지만 향후 reset에 쓸 수 있어 보관.)

각 entry의 `id` 필드는 그대로 유지. Astro file() loader에 `parser: (text) => JSON.parse(text).items`를 붙여 array를 돌려준다.

CMS 폼에서 `id`는 일반 string 위젯으로 노출. 새 entry 시 사용자가 직접 입력 (skku/before-skku/non-sci-patents는 `String(number)`, pi-selected는 `<category>-<order>-<slug>` 패턴).

### 12.3 News `body` → `summary` 리네임

Sveltia/Decap의 markdown 컬렉션에서 `body` 필드명은 markdown body 영역으로 예약됨. 우리 news 스키마의 `body`는 frontmatter-only 단락이라 충돌 위험. 8개 .md 파일 + content.config.ts + news.astro를 일괄 `summary`로 리네임.

### 12.4 미디어 폴더 전략

- 글로벌: `media_folder: public/uploads`, `public_folder: /uploads`
- members.photoPath: 위젯 단위 override (`media_folder: /public/members`, `public_folder: /members`) — 기존 `/members/<INIT>.jpg` 경로 유지
- research-highlights.image: 위젯 단위 override (`media_folder: /public/research`, `public_folder: /research`) — 현재 어떤 entry도 image 미설정이므로 향후 업로드 대비

### 12.5 사용자 인계 항목

푸시 전 사용자가 직접 해야 할 것:

1. **GitHub OAuth App 생성** (`https://github.com/settings/applications/new`)
   - Application name: `SKKU-STEM CMS` (자유)
   - Homepage URL: `https://skkustem.org`
   - Authorization callback URL: `https://skkustem.org/oauth/callback`
   - 결과 `Client ID` + `Generate a new client secret`로 secret 받기

2. **Cloudflare Pages env 변수 등록**
   - 대시보드 > skku-stem-website > Settings > Environment variables (Production)
   - `GITHUB_CLIENT_ID` (Plaintext)
   - `GITHUB_CLIENT_SECRET` (Encrypt 옵션 ON)

3. **Push** — main에 commit/push → Pages 자동 빌드 → 1~3분 후 `https://skkustem.org/admin` 접속

4. **첫 인증 + 편집 테스트** — GitHub Authorize → CMS 진입 → news 한 entry 수정 후 저장 → 1~3분 내 라이브 반영 확인.

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
