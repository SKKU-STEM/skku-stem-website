# 노스(Nous) AI 연구보조원 카드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

개정 2026-10-17 — 전문가 6인(홈페이지·음성영상·언어·접근성·연구윤리·예비 대학원생) 감사와 사용자 결정(원고 v2, 시장 규모 그래픽, 진로 16명 학위/연구직 구분) 반영.

**Goal:** People 페이지와 메인 모집 섹션에 AI 연구보조원 "노스" 진입점을 두고, 누르면 사진이 떠오르며 음성·영한 자막·문단별 그래픽 3종·상담 CTA가 나오는 모달을 연다.

**Architecture:** `src/components/nous/`에 순수 TS 모듈(노스·음성 데이터와 시각 판정, 생성된 진폭 엔벌로프, 진로 집계)과 Astro 컴포넌트(모달, 메인 카드, 그래픽 3종)를 둔다. People 카드는 `people/index.astro`에 직접 쓴다. 모달은 페이지당 1개의 `<dialog>`, 진입점은 `data-nous-open`으로 연결, 재생 중 rAF 루프 하나가 자막·그래픽·CTA·글로우를 갱신한다. 음성 교체는 데이터 파일 교체만으로 끝난다.

**Tech Stack:** Astro 5.18 · Tailwind 4 · TypeScript strict · `astro:assets` · Web Animations API · `node:test` + tsx 4.21(기존 devDependency) · ffmpeg(로컬 자산 가공).

**Spec:** `docs/superpowers/specs/2026-10-16-nous-member-card-design.md` (+ 원고 `docs/nous-script-v2.md`). 실행자는 스펙을 함께 읽는다 — 문구·수치는 스펙 값을 그대로 쓴다.

## Global Constraints

- 새 의존성 금지. 그래픽은 손으로 쓴 SVG, 애니메이션은 CSS/WAAPI.
- 색은 `global.css` 토큰만. 글자는 ink(비활성도 `ink/65` 이상), coral-400·`ink/45`·`ink/55`를 글자나 필수 그래픽 요소에 쓰지 않는다. AI 칩 `bg-coral-700 text-cream`(기존 `산학` 칩 클래스 재사용 금지 — 대비 3.1:1).
- AI 표시: 세 곳 모두 **사진 위** `AI` 칩 + 모달 고지문(스펙 §4-2 문구).
- 음성 `<audio preload="none" data-nous-media>` mp3 하나. 모달 열 때만 받음.
- 모달 `lang="ko"` + 영어 부분만 `lang="en"`. 모달 전체 `data-pagefind-ignore`.
- 상담 메일 `youngmk@skku.edu`, mailto 틀은 스펙 §5-4. PI 표기 "김영민 교수님(Prof. Young-Min Kim)".
- 길이 표기 `1:19`(가공 후 약 79.5s).
- 새 소스 파일 첫 줄 한국어 역할 주석(.ts·.mjs `// …`, .astro는 frontmatter 첫 줄).
- 논리 단위마다 커밋(한국어 한 문장 + 세션 attribution 두 줄). **push 금지**(사용자 결정: 음성 v2 전까지 배포 보류, 배포는 사용자 확인 후).
- `checklist.md`·`context-notes.md`에 이번 작업 섹션을 두고 진행·결정을 기록.

## Review Focus

1. **닫았다가 다시 열기(재생 중 포함), 안드로이드 뒤로가기로 닫기** — 소리 즉시 정지, 다시 열면 0초·자막 1문단·그래픽·CTA 초기화, 소리 겹침 없음. → Task 5 스크립트 계약 + Task 8 실측.
2. **음성 재생 실패**(404·네트워크·자동재생 거부) vs **빨리 닫기로 인한 AbortError** — 앞은 오류 문구+재생 버튼, 뒤는 아무 표시 없음. → Task 8에서 route 404 + 즉시 닫기 실측.
3. **390px 모바일** — 풀스크린 시트, 상·하단 바 고정, 가운데만 스크롤, 문단 3 시작 시 시장 그래픽이 손 스크롤 없이 화면 안, 가로 오버플로 0, 배경 스크롤 잠김. → Task 8.
4. **키보드·스크린리더** — Tab→Enter로 열림, 첫 포커스 재생 버튼(Space로 정지), 숨은 그래픽·CTA에 Tab 안 닿음, Esc 후 포커스가 트리거로, 슬라이더 화살표 ±5s. → Task 5 + Task 8 axe.
5. **진행 막대 앞뒤 이동·문단 시각 버튼** — 자막 강조가 따라가고 이미 나온 그래픽은 남으며 52.0s 이후로 가면 그래픽 3개 모두, 69.3s 이후면 CTA 펼침. → Task 2 단위 테스트 + Task 8.

---

## File Structure

| 파일 | 책임 |
|---|---|
| `src/assets/nous/portrait.jpg` | 포트레이트(워터마크 포함) |
| `public/nous/intro.mp3` | 가공한 v1 음성 |
| `scripts/nous-envelope.mjs` | mp3 → `envelope.ts` 생성 |
| `src/components/nous/envelope.ts` | (생성물) `ENVELOPE` |
| `src/components/nous/nous.ts` | 노스 메타, `VOICE`, `PARAGRAPHS`, 시각 판정, 시간 표기, `mailtoHref`, `ampAt` |
| `src/components/nous/careers.ts` | 진로 분류·집계 |
| `tests/nous.test.ts` | 위 TS 모듈 단위 테스트 |
| `src/components/nous/ResearchMap.astro` · `MarketChart.astro` · `CareersChart.astro` | 그래픽 3종 |
| `src/components/nous/NousModal.astro` | 모달 마크업·스타일·스크립트 |
| `src/components/nous/NousHomeCard.astro` | 메인 카드 |
| `src/pages/people/index.astro` | PI 섹션(306행) 뒤 Lab Assistant 섹션·카드 + 모달 |
| `src/pages/index.astro` | 모집 섹션 오른쪽 열(350–358행) 분할 + 모달 |

---

### Task 1: 자산 가공 + 엔벌로프 생성기

**Files:**
- Create: `src/assets/nous/portrait.jpg`, `public/nous/intro.mp3`, `scripts/nous-envelope.mjs`, `src/components/nous/envelope.ts`
- Modify: `checklist.md`, `context-notes.md` (끝에 "노스 AI 연구보조원 카드 (2026-10-16~)" 섹션)

**Interfaces:**
- Produces: `@/assets/nous/portrait.jpg`; `/nous/intro.mp3`; `export const ENVELOPE: { fps: 20; levels: string }`(각 글자 '0'–'9', 50ms 1칸).

- [ ] **Step 1: 포트레이트** — `ffmpeg -i nous_member_card/nous_portrait.png -vf "scale=1152:1536,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='AI-generated':fontsize=30:fontcolor=white@0.8:x=w-tw-28:y=h-th-24:box=1:boxcolor=black@0.25:boxborderw=8" -q:v 2 src/assets/nous/portrait.jpg`. 결과를 Read로 열어 우하단 표시 확인, 크기 ≤ 300KB.
- [ ] **Step 2: 음성 가공** — `ffmpeg -i nous_member_card/nous_intro_voice.mp3 -af "atrim=0:79.2,adelay=300:all=1,volume=5.6dB,alimiter=limit=0.84:attack=5:release=50:level=false" -c:a libmp3lame -b:a 64k -ar 48000 -ac 1 public/nous/intro.mp3`.
- [ ] **Step 3: 음성 검증** —
  - 길이 `ffprobe -v error -show_entries format=duration` → 79.5±0.05.
  - `ffmpeg -i public/nous/intro.mp3 -af ebur128=peak=true -f null -` → Integrated −19±1 LUFS, True peak ≤ −1.0 dBFS.
  - 끝 잔여음: `ffmpeg -ss 79.3 -i public/nous/intro.mp3 -af volumedetect -f null -` → max_volume < −60 dB. **대조**: 원본에 `-ss 79.0`으로 같은 명령 → max_volume > −20 dB(검사가 실제로 걸러냄을 확인).
  - 앞 무음: `ffmpeg -t 0.28 -i public/nous/intro.mp3 -af volumedetect -f null -` → max < −60 dB.
- [ ] **Step 4: `scripts/nous-envelope.mjs`** — 인자 없이 실행 시 `public/nous/intro.mp3`를 `ffmpeg -af asetnsamples=2400,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-`로 읽어 프레임별 RMS(dB, `-inf`는 −100)를 `clamp(round((db+50)/35*9),0,9)`로 양자화, `src/components/nous/envelope.ts`에 첫 줄 주석 `// (생성물) scripts/nous-envelope.mjs가 intro.mp3에서 만든 20fps 진폭 엔벌로프 — 손으로 고치지 않는다` + `export const ENVELOPE = { fps: 20, levels: '…' } as const;` 기록. `child_process.execFileSync` 사용.
- [ ] **Step 5: 실행·확인** — `node scripts/nous-envelope.mjs` → levels 길이 = ceil(79.5×20)±1(약 1590). 말 쉼 구간(5.9–6.7s, 인덱스 118–134)에 '0'·'1'이 연속하는지 확인.
- [ ] **Step 6: checklist.md·context-notes.md 섹션 추가** — checklist에 Task 1–8 체크박스. context-notes에 감사·결정 요약: 제공 PNG 폐기 근거(KISDI 대조, 진로 13 vs 16), v1 받아쓰기 대조와 사실 문제 3곳, 79.2s 컷 이유와 검사 구간 오류 교훈, 음량 −23.8→−19 LUFS, ogg 제외, 원고 v2 결정.
- [ ] **Step 7: Commit** — `노스 카드용 포트레이트·음성 자산과 진폭 엔벌로프 생성기 추가`

### Task 2: 노스·음성 데이터 모듈

**Files:**
- Create: `src/components/nous/nous.ts`
- Test: `tests/nous.test.ts`

**Interfaces:**
- Consumes: `ENVELOPE`(Task 1).
- Produces:
  - `NOUS = { nameKo: '노스', nameEn: 'Nous', roleKo: 'AI 연구보조원', roleEn: 'AI Research Assistant' } as const`
  - `VOICE = { src: '/nous/intro.mp3', duration: 79.5, label: '1:19', spokenKo: '1분 19초', spokenEn: '1 min 19 s' } as const`
  - `PARAGRAPHS: readonly { start: number; en: string; ko: string }[]` — start `0, 6.7, 34.8, 52.0, 69.3`. `en` = 작업지시서 §5 v1 원고(줄바꿈은 공백으로 합침, 구두점만 다듬음: 2문단 "solar materials to the rapidly"(쉼표 삭제), 3문단 "over 20% annually", 4문단 "SK hynix"). `ko` = 아래 v1 번역.
    1. 안녕하세요, 저는 SKKU-STEM 연구실의 AI 연구보조원 노스입니다.
    2. 저희 연구실은 수차보정 주사투과전자현미경과 전자분광법을 머신러닝과 결합해 에너지 소재를 원자 단위에서 연구합니다. 수소 연료전지 촉매와 차세대 태양전지 소재부터 빠르게 성장하는 AI 반도체·로직 소자의 나노 분석까지, 구조와 화학을 면밀히 들여다보며 성능의 비밀을 밝혀냅니다.
    3. 반도체 공정이 나노미터 수준으로 미세해지면서 원자 단위 분석 기술이 그 어느 때보다 중요해졌습니다. AI 반도체 시장은 해마다 20% 넘게 성장하고 있고, 정밀한 나노 분석 수요도 함께 늘고 있습니다.
    4. 졸업생들은 삼성전자, LG에너지솔루션, SK하이닉스 같은 선도 기업과 KIST, KRISS 같은 국가 연구기관, 미국 오크리지 국립연구소 같은 해외 연구소, 램리서치 같은 글로벌 장비 기업으로 진출했습니다.
    5. 연구실 합류에 관심이 있다면 김영민 교수님(youngmk@skku.edu)께 편하게 상담을 요청해 주세요. 여러분의 연락을 기다립니다.
  - `type GraphicId = 'research' | 'market' | 'careers'`; `GRAPHIC_AT: Record<GraphicId, number> = { research: 1, market: 2, careers: 3 }`; `CTA_AT = 4`
  - `activeParagraph(t: number, starts?: readonly number[]): number` (NaN·음수 → 0)
  - `visibleGraphics(t: number): GraphicId[]` (순서 research, market, careers)
  - `ctaExpanded(t: number, ended: boolean): boolean`
  - `formatClock(sec: number): string` → `'0:35'`, `'1:19'`(내림)
  - `formatSpoken(sec: number): string` → `'0분 35초'`, `'1분 19초'`
  - `ampAt(levels: string, fps: number, t: number): number` → 0–1(`digit/9`), 범위 밖 0
  - `mailtoHref(): string` — 스펙 §5-4 제목·본문, `encodeURIComponent`

- [ ] **Step 1: 실패 테스트 작성** (`node:test`, `node:assert/strict`, import `../src/components/nous/nous.ts`, `../src/components/nous/envelope.ts`)

```ts
test('activeParagraph 경계(v1 +0.3s)', () => {
  for (const [t, i] of [[0,0],[6.69,0],[6.7,1],[34.8,2],[51.99,2],[52,3],[69.3,4],[79.5,4],[-1,0],[NaN,0]] as const)
    assert.equal(activeParagraph(t), i, `t=${t}`);
});
test('그래픽은 문단 따라 누적, CTA는 문단5 또는 ended', () => {
  assert.deepEqual(visibleGraphics(3), []);
  assert.deepEqual(visibleGraphics(10), ['research']);
  assert.deepEqual(visibleGraphics(40), ['research', 'market']);
  assert.deepEqual(visibleGraphics(60), ['research', 'market', 'careers']);
  assert.equal(ctaExpanded(60, false), false);
  assert.equal(ctaExpanded(69.3, false), true);
  assert.equal(ctaExpanded(5, true), true);
});
test('시간 표기', () => {
  assert.equal(formatClock(79.5), '1:19'); assert.equal(formatClock(35.9), '0:35');
  assert.equal(formatSpoken(79.5), '1분 19초'); assert.equal(formatSpoken(0), '0분 0초');
});
test('ampAt', () => {
  assert.equal(ampAt('09', 20, 0.06), 1); assert.equal(ampAt('09', 20, 0), 0);
  assert.equal(ampAt('09', 20, 5), 0); assert.equal(ampAt('09', 20, -1), 0);
});
test('엔벌로프 길이 = 음성 길이', () => {
  assert.ok(Math.abs(ENVELOPE.levels.length - Math.ceil(VOICE.duration * ENVELOPE.fps)) <= 2);
  assert.match(ENVELOPE.levels, /^[0-9]+$/);
});
test('원고 데이터', () => {
  assert.equal(PARAGRAPHS.length, 5);
  assert.ok(PARAGRAPHS[0].en.startsWith("Hi, I'm Nous"));
  assert.ok(PARAGRAPHS.every((p) => p.ko.length > 0 && !p.en.includes('\n')));
});
test('mailto', () => {
  const h = mailtoHref();
  assert.ok(h.startsWith('mailto:youngmk@skku.edu?subject='));
  assert.ok(decodeURIComponent(h).includes('관심 과정(학부연구생 / 석박통합 / 석사 / 박사):'));
});
```

- [ ] **Step 2: 실패 확인** — `npx tsx --test tests/nous.test.ts` → import 실패로 FAIL.
- [ ] **Step 3: `nous.ts` 구현** (Interfaces 그대로).
- [ ] **Step 4: 통과 확인** — 7 tests PASS.
- [ ] **Step 5: Commit** — `노스 음성·자막 데이터와 시각 판정 모듈 추가`

### Task 3: 진로 집계 모듈

**Files:**
- Create: `src/components/nous/careers.ts`
- Test: `tests/nous.test.ts`(추가)

**Interfaces:**
- Produces:
  - `type CareerId = 'maker' | 'equipment' | 'institute' | 'academia' | 'overseas' | 'other'`
  - `CAREER_CATEGORIES: readonly { id: CareerId; label: string; examples: string; patterns: readonly RegExp[] }[]` — 스펙 §5-3 표 그대로(범주명·예시 문구, 약칭 키워드는 단어 경계 정규식, `/Universit/i`·`/Oak Ridge/i`·`/National Nanofab/i`는 부분 일치).
  - `currentOf(affiliation: string): string`
  - `classifyAffiliation(affiliation: string): CareerId`
  - `isStaffRole(role: string): boolean` — `/Research Professor|Postdoc|Researcher/i`
  - `yearSpan(roles: string[]): { min: number; max: number } | null` — 4자리 연도 최소·최대
  - `tallyCareers(people: { role?: string; currentAffiliation?: string }[]): { total: number; degree: number; staff: number; bars: { id: CareerId; label: string; examples: string; degree: number; staff: number }[]; span: { min: number; max: number } | null }` — 빈 소속 제외, 합 0인 범주 생략, 범주 표 순서.

- [ ] **Step 1: 실패 테스트 추가**

```ts
const ALUMNI = [/* src/content/members/*.md 중 section: alumni 16명의 { role, currentAffiliation }을 그대로 복사 */];
test('현재 소속 = 세미콜론 앞', () =>
  assert.equal(classifyAffiliation('LG Energy Solution (2024–present); Samsung Electronics (2020–2023)'), 'maker'));
test('KIST와 KAIST 구분', () => {
  assert.equal(classifyAffiliation('Korea Institute of Science and Technology (KIST, 2025–present)'), 'institute');
  assert.equal(classifyAffiliation('KAIST (2025–present)'), 'academia');
});
test('연구직 판정', () => {
  for (const r of ['Research Professor · 2017', 'Postdoctoral researcher · 2021–2022', 'Researcher · 2018–2024']) assert.ok(isStaffRole(r), r);
  for (const r of ['Ph.D. (2020-2026)', "Master's degree · 2018–2020", 'MS-PhD Integrated course · 2017–2023', 'Ph.D. course · 2020–2025']) assert.ok(!isStaffRole(r), r);
});
test('실데이터 16명', () => {
  const r = tallyCareers(ALUMNI);
  assert.deepEqual([r.total, r.degree, r.staff], [16, 12, 4]);
  assert.deepEqual(r.bars.map((b) => [b.id, b.degree, b.staff]),
    [['maker',5,1],['equipment',3,1],['institute',2,1],['academia',1,1],['overseas',1,0]]);
  assert.deepEqual(r.span, { min: 2017, max: 2026 });
});
test('모르는 소속은 기타, 빈 소속은 제외', () => {
  const r = tallyCareers([{ role: 'Ph.D. · 2020–2027', currentAffiliation: 'Acme Corp' }, { role: 'x', currentAffiliation: '' }, {}]);
  assert.equal(r.total, 1); assert.deepEqual(r.bars.map((b) => b.id), ['other']);
});
```

- [ ] **Step 2: 실패 확인** — `npx tsx --test tests/nous.test.ts` → careers FAIL.
- [ ] **Step 3: `careers.ts` 구현**.
- [ ] **Step 4: 통과 확인** — 전체 PASS.
- [ ] **Step 5: Commit** — `연구실 출신 진로 분류·집계 모듈 추가`

### Task 4: 그래픽 3종

**Files:**
- Create: `src/components/nous/ResearchMap.astro`, `src/components/nous/MarketChart.astro`, `src/components/nous/CareersChart.astro`

**Interfaces:**
- Consumes: `tallyCareers`(Task 3), `getCollection('members')`.
- Produces: Props 없는 컴포넌트 3개. 각 루트는 `<figure>`이고 `<h3>` 제목, 시각 SVG(`aria-hidden="true"`), 텍스트 요약(sr-only `<p>` — 그래픽의 모든 수치·관계를 문장으로), `<figcaption>`(출처).

- [ ] **Step 1: `ResearchMap.astro`** — 스펙 §5-1. 데스크톱 가로 3단(도구 3 → 원자 격자 원 "원자 단위 원인 규명" → 분야 4), 640px 이하 세로 흐름(SVG 2벌을 `hidden sm:block`/`sm:hidden`으로 두거나 viewBox 하나에 세로 배치 — 기준은 실제 렌더 글자 11px 이상). sr-only 요약 "연구실은 소재를 합성하지 않고, 수차보정 STEM·전자분광·머신러닝으로 AI 반도체 소재(HfO₂ 강유전체, 2D 반도체)·수소 연료전지·촉매·태양전지 소재의 물성 원인을 원자 단위에서 규명합니다." figcaption "근거: 연구실 Research 주제".
- [ ] **Step 2: `MarketChart.astro`** — 스펙 §5-2 값·문구 그대로. 막대 위 값 "537"…"1,590"(억 달러), x축 연도, 2024–2028 빗금 패턴(`<pattern>` id는 컴포넌트 고유 접두사), 2023→2028 곡선 화살표 + "연평균 +24.3%". sr-only 요약에 6개 값과 "2023년은 실적, 2024년 이후는 2024년 4월 시점 전망".
- [ ] **Step 3: `CareersChart.astro`** — frontmatter에서 alumni의 `{ role, currentAffiliation }` → `tallyCareers`. 스펙 §5-3 표기. 범주 행 = 라벨 + 아래 예시(작은 글자) + 누적 막대 + "{합}명". 범례 "학위 졸업 {degree}명 · 연구교수·박사후·연구원 {staff}명". 각주 연도는 `span`.
- [ ] **Step 4: 확인** — `npm run check` 0 errors. 시각 확인은 Task 5 이후 모달에서.
- [ ] **Step 5: Commit** — `노스 모달용 연구 지도·AI 반도체 시장·진로 그래픽 추가`

### Task 5: 모달

**Files:**
- Create: `src/components/nous/NousModal.astro`

**Interfaces:**
- Consumes: Task 1–4 전부.
- Produces: 페이지에 `<NousModal />` 1회 → 문서 안 모든 `[data-nous-open]` 클릭으로 열림. FLIP 출발점 = `trigger.closest('[data-nous-card]')?.querySelector('[data-nous-thumb]')`(없으면 트리거 rect).

- [ ] **Step 1: 마크업** — 스펙 §4-2 구조: `<dialog id="nous-dialog" lang="ko" aria-labelledby aria-describedby data-pagefind-ignore>` 안에 상단(모바일 바)/좌 열(사진 래퍼 `.nous-glow` > `<Image>` widths [480] · 썸네일과 같은 변형, 이름, 고지문, 재생 버튼 `autofocus`, range, 시간), 스크롤러(`<ol lang="en">` 문단 5 + 문단 2·3·4 뒤에 `<li class="nous-graphic" data-graphic="research|market|careers" inert>` 그래픽), 하단 바(메일 줄 + CTA `inert`), `role="status"` 빈 영역, 오류 `<p role="alert" hidden>`, X 버튼, `<audio data-nous-media preload="none" src={VOICE.src}>`. 문단 `<li>` = 시각 버튼(`formatClock(start)`, `aria-label="0분 35초부터 듣기"`) + 영어 `<p>` + 한국어 `<p lang="ko">`.
- [ ] **Step 2: 스타일** — 스펙 §4-2 레이아웃·대비·숨김 상태·잠금(`html:has(#nous-dialog[open])`)·`overscroll-behavior:contain`. 글로우 `.nous-glow { box-shadow: 0 0 0 calc(var(--amp,0)*12px) rgb(204 120 92 / calc(.08 + var(--amp,0)*.22)) }`. reduced-motion: 전환 끄고 `.is-playing .nous-glow { outline: 2px solid var(--color-coral) }`.
- [ ] **Step 3: 스크립트 — 동작 계약** (스펙 §4-2 그대로)
  - 클릭 위임 `[data-nous-open]` → `lastTrigger` 저장 → 초기화 → `media.play()` 동기 호출(`.catch(e => e.name !== 'AbortError' && 버튼 '재생')`) → 썸네일 rect 측정 → `showModal()` → FLIP 고스트(WAAPI, `fill` 없음, `finished` 후 제거). 소리 나는 다른 미디어 `pause()`.
  - `play`→`.is-playing`·버튼 "일시정지"·rAF 시작 / `pause`·`ended`→해제·버튼 "재생"·rAF 중지(`ended`는 CTA 펼침·status 문구·그래픽 전부 표시).
  - rAF 1프레임: `t = media.currentTime` → `activeParagraph`(바뀔 때만 DOM·자동 스크롤) → `visibleGraphics`(새로 보일 것만 `inert` 해제·클래스 제거) → `ctaExpanded` → `--amp`(목표가 크면 즉시, 작으면 `prev*0.82` 감쇠, 목표 = `ampAt(...)`) → range·시간(스크러빙 중 제외, valuetext는 초 바뀔 때만).
  - 정지 중 `seeked`·`timeupdate`도 같은 갱신 함수 1회 호출(`--amp`=0).
  - range `pointerdown` 스크러빙 시작, `input`→`currentTime`, `change` 스크러빙 종료. keydown ←→ ±5, PageUp/Down ±10, Home/End.
  - 자동 스크롤: 스크롤러 `scrollTo({ top: li.offsetTop - scroller.clientHeight/4 })`, `wheel`·`touchstart`·`keydown`(스크롤러 포커스) 후 5초간 생략.
  - `error` → alert 문구(텍스트 재주입).
  - X → `dialog.close()`. 백드롭: `pointerdown.target===dialog && click.target===dialog`일 때만 `close()`. `close` 이벤트 = 정리 단일 지점(스펙 §4-2 닫기).
  - `loadedmetadata` → range `max = duration`.
- [ ] **Step 4: 확인** — `npm run check` 0 errors.
- [ ] **Step 5: Commit** — `노스 소개 모달(음성·영한 자막·그래픽·상담 안내) 추가`

### Task 6: People 카드

**Files:**
- Modify: `src/pages/people/index.astro` (306행 PI `</section>` 뒤 섹션 삽입, `</BaseLayout>` 직전 `<NousModal />`)

**Interfaces:**
- Consumes: `NOUS`, `VOICE`(Task 2), `NousModal`(Task 5), 포트레이트.

- [ ] **Step 1: 섹션·카드** — 제목 마크업은 311행 클래스 그대로 "Lab Assistant"(카운트 없음). `<ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">` 안 `<li data-nous-card class="lift-card comet-card rounded-lg border border-cream-300 p-6">` 1개(`comet-card`가 이미 `position:relative`). 내용·버튼은 스펙 §4-1 People 카드. 사진 = `<Image>` widths [240,480] `w-24` 3:4 `data-nous-thumb` `alt=""` + 좌상단 AI 칩(absolute). 버튼 `::after` stretched, 포커스 링은 `:focus-visible::after` 아웃라인으로 카드 전체.
- [ ] **Step 2: 확인** — `npm run check`; `npm run dev`로 /people/ 카드 표시·카드 아무 곳 클릭 시 모달·Tab 정지 1회.
- [ ] **Step 3: Commit** — `People 페이지에 노스 Lab Assistant 카드 추가`

### Task 7: 메인 카드

**Files:**
- Create: `src/components/nous/NousHomeCard.astro`
- Modify: `src/pages/index.astro` (350–358행 오른쪽 열 `<div>` → `<div class="flex flex-col gap-5">`, RecruitingMedia 아래 `<NousHomeCard />`; `</BaseLayout>` 직전 `<NousModal />`)

**Interfaces:**
- Consumes: `NOUS`, `VOICE`, `NousModal`, 포트레이트.

- [ ] **Step 1: 카드** — 스펙 §4-1 메인 카드. `<button type="button" data-nous-open data-nous-card aria-haspopup="dialog">`, 내부 `<span>`만, 썸네일 80px `data-nous-thumb` `alt=""` + AI 칩, 배경 `bg-cream/80 border border-cream-400/60 rounded-lg lift-card`, 글자 대비 4.5:1 이상.
- [ ] **Step 2: 확인** — `npm run check`; dev 서버 메인 데스크톱(오른쪽 열 위 영상·아래 카드)·390px(텍스트 → 영상 → 카드) 스크린샷.
- [ ] **Step 3: Commit** — `메인 모집 섹션에 노스 소개 카드 추가`

### Task 8: 전체 검증·기록

**Files:**
- Modify: `checklist.md`, `context-notes.md`

- [ ] **Step 1:** `npx tsx --test tests/nous.test.ts` → 전부 PASS.
- [ ] **Step 2:** `npm run check` → 0 errors, 0 warnings.
- [ ] **Step 3:** `npm run build` → 성공. `dist/nous/intro.mp3` 존재, pagefind 색인 페이지 수 변경 전과 동일, `dist/index.html`·`dist/people/index.html`에 `id="nous-dialog"` 각 1개.
- [ ] **Step 4: Playwright 실측** (`npm run preview`, Chromium + WebKit, 1280×800 · 390×844, /·/people/ 각각) — Review Focus 1–5 전부 + 아래.
  - 열기 직후 `media.paused===false`, `document.activeElement`=재생 버튼.
  - `currentTime=10`→문단2·연구 지도 / `=40`→문단3·시장 / `=60`→문단4·진로 / `=20`(되감기)→문단2, 그래픽 3개 유지 / `=70`→CTA 펼침·CTA 링크 Tab 도달 / 그 전엔 CTA·숨은 그래픽 링크에 Tab 미도달.
  - 문단 시각 버튼 클릭 → 해당 시각.
  - `currentTime=79` → `ended` → status 문구.
  - Esc → `paused===true`, `currentTime===0`, 포커스=트리거. 재열기 → 초기 상태.
  - 열자마자 닫기 → 오류 문구 없음. `/nous/intro.mp3` route 404 → 오류 문구.
  - 390px: `scrollWidth===innerWidth`(열림·닫힘), 문단 3 시점에 시장 그래픽 `getBoundingClientRect()`가 뷰포트 안.
  - `emulateMedia({ reducedMotion: 'reduce' })` → FLIP 고스트 미생성.
  - axe-core(CDN `axe.min.js` 주입) — 모달 닫힘, 열림(0초), 열림(75초) 세 상태 violations 0.
  - 스크린샷 4장(두 페이지 × 두 폭, 모달 60초 상태) 눈 확인.
- [ ] **Step 5:** Lighthouse(`scripts/lighthouse-audit.mjs` 방식) 홈·People — a11y·SEO 100, perf가 변경 전 대비 −3점 이내.
- [ ] **Step 6:** checklist 체크, context-notes에 실측 결과와 **사용자에게 넘길 일**(스펙 §9) 기록.
- [ ] **Step 7: Commit** — `노스 카드 검증 결과를 checklist·context-notes에 반영`
