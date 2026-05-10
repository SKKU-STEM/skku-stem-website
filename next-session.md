# Next session — Research themes (연구 주제) 섹션 추가

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)에 /research 페이지의 "연구 주제 (group themes / projects)" 섹션을 추가하자.

## 현재까지 (HEAD: 8336017, 2026-05-11)

- Stage 5.2 (Sveltia CMS) + Pagefind 검색 UI까지 라이브 반영 완료. 9 컬렉션 CMS 편집, Header 돋보기/Ctrl+K/'/' 검색.
- /research는 현재 highlight 타임라인만 렌더 (역연대기 28 entries, src/content/research-highlights/*.md). 그 위에 얹을 "연구 그룹의 thrust 영역" 소개가 비어 있음.

## 무엇을 만드는가

PRD §1 Project 개요 한 줄("Aberration-corrected STEM + 전자분광(EELS/EDX) + 4D-STEM + electron tomography + ML/DL 융합으로 에너지 소재의 원자 단위 구조·화학 분석")을 풀어낸 **4~6개 연구 주제 카드**. 각 카드는 제목 + 2~4문장 설명 + 대표 figure(선택) + 관련 highlight/publication 링크(선택).

기존 28 highlights에서 추출되는 자연스러운 클러스터 후보:
1. **STEM-EELS chemical / valence / oxygen-vacancy mapping** — 배터리·연료전지·고체전해질 (≈10건)
2. **4D-STEM domain & strain mapping** — perovskite solar cell, HfO2 ferroelectric (≈4건)
3. **Electron tomography (3D)** — Li-ion battery, PEM fuel cell, sparse-section DL (≈4건)
4. **ML/DL for electron microscopy** — defect quantification, attention U-Net, hybrid crystallography (≈4건)
5. **Cu thin-film growth & oxidation resistance** — single-crystal Cu, atomic-scale mechanism (≈4건)
6. (선택) **Ferroelectric oxides & polarization** — HfO2 doping, ion-enhanced polarization (≈2건)

위 클러스터는 어디까지나 archive 분류 — 실제 사이트에서 보여줄 thrust는 PI가 미래지향적으로 재정의해야 함 (예: "ML-driven atomic-scale chemistry" 같은 묶음). **사용자와 합의 먼저.**

## 사용자와 결정할 것 (코딩 전)

1. **배치**: (a) /research 페이지 상단에 themes 섹션, 아래에 timeline 유지 (b) /research/themes 별도 sub-page, /research는 timeline 그대로 (c) /research에서 themes로 메인 교체, timeline은 /research/highlights로 이동
2. **데이터 소스**:
   - (a) `src/data/research-themes.ts` 하드코딩 (5개 내외라 CMS 오버킬, PI가 직접 수정 거의 안 함)
   - (b) Content collection `research-themes/` (.md per theme) + content.config.ts 스키마 + Sveltia CMS folder collection 추가 → 일관성·CMS 편집 가능, 단 컬렉션 1개·CMS 설정·index 페이지 모두 손봐야 함
3. **테마 정의 작성 방식**: (a) 사용자가 직접 4~6개 제목+설명을 줌 (b) 위 archive 클러스터 후보를 사용자가 골라/병합/재명명 (c) Claude가 PI 페이지 bio·publications·highlights를 읽어 초안 5개를 제시 → 사용자가 가위질
4. **카드 시각**: (a) 텍스트 카드만 (제목 + 설명 + 태그) (b) 텍스트 + 대표 figure (research highlights에서 재사용 vs 신규 업로드) (c) 텍스트 + 작은 아이콘
5. **highlights와의 연결**: (a) 카드에 "관련 highlights →" 링크/태그로 연결 (b) 단순히 본문에 inline 언급만 (c) 연결 없음

## 구현 (결정 후)

- 배치 (a) 또는 (c) → `src/pages/research.astro` 수정 + 새 `<ResearchThemeCard>` 컴포넌트 (또는 인라인)
- 데이터 (b) 채택 시 `src/content.config.ts`에 `researchThemes` collection 추가 + `src/content/research-themes/<slug>.md` 생성 + `public/admin/config.yml`에 folder collection 등록
- 카드 figure는 기존 `src/assets/research/*` 재사용 가능 (`getCollection('research-highlights')`에서 image 매핑 lookup), 신규 figure는 `src/assets/research/themes/`에 분리하는 것도 옵션
- 색/타이포는 기존 토큰 (cream/coral/Inter/Newsreader)만 사용 — PRD §3.5 디자인 원칙 준수

## 검증

- `npm run check` (타입) → `npm run build` (빌드 + Pagefind 인덱스에 새 텍스트 자동 편입) → `npm run preview`
- Pagefind 검색에서 새 theme 키워드 (예: "tomography", "4D-STEM") 결과에 themes 섹션 페이지가 떠야 함
- /admin (Sveltia CMS) — 컬렉션 추가했다면 폼 편집·저장 round-trip 확인
- 모바일 viewport 카드 그리드 reflow 확인

## 알아둘 것

- /research의 highlight timeline은 그대로 두는 것이 안전 (28 entries, 연도별 sticky grid가 잘 동작 중)
- "Research themes" 섹션은 PRD §5.2에 명시되어 있지 않음 — 새 섹션 추가하면 PRD §5.2 한 줄 갱신 권장
- CMS 컬렉션 추가 시 v1 collection 번호가 9 → 10. 기존 컬렉션 형식과 맞추려면 ymlfile 끝 collections 배열에 항목 추가 + glob loader 등록 + 스키마 정의가 모두 짝을 맞춰야 함 (context-notes.md §의 CMS 설계 절 참고)

## 우선 확인할 것

- 작업 시작 전 PRD.md §5.2, checklist.md "- [ ] Research — 연구 주제" 라인 주변, src/pages/research.astro 현재 구조 훑기
- 위 5개 결정 사항을 사용자에게 단답형으로 묻고 합의된 후 코딩
- 첫 push 전 `npm run check` + `npm run build` + `npm run preview`로 실 렌더 확인
```
