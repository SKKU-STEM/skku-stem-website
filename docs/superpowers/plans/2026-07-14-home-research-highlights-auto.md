# 홈 Research Highlights 자동 게시 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈페이지 "Research highlights" 섹션을 수기 JSON 대신 Research Highlights 컬렉션 최신 2건으로 자동 채우고, CMS 업로드 하이라이트 이미지가 렌더링되도록 이미지 파이프라인을 바로잡는다.

**Architecture:** 이미지 해석을 공용 유틸(`getResearchFigure`)로 추출해 `/research`와 홈이 동일하게 `src/assets/research/`의 최적화 이미지를 쓴다. 홈 카드는 `MediaCarousel`(public URL) 대신 `FigureSlot`(astro:assets `<Image>`)로 전환한다. 수기 큐레이션 시스템(JSON·이미지·CMS 컬렉션)은 제거하고, CMS 설정을 히어로 패턴(`/src/assets/...` 업로드)에 맞춘다.

**Tech Stack:** Astro 5, Tailwind 4, astro:content(글롭 로더), astro:assets(`<Image>`), Sveltia CMS(`public/admin/config.yml`), Pagefind.

## Global Constraints

- 새 소스 파일 첫 줄에 역할을 설명하는 한국어 한 줄 주석을 단다(설정 파일 제외).
- 한국어 출력 문장은 마침표로 끝낸다(문장 끝 콜론 금지).
- 표면적 변경만 한다. 요청과 무관한 인접 코드/포맷은 건드리지 않는다.
- 검증은 Astro 특성상 단위 테스트가 아니라 `npm run check`(타입/컴포넌트 검증)와 최종 `npm run build`(astro build + pagefind) + 시각 확인으로 한다.
- `config.yml` 편집 후 반드시 YAML 파싱 검증(js-yaml)한다. label/hint의 `공백 + #`는 주석 처리되므로 따옴표로 감싼다.
- 작업 브랜치: `feat/home-highlights-auto`(이미 생성·origin/main 동기화됨). `src/pages/news.astro`의 기존 수정분은 무관하므로 커밋에 포함하지 않는다.
- 경로 별칭: `@components`, `@layouts`, `@content`, `@/utils/...` 사용(기존 관례).

## File Structure

- Create: `src/utils/researchFigure.ts` — `src/assets/research/*` 최적화 이미지 해석 공용 유틸.
- Modify: `src/pages/research.astro` — 로컬 `getFigure`를 공용 유틸로 교체.
- Modify: `src/components/ResearchHighlightCard.astro` — `MediaCarousel` → `FigureSlot`, props `media` → `figure`.
- Modify: `src/pages/index.astro` — 컬렉션 최신 2건 로드·매핑, 수기 JSON import 제거.
- Modify: `src/content/research-highlights/2026-untangling-copper-s-two-stage-electromigration-with-in-situ-4d‑stem.md` — `image:` 필드 정상화(파일명은 U+2011 `‑` 포함).
- Move: `public/recruiting/Cu-Cu bonding.jpg` → `src/assets/research/2026-untangling-copper-electromigration.jpg`.
- Delete: `src/content/home/research-featured.json`, `public/research-featured/2026-silver-thin-films.png`, `public/research-featured/2026-ml-electrode-characterization.jpg`.
- Modify: `public/admin/config.yml` — `research-featured` 파일 컬렉션 제거 + research-highlights 이미지 필드 설정 정합화.

주의: `MediaCarousel.astro`는 News가 계속 사용하므로 삭제하지 않는다. `research-themes` 컬렉션의 figure 필드도 동일한 `/public/research` 불일치가 있으나 이번 범위 밖이다(건드리지 않음).

---

### Task 1: 이미지 해석 공용 유틸 신설 + research.astro 교체

**Files:**
- Create: `src/utils/researchFigure.ts`
- Modify: `src/pages/research.astro` (frontmatter 이미지 해석부)

**Interfaces:**
- Produces: `getResearchFigure(path?: string): ImageMetadata | null` — `src/assets/research/`의 파일을 basename으로 찾아 반환. 맨 파일명·접두 경로(`/research/foo.png`) 모두 해석. 없으면 `null`.

- [ ] **Step 1: 공용 유틸 작성**

`src/utils/researchFigure.ts` 생성:

```ts
// research-highlights 이미지 파일명을 빌드타임 최적화 이미지(ImageMetadata)로 해석하는 공용 유틸
import type { ImageMetadata } from 'astro';

// src/assets/research/* 의 모든 figure 파일을 build-time에 eager-load
const figureModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/research/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

// 맨 파일명('2026-foo.png')이든 접두 경로('/research/2026-foo.png')든 basename으로 해석한다.
export const getResearchFigure = (path?: string): ImageMetadata | null => {
  if (!path) return null;
  const base = path.split('/').pop();
  if (!base) return null;
  return figureModules[`/src/assets/research/${base}`]?.default ?? null;
};
```

- [ ] **Step 2: research.astro에서 로컬 glob/getFigure 제거하고 유틸 import**

`src/pages/research.astro` 상단 import 블록에 추가(기존 import들 사이, 관례 위치):

```astro
import { getResearchFigure } from '@/utils/researchFigure';
```

그리고 아래 로컬 정의 블록을 통째로 삭제한다(현재 존재하는 원문):

```astro
// src/assets/research/* 의 모든 figure 파일을 build-time에 eager-load
const figureModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/research/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const getFigure = (filename?: string): ImageMetadata | null => {
  if (!filename) return null;
  const mod = figureModules[`/src/assets/research/${filename}`];
  return mod?.default ?? null;
};
```

- [ ] **Step 3: 호출부 교체**

`src/pages/research.astro`에서 `getFigure(entry.image)` 호출을 `getResearchFigure(entry.image)`로 바꾼다(highlights timeline의 `FigureSlot image={getFigure(entry.image)}`).

`import type { ImageMetadata } from 'astro';`가 더 이상 research.astro에서 쓰이지 않으면 해당 import를 제거한다(본인 변경으로 생긴 orphan). `CollectionEntry` 타입 등 다른 import는 유지한다. 제거 전 파일에서 `ImageMetadata` 잔여 사용 여부를 확인한다.

- [ ] **Step 4: 타입/컴포넌트 검증**

Run: `npm run check`
Expected: 에러 0. (동작 동일 — `/research` 이미지 해석 결과 불변.)

- [ ] **Step 5: 커밋**

```bash
git add src/utils/researchFigure.ts src/pages/research.astro
git commit -m "research 이미지 해석을 getResearchFigure 공용 유틸로 추출"
```

---

### Task 2: 구리 항목 이미지 정상화

**Files:**
- Move: `public/recruiting/Cu-Cu bonding.jpg` → `src/assets/research/2026-untangling-copper-electromigration.jpg`
- Modify: `src/content/research-highlights/2026-untangling-copper-s-two-stage-electromigration-with-in-situ-4d‑stem.md`

**Interfaces:**
- Consumes: Task 1의 `getResearchFigure`(basename 해석).

- [ ] **Step 1: 이미지 파일 이동(git mv)**

```bash
git mv "public/recruiting/Cu-Cu bonding.jpg" "src/assets/research/2026-untangling-copper-electromigration.jpg"
```

- [ ] **Step 2: 항목 .md의 image 필드 수정**

파일: `src/content/research-highlights/2026-untangling-copper-s-two-stage-electromigration-with-in-situ-4d‑stem.md`
(파일명의 `4d‑stem`은 U+2011 non-breaking hyphen 포함 — Read/Edit 시 정확한 경로 사용.)

Edit — old_string:

```
image: /recruiting/Cu-Cu bonding.jpg
```

new_string:

```
image: 2026-untangling-copper-electromigration.jpg
```

(기존 은박막·ML 항목과 동일하게 맨 파일명 형식. `getResearchFigure`가 basename으로 해석.)

- [ ] **Step 3: 검증 — 빌드 산출물에서 구리 이미지 확인**

Run: `npm run check`
Expected: 에러 0.

추가 확인: `git status`로 `public/recruiting/Cu-Cu bonding.jpg`가 삭제(rename)되고 `src/assets/research/2026-untangling-copper-electromigration.jpg`가 추가됐는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "구리 하이라이트 이미지를 src/assets/research 규칙으로 정상화"
```

---

### Task 3: 홈 카드 컴포넌트 전환 + index.astro 자동화

**Files:**
- Modify: `src/components/ResearchHighlightCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Task 1 `getResearchFigure`; `FigureSlot`(`image?: ImageMetadata|null`, `alt`, `class?`, `aspectClass?`).
- Produces: `ResearchHighlightCard` props `{ eyebrow?: string; title: string; summary?: string; link: string; figure?: ImageMetadata | null }`.

- [ ] **Step 1: ResearchHighlightCard를 FigureSlot 기반으로 교체**

`src/components/ResearchHighlightCard.astro` 전체를 아래로 교체:

```astro
---
// 홈 'Research highlights' 카드 — Research Highlights 컬렉션의 최적화 figure(FigureSlot)와
// 제목(카드별 link로 연결), 호버 그라디언트 그림자 효과. 데이터: src/content/research-highlights/*.md
import FigureSlot from '@components/FigureSlot.astro';
import type { ImageMetadata } from 'astro';

interface Props {
  eyebrow?: string;
  title: string;
  summary?: string;
  link: string;
  figure?: ImageMetadata | null;
}

const { eyebrow, title, summary, link, figure } = Astro.props;

const isExternal = /^https?:\/\//.test(link);
---

<article class="lift-card group relative flex flex-col rounded-lg border border-cream-300 bg-cream-200/60">
  <FigureSlot
    image={figure}
    alt={title}
    class="w-full rounded-t-lg"
    aspectClass="aspect-[16/10]"
  />

  <div class="flex flex-1 flex-col p-6 md:p-7">
    {
      eyebrow && (
        <p class="font-mono text-[11px] uppercase tracking-[0.14em] text-coral-700 font-bold">
          {eyebrow}
        </p>
      )
    }
    <h3 class="mt-3 font-display font-normal text-xl md:text-2xl tracking-tight leading-snug text-balance">
      <a
        href={link}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        class="transition-colors group-hover:text-coral hover:text-coral"
      >
        {title}
      </a>
    </h3>
    {
      summary && (
        <p class="mt-4 font-serif text-base leading-relaxed text-ink/85">
          {summary}
        </p>
      )
    }
  </div>
</article>
```

(`MediaCarousel` import과 `MediaItem` 인터페이스가 제거된다. `MediaCarousel.astro` 자체는 News가 쓰므로 삭제하지 않는다.)

- [ ] **Step 2: index.astro frontmatter — 수기 JSON 제거, 컬렉션 자동화**

`src/pages/index.astro`에서 아래 import 줄을 삭제:

```astro
import researchFeaturedData from '@content/home/research-featured.json';
```

그리고 파일 상단 import 블록에 추가:

```astro
import { getResearchFigure } from '@/utils/researchFigure';
```

`const researchFeatured = researchFeaturedData.items;`(주석 포함)를 아래로 교체:

```astro
// 홈 'Research highlights' 카드(2장) — Research Highlights 컬렉션 최신 2건 자동 게시(date 내림차순).
const researchFeatured = (await getCollection('research-highlights'))
  .map((e) => e.data)
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 2)
  .map((h) => ({
    eyebrow: `${h.journal} · ${h.date.getUTCFullYear()}`,
    title: h.title,
    summary: h.summary,
    link: h.doi,
    figure: getResearchFigure(h.image),
  }));
```

(`getCollection`은 index.astro에 이미 import되어 있다.)

- [ ] **Step 3: index.astro 템플릿 — 카드 props를 figure로 교체**

Research highlights 섹션의 map 블록을 아래로 교체:

```astro
{
  researchFeatured.map((item) => (
    <ResearchHighlightCard
      eyebrow={item.eyebrow}
      title={item.title}
      summary={item.summary}
      link={item.link}
      figure={item.figure}
    />
  ))
}
```

- [ ] **Step 4: 타입/컴포넌트 검증**

Run: `npm run check`
Expected: 에러 0. (`research-featured.json` 파일은 아직 남아 있어도 참조가 없어 무방 — Task 4에서 삭제.)

- [ ] **Step 5: 커밋**

```bash
git add src/components/ResearchHighlightCard.astro src/pages/index.astro
git commit -m "홈 Research highlights를 컬렉션 최신 2건 자동 게시로 전환"
```

---

### Task 4: 수기 큐레이션 시스템 제거

**Files:**
- Delete: `src/content/home/research-featured.json`
- Delete: `public/research-featured/2026-silver-thin-films.png`, `public/research-featured/2026-ml-electrode-characterization.jpg`
- Modify: `public/admin/config.yml` (`research-featured` 파일 컬렉션 블록 제거)

- [ ] **Step 1: 참조 없음 확인**

Run: `grep -rn "research-featured" src/`
Expected: 결과 없음(Task 3에서 import 제거 완료). 결과가 있으면 그 참조를 먼저 정리.

- [ ] **Step 2: JSON·이미지 삭제**

```bash
git rm src/content/home/research-featured.json
git rm "public/research-featured/2026-silver-thin-films.png" "public/research-featured/2026-ml-electrode-characterization.jpg"
```

- [ ] **Step 3: config.yml에서 research-featured 파일 컬렉션 제거**

`public/admin/config.yml`에서 아래 블록(및 뒤따르는 빈 줄 1개)을 삭제한다. old_string:

```yaml
      - file: src/content/home/research-featured.json
        name: research-featured
        label: 'Research highlights (홈 카드 2장)'
        fields:
          - name: items
            label: Cards
            label_singular: Card
            widget: list
            add_to_top: true
            collapsed: true
            min: 1
            max: 2
            summary: '{{fields.title}}'
            fields:
              - { name: eyebrow, label: Eyebrow (저널·연도 등 작은 라벨), widget: string, required: false }
              - { name: title, label: Title (클릭 시 아래 Link로 이동), widget: text }
              - { name: summary, label: Summary (한두 문장), widget: text, required: false }
              - { name: link, label: Link URL (제목 클릭 대상), widget: string, hint: '논문 DOI·보도자료·영상 등 대표 링크' }
              - name: media
                label: Media (이미지/GIF 최대 3장 또는 YouTube)
                label_singular: Media item
                widget: list
                add_to_top: true
                collapsed: true
                required: false
                max: 3
                summary: '{{fields.alt}}'
                hint: '1개면 단일 표시, 2~3개면 캐러셀로 슬라이드된다.'
                fields:
                  - name: image
                    label: Image / GIF
                    widget: image
                    required: false
                    media_folder: '/public/research-featured'
                    public_folder: '/research-featured'
                    choose_url: false
                    hint: 'public/research-featured/에 업로드되며 경로는 /research-featured/<filename>으로 저장된다. GIF도 원본 그대로 재생. YouTube를 쓰면 이미지는 비워둔다.'
                  - { name: youtube, label: YouTube URL, widget: string, required: false, hint: 'https://youtu.be/... 또는 watch?v=... — 입력하면 이 슬라이드는 이미지 대신 동영상으로 재생된다.' }
                  - { name: alt, label: Alt text (이미지 설명), widget: string, required: false }

```

new_string: (빈 문자열 — 블록 전체 제거)

결과적으로 `home` 컬렉션 `files:`에는 `hero`와 `recruiting`만 남아야 한다.

- [ ] **Step 4: YAML 유효성 검증**

Run: `node -e "const y=require('js-yaml');const fs=require('fs');y.load(fs.readFileSync('public/admin/config.yml','utf8'));console.log('YAML OK')"`
Expected: `YAML OK`. (js-yaml 미설치 시 `npx --yes js-yaml public/admin/config.yml`로 대체.)

- [ ] **Step 5: 빌드 검증**

Run: `npm run check`
Expected: 에러 0.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "수기 Research highlights 큐레이션(JSON·이미지·CMS 컬렉션) 제거"
```

---

### Task 5: CMS research-highlights 이미지 필드 설정 정합화

**Files:**
- Modify: `public/admin/config.yml` (research-highlights 컬렉션의 image 필드)

- [ ] **Step 1: research-highlights image 필드를 src/assets 업로드로 변경**

`public/admin/config.yml`에서 아래 블록을 교체한다. **주의:** 동일한 image 블록이 research-themes(범위 밖)에도 있으므로, 앞의 `mentionUrl` 줄까지 포함해 research-highlights 블록만 고유하게 매칭한다.

old_string:

```yaml
      - { name: mentionUrl, label: Press mention URL, widget: string, required: false }
      - name: image
        label: Figure
        widget: image
        required: false
        media_folder: '/public/research'
        public_folder: '/research'
        choose_url: false
      - { name: imageAlt, label: Figure alt text, widget: string, required: false }
```

new_string:

```yaml
      - { name: mentionUrl, label: Press mention URL, widget: string, required: false }
      - name: image
        label: Figure
        widget: image
        required: false
        media_folder: '/src/assets/research'
        public_folder: '/research'
        choose_url: false
        hint: 'src/assets/research/에 업로드되며 경로는 /research/<filename>으로 저장된다. 4:3 비율 권장.'
      - { name: imageAlt, label: Figure alt text, widget: string, required: false }
```

(research-themes(474–481)의 동일 블록은 이번 범위 밖 — 건드리지 않는다.)

- [ ] **Step 2: YAML 유효성 검증**

Run: `node -e "const y=require('js-yaml');const fs=require('fs');y.load(fs.readFileSync('public/admin/config.yml','utf8'));console.log('YAML OK')"`
Expected: `YAML OK`.

- [ ] **Step 3: 커밋**

```bash
git add public/admin/config.yml
git commit -m "CMS research-highlights 이미지 필드를 src/assets/research 업로드로 정합화"
```

---

### Task 6: 전체 빌드 + 시각 검증

**Files:** (없음 — 검증 전용)

- [ ] **Step 1: 전체 빌드**

Run: `npm run build`
Expected: astro build 성공 + pagefind 인덱싱 성공, 에러 0.

- [ ] **Step 2: 홈 카드 이미지 산출물 확인**

Run: `npm run preview` (또는 `npm run dev`)로 로컬 서버 기동 후 홈(`/`) 확인.
Expected:
  - "Research highlights" 섹션에 최신 2건 = "Untangling copper's two-stage electromigration..."(2026-07)과 "A growth mechanism for grain-boundary-free ultraflat silver thin films"(2026-01) 카드가 표시된다.
  - 두 카드 모두 이미지가 `<img>`로 렌더링된다(구리 카드 포함).
  - eyebrow가 `저널 · 2026` 형식으로 표시된다.

- [ ] **Step 3: /research 구리 그림 확인**

`/research` 페이지에서 "Untangling copper's two-stage electromigration..." 항목의 figure가 정상 이미지로 표시되는지 확인(이전엔 빈 placeholder였음).

- [ ] **Step 4: 최종 확인 보고**

빌드 로그·시각 확인 결과를 사용자에게 보고한다. 문제가 있으면 systematic-debugging으로 돌아간다.

---

## Self-Review

**Spec 커버리지:**
- 근본원인1(데이터 출처 분리) → Task 3.
- 근본원인2(이미지 파이프라인 불일치) → Task 1(유틸)·Task 5(CMS 설정).
- 변경1(공용 유틸) → Task 1. 변경2(research.astro 교체) → Task 1. 변경3(카드 전환) → Task 3. 변경4(index 자동화) → Task 3. 변경5(수기 시스템 제거) → Task 4. 변경6(구리 이미지) → Task 2. 변경7(CMS 정합화) → Task 5.
- 검증 기준(build·홈 2건·/research 구리) → Task 6.

**Placeholder 스캔:** TODO/TBD 없음. 모든 코드 단계에 실제 코드 포함.

**타입 일관성:** `getResearchFigure(path?: string): ImageMetadata | null` — Task 1 정의, Task 2·3에서 동일 시그니처로 소비. `ResearchHighlightCard` props `figure?: ImageMetadata | null` — Task 3 정의·사용 일치. `FigureSlot` props(`image`, `alt`, `class`, `aspectClass`)는 기존 컴포넌트와 일치.
