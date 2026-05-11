# Next session — PI 콘텐츠 TODO 일괄 채우기

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용. **PI 직접 결정 필요한 항목 다수** — Claude는 입력값을 받아 .md/.ts/.json에 반영.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)의 checklist.md에 남은 **TODO(content)** 항목을 PI와 함께 일괄 처리하자. 각 항목마다 (1) 의사결정/입력값을 PI에게 묻고 (2) 해당 파일에 반영, (3) 빌드·검증.

## 현재까지 (HEAD: 02fa90d, 2026-05-11)

- 사이트 기능적 완성 — Pagefind 검색, Sveltia CMS, Research Themes (6 thrust + auto-classification + per-theme 모달), 404, RSS, OG cards, 이미지 최적화, fontaine CLS 보정.
- Lighthouse a11y/best-practices/SEO 100, perf 87~99, CLS 모두 ≤ 0.106 (home은 0).
- 남은 건 콘텐츠 — 위 모든 마이그레이션이 placeholder/heuristic으로 끼워넣은 부분을 PI가 확정하는 작업.

## 처리할 TODO 인벤토리 (checklist.md L38–L85)

각 항목은 (a) PI에게 물을 질문, (b) 답을 받아 수정할 파일·필드, (c) 검증 방법 순.

### 1) Footer 외부 링크 4개 (checklist L38)
- a: 4개 슬롯 각각 실제 URL — 학과 / 학교 / GitHub / ORCID. 현재 placeholder.
- b: `src/components/Footer.astro` 의 link href 교체.
- c: 빌드 후 footer 링크 클릭 → 정상 이동.

### 2) 진짜 로고 SVG (L39)
- a: PI가 새 로고 파일 제공? → 받으면 `src/assets/logo.svg` 교체. 없으면 현 placeholder 유지 → 항목 deletion.
- b: `src/assets/logo.svg`, 그리고 `public/logo-mark.png` (mask용 심볼) 도 새 디자인이면 교체.
- c: Header 로고 / OG 카드 / favicon 모두 정상 렌더 확인.

### 3) Home highlight 3편 (L46)
- a: 현재 `src/data/publications-skku.ts`에서 `lead: true` 최신 3편 자동 추출 — 정확한지, 또는 PI가 다른 3편 강조하고 싶은지.
- b: 자동 추출 유지면 액션 없음. 수동 강조면 `src/pages/index.astro`의 highlights 로직 변경 또는 publications-skku.json에 `featured: true` 필드 추가.
- c: Home의 "Recent highlights" 카드 3개가 의도와 일치.

### 4) by-the-numbers 4개 수치 (L47)
- a: 현재 placeholder — 60+ pubs / 3 N/S / 2 OSS / 8 members. 정확한 값?
  - pubs: publications-skku 길이 (현재 ~179) — 자동 산출 가능
  - N/S (Nature/Science 1저자) - PI 확인 필요
  - OSS (open-source releases) - PI 확인
  - members - members collection 길이 (자동) 또는 active만
- b: `src/pages/index.astro`의 stat 카드 값 (자동값은 build-time 산출, 수동은 명시).
- c: Home stats 정확.

### 5) Research highlights 28편 figure (L54)
- a: 28개 highlight entry에 각각 대표 figure 필요. PI 한 번에 28개 업로드 가능? 또는 우선 important 3-5개부터?
- b: `src/assets/research/<slug>.{jpg,webp,png}` 업로드 (slug = highlight 파일명) → frontmatter `image: <slug>.jpg` 갱신. CMS에서도 가능.
- c: /research 타임라인의 4:3 figure 슬롯에 실제 이미지 노출.

### 6) PI Selected Publications DOI (L62)
- a: `src/content/publications/pi-selected.json` 의 24편(Microscopy 18 + AI 6) 각자 DOI URL. 현재 비어있음.
- b: 같은 JSON의 doi 필드 채우기. 자동: publications-skku.json에서 title 매칭으로 DOI 끌어올 수 있음 (Claude가 작업).
- c: /people/pi 의 Selected Publications 각 entry가 DOI 링크로 클릭 가능.

### 7) PI talks / patents / service 추가 (L63)
- a: 이전 사이트에 talks/patents/service 섹션이 있었는지 확인. PI가 데이터 제공 가능?
- b: 새 컬렉션 (`src/content/talks`, `src/content/service`)? 또는 PI 페이지 inline 섹션? 결정 후 schema + Sveltia CMS 등록.
- c: /people/pi에 새 섹션 노출 + CMS에서 편집 가능.

### 8) 정호현 (Jeong Ho-hyeon) 분류 (L64)
- a: MS course지만 이전 사이트는 "Ph.D. Candidates"에 위치. 유지 / phd→undergrad 이동 / ms 신규 enum 추가?
- b: `src/content/members/JHH.md` (또는 해당 init) section 필드 변경. enum 변경 시 `src/content.config.ts` + `public/admin/config.yml` 동기화.
- c: /people 의 분류 정확.

### 9) Lead authorship 검토 (L84)
- a: 휴리스틱(YK* corresponding) 으로 lead=true 매긴 분류 — 이전 사이트의 "청색 강조" 분류와 일치? PI가 검토.
- b: `src/content/publications/skku.json` 의 `lead` boolean 토글.
- c: 변경 후 home recent highlights / publications 페이지의 coral 강조 변경 확인.

### 10) 이미 정리됨
- L45 hero 그룹 사진: 2026group-spring.jpg 업로드 완료 → checklist 체크
- L61 PI 사진: YMK.jpg 업로드 완료 → checklist 체크
- L85 Presentations 마이그레이션 제외: 이미 결정 → checklist 정리

## 진행 방식 (제안)

1. PI 옆에 모니터 같이 보기 → 위 1~9 순서로 한 항목씩 함께 처리.
2. 각 항목: 질문 → 답변 → 파일 수정 → "다음" 외치고 진행.
3. 마지막에 한 번에 빌드·검증·커밋.
4. 콘텐츠 다 채운 뒤 라이브 배포 → PI 시선으로 한 번 더 훑기.

## 알아둘 것

- Sveltia CMS의 `/admin` 으로도 모든 항목 편집 가능. PI가 직접 채우는 게 편하면 안내. (특히 highlights image 업로드, members section 변경)
- DOI URL은 https://doi.org/... 형식으로 통일.
- 이미지 업로드는 src/assets/research/, src/assets/members/ (이미 webp 자동 변환 파이프라인).
- 빌드·푸시 후 Cloudflare Pages 1~3분 대기.

## 우선 확인할 것

- 작업 시작 전 checklist.md L38–L85 인벤토리 다시 점검 (새 TODO 추가됐는지).
- PI 가용성 확인 — 모든 항목 다 채우려면 1~2시간. 부분만 가능하면 1) 4) 6) 8) 우선 (즉답 가능 항목).
- 각 수정 후 npm run check → 마지막에 build → preview → push.
```
