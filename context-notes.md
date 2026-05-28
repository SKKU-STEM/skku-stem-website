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
- 검색 UI: `src/components/SearchDialog.astro` — Header에 돋보기 아이콘 + `<dialog>` 모달. PagefindUI(`/pagefind/pagefind-ui.js` + `pagefind-ui.css`)를 첫 인터랙션 때 lazy-load 하므로 initial bundle에 포함되지 않음. 단축키: `Cmd/Ctrl+K`(어디서든) 또는 `/`(input/textarea/contenteditable focus 아닐 때만).
- 테마는 PagefindUI가 노출하는 `--pagefind-ui-*` CSS 변수만 override(coral primary, cream background, Inter font). resetStyles 끄고 base CSS는 그대로 사용.
- 인덱싱 범위는 전체 `<body>`(현 사이트 규모 10 페이지 / 4573 단어로 작아 노이즈 영향 미미). 향후 Header/Footer 노출이 신경 쓰이면 BaseLayout `<main>`에 `data-pagefind-body` 추가.
- dev 모드에선 `dist/pagefind/`가 없어 검색 동작 안 됨. 검증은 `npm run build && npm run preview`로.

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

## Hero 슬라이드쇼 (CMS, 2026-05-27)

- 기존 단일 하드코딩 히어로 사진(`src/assets/photos/2026group-spring.jpg`, index.astro에서 직접 import)을 **최대 3장 가로 슬라이드 캐러셀**로 교체. 사진은 `src/assets/hero/`로 이동.
- **데이터 저장 = 직접 JSON import** (`src/content/home/hero.json`의 `items[]`), `getCollection`/content.config.ts 미등록. 이유: file() loader의 배열 순서 보존 동작에 대한 확증이 없어, admin이 드래그한 슬라이드 순서를 100% 보장하려고 직접 import로 결정. 검증 손실은 미미(이미지는 glob 폴백, alt/caption은 자유 문자열).
- 이미지 최적화는 멤버 사진(PortraitBox) 패턴 그대로: CMS가 `src/assets/hero/`에 업로드 → `import.meta.glob`으로 basename lookup → Astro `<Image>`(webp/반응형). 첫 장만 eager+fetchpriority high (LCP).
- 컴포넌트 `src/components/HeroSlideshow.astro`: viewport(aspect 4/3, overflow hidden) + flex track(translateX) + 화살표(hover/focus 노출, 터치 기기 항상 옅게) + 점 인디케이터 + caption. 자동재생 5s, hover/focus/탭비활성 시 정지, prefers-reduced-motion 시 자동재생·전환 애니메이션 없음. 슬라이드 1장이면 컨트롤·스크립트 비활성(기존과 동일한 정적 이미지).
- CMS: `public/admin/config.yml`에 10번째 컬렉션 `home`(`Home · Hero slides`) 추가. list widget `min:1 max:3`, image 위젯 media_folder `/src/assets/hero` public_folder `/hero`.
- 검증: `npm run check` 0/0/0, `npm run build` 통과. 3장 시드로 dots·arrows·captions·srcset 렌더 확인 후 1장(실사진)으로 복원.

## Home Research highlights + Recent papers 개편 (2026-05-28)

- **데이터 소스 = 홈 전용 직접 큐레이션** (hero.json과 동일하게 `src/content/home/research-featured.json`을 index.astro가 직접 import). research-highlights 컬렉션 자동 연동(최신 2개) 대신, 사용자가 홈에 띄울 카드 2장을 CMS에서 직접 고르는 방식 선택. content.config.ts zod 미등록(hero 선례 동일).
- **미디어 저장 = `public/research-featured/` + 일반 `<img>`** (hero/research 페이지의 `src/assets/*` + Astro `<Image>` 패턴과 다름). 이유: (1) GIF 애니메이션 보존 — Astro Image(sharp)는 기본적으로 GIF를 정적 webp로 변환, (2) jpg/png/gif/YouTube를 한 캐러셀에서 일관 처리. 미디어가 hero(LCP)보다 아래라 최적화 손실 영향 작음(lazy 로드).
- **YouTube = 빌드타임 id 파싱 + 썸네일 facade.** 컴포넌트 frontmatter에서 watch/youtu.be/embed/shorts/bare-id → 11자리 id 추출, `i.ytimg.com/vi/<id>/hqdefault.jpg` 썸네일 + 재생버튼. 클릭 시 JS가 `youtube-nocookie.com/embed/<id>?autoplay=1` iframe으로 교체(초기 로드에 무거운 임베드 미포함).
- **캐러셀 = 자동 슬라이드(5s) + 화살표/점 수동.** 사용자 요청으로 자동재생 추가. hover/focus·탭 비활성 시 정지, **동영상 facade 클릭(재생 시작) 시 `locked`로 자동 슬라이드 영구 정지**(재생 중 전환 방지), `prefers-reduced-motion` 시 자동재생 없음. 슬라이드 1개면 자동재생·컨트롤 비활성.
- **제목 링크 = 카드별 `link` 필드**(사용자 선택). 기존 research-highlights의 doi 재사용 아님 — 논문·보도자료·영상 등 임의 대표 링크 가능.
- **호버 그라디언트 그림자** = layered 코랄 `box-shadow`(3겹, blur 증가) + 미디어 위 코랄 linear-gradient 시트 fade-in + `translateY(-6px)`. `prefers-reduced-motion` 시 transform/transition 제거.
- **Recent papers 리스트** = 기존 3-카드 그리드를 `sm:grid-cols-[13rem_1fr_auto]` 3줄 리스트로 압축(저널·연도 / 제목 / Read→), 행 hover 시 cream 배경 + 코랄. 데이터는 그대로 publications-skku lead 최신 3편 자동 추출.
- **CMS**: `home` 컬렉션을 단일 파일(hero)에서 2-파일(hero + research-featured)로 확장, 라벨 `Home · Hero slides` → `Home`. research-featured image 위젯 media_folder `/public/research-featured`(research-themes/highlights의 `/public/research` 선례와 동일 prefix).
- 검증: `npm run check` 0/0/0, `npm run build` 통과(11 pages + pagefind). dist/index.html에서 섹션 순서(Research highlights → Recent papers)·카드 link·미디어 경로 확인. 브라우저 드라이버 부재로 시각 스크린샷은 미실시(로컬 dev 프리뷰 권장).

## Hero 높이 정렬 + 캡션 오버레이 (2026-05-28)

- 좌측 텍스트와 우측 사진 높이 불일치(텍스트가 더 김) 해소: index.astro 히어로 grid `items-start` → `items-stretch`, HeroSlideshow `.hero-carousel`/`__viewport` `height:100
## Hero 높이 정렬 + 캡션 오버레이 (2026-05-28)

- 좌측 텍스트와 우측 사진 높이 불일치(텍스트가 더 김) 해소: index.astro 히어로 grid `items-start` → `items-stretch`, HeroSlideshow `.hero-carousel`/`__viewport` `height:100%`로 텍스트 칼럼 높이를 채움. 모바일(1열)은 기존 `aspect-ratio: 4/3`, 데스크톱(>=768px)은 `aspect-ratio:auto` + `min-height:22rem`.
- 사진 표현 `object-fit: contain` + `mix-blend-mode: darken`(크림 레터박스) → `object-fit: cover`(꽉 채움, mix-blend 제거)로 변경. 단체사진이라 크롭 OK. `border-radius: var(--radius-lg)` 추가.
- 캡션을 사진 아래 별도 bar(`__bar`) → 사진 안쪽 하단 오버레이(`__overlay`, to-top 그라디언트 스크림 위 caption 좌·dots 우)로 이동. caption은 cream + text-shadow, dots는 cream/coral. 오버레이 `pointer-events:none` + 자식만 auto(dots 클릭 유지). caption/dots 둘 다 없으면(단일·무캡션) 오버레이 미렌더.

## News 미디어 일원화 + MediaCarousel 추출 (2026-05-28)

- Research highlights와 News가 "같은" 다양한 미디어를 쓰도록, 캐러셀 로직을 공용 `src/components/MediaCarousel.astro`로 추출. props: `media[]`(image/youtube/alt), `class`, `aspect`(기본 16/10, `--mc-aspect` CSS var). 클래스 prefix `mc__*`, data attr `data-mc-*`, 스크립트는 페이지의 모든 `[data-mc-carousel]` 초기화(자동 슬라이드 5s, hover/탭 정지, 동영상 재생 시 locked, reduced-motion 존중, YouTube 클릭 시 nocookie iframe 인라인 교체).
- `ResearchHighlightCard.astro`는 인라인 미디어 마크업/CSS/스크립트를 제거하고 `<MediaCarousel class="rounded-t-lg" />`로 위임. **미디어 호버 sheen(`__media::after` 코랄 그라디언트)은 제거** — Astro scoped CSS는 자식 컴포넌트 내부 요소를 부모 hover로 제어 불가. 카드 자체의 코랄 box-shadow 글로우 + 리프트는 유지되므로 "호버 그라디언트 그림자"는 그대로.
- News: 파일명 규칙 기반 `photoCount`(+ `NewsPhoto.astro`, `src/assets/news/`) 시스템을 **폐지**하고 `media[]`로 일원화(사용자 결정). 기존 8장은 `git mv`로 `public/news-media/`에 이동(Astro Image 최적화 → public 원본 서빙으로 전환; GIF/YouTube 일관 처리 위해). 6개 entry frontmatter를 `media:` 리스트로 마이그레이션, photoCount:0 2개는 필드 제거.
- `content.config.ts` news 스키마: `photoCount: z.number().optional()` → `media: z.array({image?, youtube?, alt?}).optional()`. (facilities/gallery-events의 photoCount는 별개라 유지.)
- CMS `public/admin/config.yml` news: photoCount number 필드 → media list(widget image media_folder `/public/news-media`, youtube/alt; max 8).
- news.astro: 사진 grid(1/2/3-col) → `<MediaCarousel class="rounded-md ..." />` (max-w-xl). 여러 장이면 캐러셀로 슬라이드(기존 grid 레이아웃과 달라짐 — 일원화 trade-off).
- 검증: check 0/0/0, build 통과. dist에서 홈 2 카드 + 뉴스 5 캐러셀(fellowship 3장 = autoplay), /news-media 이미지 8장 확인.

## Gallery 미디어 일원화 (2026-05-28)

- 사용자 결정: Gallery도 News처럼 `MediaCarousel`로 통일. 모자이크+라이트박스(클릭 확대) → 자동 슬라이드 캐러셀로 변경. 137장이 src/assets(Astro Image 최적화) → public/gallery-media(원본 서빙)로 이동하여 이미지 최적화는 약화되지만, GIF/YouTube 지원 + CMS 업로드 + 3개 페이지 일관성을 얻음.
- 마이그레이션은 일회성 `scripts/_migrate-gallery.mjs`로 처리(실행 후 삭제). photoCount(파일명 규칙) → `media: [{image}]`로 변환, `src/assets/gallery/<slug>-<n>.jpg` → `public/gallery-media/`. 슬러그 접두 충돌(예: 2025-ksm vs 2025-ksm-fall) 방지 위해 정확히 `^<slug>-(\d+)\.jpg$` 매칭.
- 발견·수정한 기존 데이터 버그: 파일 `2025-graduation-feb25.md`의 frontmatter는 `slug: 2026-graduation-feb25`, `year: 2026`이고 사진도 `2026-graduation-feb25-{1,2}.jpg`였다(파일명만 2025-). 스크립트가 파일명 기준이라 누락 → 수동으로 media 2장 연결. 표시는 frontmatter year로 그룹핑되어 무해하므로 파일명 rename은 보류(사용자 판단).
- 2023-bk-thesis: 구 PhotoMosaic가 `safeCount = min(count, 6)`으로 6장만 표시 → 파일 14장 중 8장이 dead였음. 캐러셀 전환으로 14장 전부 노출(정리 효과).
- alt 전략: gallery frontmatter media에는 alt를 저장하지 않고(대량 마이그레이션 단순화), gallery.astro에서 `m.alt || `${event.title} — photo ${i+1}`` 로 렌더타임 fallback. CMS media 필드에는 alt(선택) 있음.
- gallery.astro: `<MediaCarousel aspect="3 / 2" class="rounded-md ..." />`(갤러리 가로 비율 유지), `max-w-2xl`. totalPhotos = Σ media.length.
- orphan 정리: `PhotoMosaic.astro` 삭제(내 변경으로 미사용화), `src/assets/gallery/`(README 포함) 제거. **`GalleryPhoto.astro`는 이번 변경 이전부터 어디서도 import 안 되는 dead code** — §3에 따라 삭제하지 않고 보존(미사용 .astro는 빌드에 포함 안 되어 무해). 추후 정리 대상으로 언급.
- News/Gallery 공통: 여러 장이 그리드 → 캐러셀(슬라이드)로 표시 방식이 바뀜. 라이트박스(확대)는 제거됨(통일 trade-off).
