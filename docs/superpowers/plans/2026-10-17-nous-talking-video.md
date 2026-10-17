# 노스 말하는 영상 · 한국어 기본/영어 선택 — 구현 계획

**Spec:** `docs/superpowers/specs/2026-10-17-nous-talking-video-design.md` (1차 설계 `2026-10-16-nous-member-card-design.md` 위에 얹는다)

**Goal:** 노스 모달의 사진을 립싱크 영상으로 바꾸고, 기본 한국어 음성·영상에 영어 선택을 더한다.

## Global Constraints
- Astro 5 / Tailwind 4 / TS strict, 기존 모달 구조·접근성(포커스, Esc, aria) 유지
- 영상: `public/nous/intro-{ko,en}.mp4` H.264 480×640, AAC 모노, faststart, `preload="none"`, `playsinline`
- 기본 언어 `ko`, 열 때마다 `ko`
- 문단 5개·그래픽·CTA는 문단 번호 기준 공통, 시각만 언어별
- 개인 메일 노출 금지, 상담 메일은 youngmk@skku.edu

## Review Focus
1. 재생 중 언어 전환 → 같은 문단 시작부터 새 언어로 이어 재생, 그래픽·CTA 상태가 거꾸로 접히지 않음
2. 정지 상태에서 언어 전환 → 정지 유지, 시각 표시·슬라이더 최대값 갱신
3. 전환 직후 이전 언어의 `loadedmetadata`/`timeupdate`가 늦게 와도 새 언어 길이로 덮어쓰지 않음
4. iOS Safari: `playsinline` 없으면 전체화면으로 튐 — 속성 존재 확인
5. 영상 로드 실패 시 오류 문구와 재시도(1차 F4)가 영상에서도 동작

---

### Task 1: 데이터(`nous.ts`) 언어별 시각 + 단위 테스트
- `Lang`, `LANGS`, `DEFAULT_LANG='ko'`, `VOICES: Record<Lang,{src,duration,label,spoken}>`
- `PARAGRAPHS[i] = { start: Record<Lang,number>, en, ko }` — v2 원고, 시각 = 낭독 트랙 문단 시작(ko 0·6.16·28.56·56.64·76.88 / en 0·5.84·27.12·52.4·72.56)
- `activeParagraph(t, lang)`, `visibleGraphics(t, lang)`, `ctaExpanded(t, ended, lang)`, `paragraphStart(p, lang)`
- 테스트: 언어별 경계(예: ko 28.5→1, 28.6→2 / en 27.1→1, 27.2→2), CTA(ko 76.9, en 72.6), 전환 시각 `paragraphStart(activeParagraph(40,'ko'),'en') === 27.12`

### Task 2: 엔벌로프 언어별
- `scripts/nous-envelope.mjs`가 `public/nous/intro-{ko,en}.mp4` 두 개를 읽어 `ENVELOPES = { ko, en }` 작성

### Task 3: 자산
- `public/nous/intro-ko.mp4`, `intro-en.mp4` 추가, `intro.mp3` 삭제
- 포스터 `src/assets/nous/video-poster.jpg`(한국어 영상 첫 프레임 960×1280)

### Task 4: 모달
- `<Image>` → `<video data-nous-media playsinline preload="none" poster>`(FLIP 대상 = 영상)
- 언어 버튼 `[data-nous-lang]` 두 개, `aria-pressed`, 전환 규칙(Review Focus 1–3)
- 자막 순서: `.nd-shell[data-lang]`에 따라 말하는 언어가 위
- 문구: 안내·공개·오류

### Task 5: 카드 문구
- People "Watch lab intro · {ko label}", 메인 "연구실 소개 보기", 캡션 "한국어 음성 · 영어 선택 · {label}"

### Task 6: 검증
- `npm test`(nous), `npm run check`, `npm run build`
- Playwright: 1차 verify 갱신(시각값 언어별) + 언어 전환·영상 프레임 변화·playsinline 검사, Chromium·WebKit
- 기록: checklist §17-B, context-notes 17-B, `docs/nous-script-v2.md`에 한국어 낭독판
