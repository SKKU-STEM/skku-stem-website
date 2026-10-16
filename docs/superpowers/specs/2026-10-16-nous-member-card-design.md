# 노스(Nous) AI 연구보조원 카드 — 설계

작성 2026-10-16, 개정 2026-10-17(전문가 6인 감사 반영 + 원고 v2·그래픽 3종 결정). 원 요청: `nous_member_card/작업지시서.md` (노스 작성, 2026-10-15). 이 문서가 지시서보다 우선한다. §11의 "제 판단" 항목은 사용자에게 보고한 뒤 진행한다.

## 1. 의도

연구실 조인을 고민하는 학생이 사이트에서 "노스"를 누르면 짧은 영어 음성 소개를 듣고 김영민 교수님께 메일로 상담을 요청하도록 이끈다. 소개의 핵심 메시지(사용자 2026-10-17): **이 연구실은 합성·제조를 하지 않고 STEM 분석과 머신러닝만 전문으로 한다. AI 반도체·수소·촉매·태양광 소재의 물성 원인을 원자 단위에서 규명하는 이 능력이 고성능 신소재 연구에 필수이므로 학생들의 진출 전망이 밝다.**

노스는 AI이고 사진이 실사처럼 보이므로 **방문자가 실제 구성원으로 오해하지 않게 AI임을 분명히 표시**하는 것이 전제다.

## 2. 목표 · 비목표 · 반목표

목표
- People 페이지와 메인 "Now recruiting" 섹션 두 곳에 진입점, 둘 다 같은 모달.
- 모달 = 사진 떠오름 + 음성 + 진폭 연동 글로우 + 영·한 문단 자막 + 문단별 그래픽 3종 + 상담 CTA.
- 음성 교체(원고 v2 재생성)가 파일·시각·자막 데이터 교체만으로 끝나는 구조.

비목표: 실시간 AI 채팅(Phase 2 — 견적 문서만 별도), 입모양·립싱크 영상, 한국어 음성, CMS 편집.

반목표 (돌아가도 실패)
- 노스가 사람 멤버처럼 보이는 것. AI 표시가 **사진 위**에서 빠지면 실패.
- 사실과 다른 수치. 제공 `chart_*.png`는 쓰지 않는다.
- 첫 로드가 무거워지는 것(음성은 모달을 열 때만), Lighthouse a11y/SEO 100 하락.

## 3. 사용자가 정한 것

| 항목 | 결정 |
|---|---|
| 진로 그래픽 | Alumni 컬렉션 빌드 시 자동 집계. 대상 = **연구실 출신 16명**, 학위 졸업 / 연구직(연구교수·박사후·연구원) 구분 |
| AI 반도체 그래픽 | KISDI 원문 **시장 규모** 막대(비중 아님) |
| 연구 그래픽 | 원고 2문단용 "보고 설명한다" 연구 지도 추가 |
| People 배치 | PI 카드 바로 아래 "Lab Assistant" 섹션, 카드 1장 |
| 메인 배치 | 모집 섹션 오른쪽 열 위 = 기존 영상, 아래 = 노스 카드 |
| 음성 | 지금 음성(v1)으로 구현, 배포(push)는 보류. 원고 v2(`docs/nous-script-v2.md`)로 노스가 재생성하면 교체 |

## 4. 동작 명세

### 4-1. 진입점
공통: 사진 위 좌상단에 `AI` 칩(`bg-coral-700 text-cream`, mono 10–11px). 스피커 아이콘 SVG(`aria-hidden`) + 길이 표기. `aria-haspopup="dialog"`. 썸네일 `alt=""`(이름은 텍스트가 준다). 썸네일 요소에 `data-nous-thumb`, 카드 루트에 `data-nous-card`.

- **People 카드**(`lang="en"` 페이지): 기존 멤버 카드 골격. 텍스트 `노스`(lang ko) / `Nous` / mono `AI Research Assistant` / `AI-generated portrait & voice`. 하단 버튼 하나 `Listen to lab intro · 1:19`(+ sr-only "English audio, 1 min 19 s")가 `::after{inset:0}`로 카드 전체를 클릭 영역으로 덮는다. 같은 동작의 버튼을 두 개 두지 않는다.
- **메인 카드**(`lang="ko"` 섹션): 카드 전체가 `<button data-nous-open>`, 내부는 `<span>`만. 3:4 썸네일(80px) + "AI 연구보조원 노스가 연구실을 소개합니다" + "연구실 소개 듣기 · 영어 음성 1:19".

### 4-2. 모달
- 네이티브 `<dialog lang="ko" data-pagefind-ignore>`. 영어 부분(원고, `Nous`, `AI Research Assistant`)에만 `lang="en"`. `aria-labelledby` = 제목("노스 · Nous — AI 연구보조원"), `aria-describedby` = AI 고지문.
- **레이아웃**
  - 데스크톱(≥768px): 좌 열(고정) = 큰 사진, 이름, AI 고지문, 재생 컨트롤. 우 열(스크롤) = 자막-그래픽 흐름. 하단 바 = 메일 줄/CTA.
  - 모바일: 상단 고정 바(작은 사진 약 120px 폭·재생·닫기) / 가운데 스크롤 = 자막-그래픽 흐름 / 하단 고정 바 = 메일 줄/CTA. 모달은 풀스크린 시트(100dvh), 모달 바깥 스크롤 없음.
  - **자막-그래픽 흐름** = 문단 1, 문단 2, [연구 지도], 문단 3, [시장 규모], 문단 4, [진로], 문단 5. 각 그래픽은 해당 문단이 시작될 때 나타난다(자리는 처음부터 `aspect-ratio`로 확보 — 레이아웃 밀림 없음).
- **열기**: 클릭 핸들러 안에서 **`audio.play()`를 동기로 가장 먼저** 호출(iOS 제스처 유지) → 트리거 썸네일 rect를 `showModal()` 전에 측정 → `showModal()` → 썸네일 `currentSrc`로 만든 `position:fixed` 고스트 이미지를 모달 사진 자리까지 FLIP(350ms, `cubic-bezier(.2,.8,.2,1)`), 끝나면 제거. reduced-motion이면 FLIP 생략(JS `matchMedia`). 첫 포커스 = 재생/일시정지 버튼(`autofocus`). 페이지의 다른 미디어 중 **소리 나는 것**(`!muted && !paused`)은 일시정지.
- **말하는 모션**: 재생 중 rAF 루프가 미리 계산한 20fps 진폭 엔벌로프(§6)를 읽어 사진 **바깥 래퍼**의 `--amp`(0–1, 빠른 attack · 약 120ms release)를 갱신 → 코랄 글로우 링(box-shadow spread 0–12px, opacity). scale 없음. 말 쉼에서는 잦아든다. reduced-motion이면 재생 중 정적 코랄 테두리.
- **컨트롤**: 재생/일시정지 버튼(보이는 텍스트 "재생"/"일시정지" 교체, 아이콘 `aria-hidden`, 44px 이상). 진행 막대 `<input type="range" step="1">`, `max` = `loadedmetadata`의 `duration`(대체값 상수), `aria-valuetext="0분 35초 / 1분 19초"`(초가 바뀔 때만 갱신), 드래그 중(`pointerdown`~`change`)엔 재생 위치로 덮어쓰지 않음, ←→ ±5s · PageUp/Down ±10s · Home/End. 옆 "0:35 / 1:19" 텍스트는 `aria-hidden`. 각 문단 옆 시각 버튼("0:35")을 누르면 그 문단으로 이동.
- **자막**: `<ol lang="en">`의 각 문단 = 영어 원문 + 그 아래 작은 한국어 번역(`lang="ko"`). 활성 문단 `aria-current="true"`, 진한 글자 + 코랄 왼쪽 테두리 3px. 비활성 문단 `text-ink/65` 이상(대비 4.5:1). 판정은 rAF 루프(재생 중), 정지 중엔 `timeupdate`/`seeked`. 자동 스크롤은 스크롤러 `scrollTop`을 직접 계산(활성 문단을 위쪽 1/4 지점), `scrollIntoView` 금지. 사용자가 휠·터치·키로 스크롤러를 건드리면 5초간 자동 스크롤 중지. 스크롤러는 `tabindex="0" role="region" aria-label="원고와 그래픽"`. `aria-live` 쓰지 않음.
- **CTA**: 하단 바에 처음부터 메일 줄("김영민 교수님께 상담 메일 보내기 · youngmk@skku.edu"). 문단 5 시작(음성이 메일을 말하는 시점)과 `ended`에 전체 CTA로 펼침.
  ```
  연구실 합류에 관심이 있으신가요?
  김영민 교수님(Prof. Young-Min Kim)께 메일로 상담을 요청해 보세요.
  궁금한 점은 무엇이든 편하게 물어보세요.
  [메일 SVG] youngmk@skku.edu
  ```
  mailto에 제목·본문 틀(§5-4). `ended` 때 `role="status"` 영역에 "재생이 끝났습니다. 아래에 상담 안내가 있습니다." 1회.
- **숨김 상태**: 아직 안 나온 그래픽·펼치기 전 CTA는 `opacity:0; visibility:hidden` + `inert`. 보일 때 셋을 함께 해제(0.5s 전환).
- **오류**: `audio` `error` → `role="alert"` 문구 "음성을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."(표시할 때 텍스트를 다시 넣음), 버튼 "재생". 닫기로 인한 `AbortError`는 오류로 표시하지 않음.
- **닫기**: X(40px)·백드롭(`pointerdown`과 `click` 둘 다 dialog 자신일 때)·Esc·안드로이드 뒤로가기 → 모두 `close` 이벤트 **한 곳**에서 정리: `pause()`, `currentTime=0`, 자막·그래픽·CTA·오류 초기화, rAF 중지, 포커스를 연 트리거로 복귀(트리거는 클릭 위임에서 저장, `document.activeElement` 의존 금지).
- **스크롤 잠금**: CSS `html:has(#nous-dialog[open]){overflow:hidden; scrollbar-gutter:stable}`, 모달 스크롤러 `overscroll-behavior:contain`.
- **AI 고지**: 사진 바로 아래 본문 크기. "노스는 실제 연구실 구성원이 아닌 AI 연구보조원입니다. 사진과 음성은 AI로 만들었습니다." + `lang="en"` "Nous is an AI assistant, not a real person. Portrait and voice are AI-generated." 모달 사진 alt "AI로 생성한 가상 인물 이미지 – 노스".

## 5. 그래픽 3종 + 메일 틀

모두 빌드 시 렌더되는 인라인 SVG, 색은 `global.css` 토큰. 글자는 ink 계열(ink/70 이상), 코랄은 선·막대·도형에만. 그래픽 요소 대비 3:1 이상(coral #CC785C는 cream 위 3.1:1 — 최소선, coral-400은 쓰지 않음). 각 그래픽 = `<figure>` + `<h3>` 제목 + 시각 SVG(`aria-hidden`) + 화면에 보이거나 sr-only인 텍스트 요약(`aria-describedby`로 연결 불필요 — figure 안 텍스트로 충분) + `<figcaption>` 출처. viewBox는 모바일 실제 폭(약 340px)에서 글자가 11px 아래로 줄지 않게 잡는다.

### 5-1. 연구 지도 (문단 2)
제목 "합성 대신, 원자를 보고 설명합니다". 좌: 도구 3개(수차보정 STEM / 전자분광 EELS·EDX / 머신러닝) → 가운데: "원자 단위 원인 규명"(원자 격자 모티프) → 우: 분야 4개(AI 반도체 소재 — HfO₂ 강유전체·2D 반도체 / 수소 연료전지 / 촉매 / 태양전지). 모바일에선 위→아래 흐름. 근거: Research themes 01–06(§ 원고 v2 근거표).

### 5-2. AI 반도체 시장 규모 (문단 3)
- 출처: KISDI Perspectives 2024 No.1(24-07-01) 그림 4, 원자료 Gartner(2024.4). 원문 PDF 대조 완료.
- 값(백만 달러 → 화면은 억 달러, 반올림): 2023 53,662(537) · 2024 71,252(713) · 2025 91,955(920) · 2026 116,269(1,163) · 2027 141,397(1,414) · 2028 159,022(1,590).
- 제목 "글로벌 AI 반도체 시장 규모", 부제 "2023→2028년 연평균 24.3% 성장 전망(매출액 기준)". 2023 = 진한 막대(coral-700), 2024–2028 = 빗금 막대(coral-600) + "전망" 라벨. 2023→2028을 잇는 곡선 화살표에 "연평균 +24.3%".
- 각주 "출처: 정보통신정책연구원(KISDI), KISDI Perspectives 2024 No.1(원자료 Gartner, 2024.4). 2024년 이후는 2024년 4월 시점의 전망치입니다." + "원문 보기" 링크(`https://www.kisdi.re.kr/bbs/view.do?bbsSn=114496&key=m2101113055776`, 새 탭).

### 5-3. 연구실 출신 진로 (문단 4)
- 소스: `getCollection('members')` 중 `section === 'alumni'`. 현재 소속 = `currentAffiliation`의 `;` 앞 첫 항목. 빈 값은 제외.
- 구분: `role`이 `/Research Professor|Postdoc|Researcher/i`면 연구직, 아니면 학위 졸업(Ph.D.·Master's·Integrated 등).
- 범주(표 순서로 판정, 단어 경계 매칭)

| id | 범주명 | 예시(화면) | 키워드 | 2026-10-16 실측 학위/연구직 |
|---|---|---|---|---|
| maker | 반도체·배터리 제조사 | 삼성전자 · SK하이닉스 · LG에너지솔루션 | Samsung, SK ?Hynix, LG Energy Solution | 5 / 1 |
| equipment | 반도체 장비·소재 기업 | 램리서치 · 세메스 · 이엔에프테크놀로지 | Lam Research, SEMES, ENF | 3 / 1 |
| institute | 국내 연구기관 | KIST · KRISS · NNFC | KIST, KRISS, NNFC, National Nanofab | 2 / 1 |
| academia | 대학 | KAIST · 동신대학교 | KAIST, Universit | 1 / 1 |
| overseas | 해외 연구기관 | 미국 오크리지 국립연구소(ORNL) | Oak Ridge, ORNL | 1 / 0 |
| other | 기타 | — | (없음) | 0 / 0 → 막대 생략 |

  합계 16 = 학위 12 + 연구직 4.
- 표기: 가로 누적 막대(학위 = coral-700, 연구직 = coral + 빗금), 막대 끝 "{합}명". 제목 "연구실 출신 {N}명의 현재 소속", 범례 "학위 졸업 {d}명 · 연구교수·박사후·연구원 {s}명". 각주 "출처: People 페이지 Alumni 명단({minYear}–{maxYear} 재학·재직), 자동 집계". 연도는 `role` 문자열의 4자리 연도 최소·최대.

### 5-4. mailto 틀
`mailto:youngmk@skku.edu?subject=…&body=…` (encodeURIComponent). 제목 `[SKKU-STEM 연구실 문의] 이름 / 학과 / 학년`. 본문:
```
교수님 안녕하세요.

이름:
소속(학과·학년):
관심 과정(학부연구생 / 석박통합 / 석사 / 박사):
관심 연구 주제:
궁금한 점:
```

## 6. 자산과 음성 데이터

| 원본 | 사이트 위치 | 처리 |
|---|---|---|
| `nous_portrait.png` 1536×2048 rgb24 | `src/assets/nous/portrait.jpg` | 1152×1536 JPG, 우하단에 "AI-generated" 작은 글자 새김(파일이 퍼져도 표시 유지). 썸네일·모달 같은 webp 변형(480w) 공유 |
| `nous_intro_voice.mp3` 80.20s, MP3 64k 48kHz mono, −23.8 LUFS | `public/nous/intro.mp3` | **한 번의 인코딩**: 79.2s 컷(끝의 잘린 "We'd-" 제거) + 앞 0.3s 무음 + 약 −19 LUFS 정규화 + 리미터(TP ≤ −1.5 dBTP). 결과 약 79.5s |
| `nous_intro_voice.ogg` | 사용 안 함 | Opus 711KB > mp3 642KB, 호환성 이득 없음 |
| `chart_*.png` | 사용 안 함 | §5 |

**v1 음성 대조**: faster-whisper 받아쓰기로 작업지시서 §5 원고와 문구 일치 확인. 단 원고 자체에 사실 문제 3곳(1nm 미만 공정, 로직 소자 연구 범위, 출처 없는 수요 주장) — v2 원고에서 해결, v1은 재생성 전까지 임시.

**문단 시작 시각(v1, +0.3s 패딩 반영)**: 0 / 6.7 / 34.8 / 52.0 / 69.3 s (받아쓰기 구간 0.00/6.38/34.50/51.74/69.00 + 0.3).

**진폭 엔벌로프**: 가공된 mp3에서 20fps(50ms) RMS → −50…−15 dB를 0–9로 양자화한 문자열. 생성 스크립트로 만들어 커밋(음성 교체 시 재실행).

**음성 교체 절차(v2 도착 시)**: ① 같은 가공 명령 → ② 받아쓰기로 문단 시각 측정 → ③ 원고·번역·시각 상수 교체 → ④ 엔벌로프 재생성 → ⑤ 길이 표기 갱신. 코드 변경 없음.

## 7. 구조

- `src/components/nous/`: 데이터·로직 TS(노스 메타·음성 데이터, 엔벌로프(생성물), 진로 집계), Astro(모달, 메인 카드, 그래픽 3종).
- People 카드는 `people/index.astro`에 직접(`comet-card`가 그 파일 scoped 스타일).
- 노스는 CMS `members` 밖. 기존 People 섹션 카운트·정렬 무영향.
- 스크립트는 `[data-nous-media]`(HTMLMediaElement) 기준 — 나중에 립싱크 `<video>`로 바꿔도 마크업만 교체.

## 8. 제약

- Astro 5 + Tailwind 4 + TS strict. 새 의존성 없음(SVG 손작업, CSS/WAAPI, `node:test`+tsx).
- 검증: `npx tsx --test`, `npm run check` 0 errors, `npm run build`, Playwright 실측(데스크톱 1280·모바일 390, Chromium + WebKit), axe-core(CDN 주입, 모달 열림 전·후), Lighthouse(홈·People) a11y·SEO 100 유지, 가로 오버플로 0.
- 배포 후 확인(사용자): 실제 iPhone 재생 1회, Cloudflare에서 mp3 `Range` 요청 206.

## 9. 사용자에게 넘길 일 (코드 밖)

- 원고 v2로 노스에게 음성 재생성 요청(`docs/nous-script-v2.md` TTS 입력판).
- 홍보물 AI 표시 기준(「AI 기본법」 제31조 적용 여부)과 ElevenLabs·Higgsfield 약관의 기관 홍보 사용 가능 여부 확인.
- 음성·그래픽에 소속이 언급되는 졸업생에게 고지.
- 이름 표기 "노스" 유지 여부(음성 발음은 /nuːs/, 철학 용어 표기는 "누스").

## 10. 빌더 재량

간격·타이포 세부, 그래픽 도형 세부(§5 수치·문구는 고정), 엔벌로프 스무딩 계수.

## 11. 제 판단으로 정한 것

- AI 표시: 사진 위 칩 + 파일 워터마크 + 고지문 문구·위치, 모달 사진 alt.
- 한국어 번역 자막 병기, 문단 시각 버튼.
- 메일 줄 상시 노출 + 문단 5부터 CTA 펼침, mailto 틀.
- 음성 가공(정규화·앞 무음·ogg 제외), 진폭 연동 글로우.
- 진로 범주명 개정, 연구직 구분 규칙, 각주 기간 자동 산출.
- 진입점 문구("Listen to lab intro", "영어 음성"), People 카드 넷째 줄 "AI-generated portrait & voice".
- 소리 나는 다른 미디어 일시정지(YouTube iframe은 대상 아님 — 현재 recruiting.json은 음소거 mp4).
