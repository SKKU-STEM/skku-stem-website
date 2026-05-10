# Next session — Stage 5.2 (Decap CMS UI)

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)의 Stage 5.2를 진행하자.

## 현재까지 (HEAD: 5f43513)

- Stage 5.1(Astro Content Collections 마이그레이션) 완료, 이미 라이브(skkustem.org) 반영. src/data/*.ts → src/content/* (publications x4 JSON + news/members/research-highlights/facilities/gallery-events x5 .md 폴더, 총 9 컬렉션 / 404 entries). 페이지 10개는 모두 getCollection() 사용. npm run check 0/0/0, npm run build 통과. 라이브 검증 시 모든 페이지 200 + 데이터 카운트 일치(179/52/29/28/30/8/52/2 entries) 확인.
- 5.1 정리 후속: scripts/migrate-to-content.ts는 삭제(commit 503085e). src/data/* 사라진 후로 import가 깨져서 더 이상 실행 불가능했고, 변환 로직은 git f6fe020에 보존. Gallery 페이지의 "Google CDN 점선 슬롯 안내" 한 단락 제거(commit 5f43513).
- PRD.md §10.5의 steps 1~4 done. 남은 건 steps 5~8 = Decap CMS UI 도입.

## 이번 세션 범위 (PRD §10.5 steps 5~8)

1. GitHub OAuth App 생성 (사용자가 직접 https://github.com/settings/applications/new 에서 클릭, 결과 client_id / client_secret 받기)
2. Cloudflare Workers OAuth 프록시 배포 — Decap 공식 템플릿 활용. Workers 무료 티어로 호스팅. wrangler 설치 + 배포는 사용자가 직접 실행해야 할 수 있음
3. public/admin/index.html + public/admin/config.yml 작성 — config.yml은 9 컬렉션 모두 매핑 (publications 4개는 file collection, 나머지 5개는 folder collection)
4. astro.config.mjs / Cloudflare Pages 환경 변수 정리 (admin OAuth URL 등)
5. 빌드 + 배포 → /admin 접속 → GitHub 인증 → 한 entry 편집 테스트

## 알아둘 것

- 단위 결정: Publications 4개는 단일 JSON 파일에 array (Decap의 file collection으로 매핑), 나머지는 entry당 .md (folder collection). 결정 근거는 context-notes.md §11에.
- 9 컬렉션 스키마는 src/content.config.ts에 zod로 정의됨. Decap config.yml의 fields는 이 스키마와 1:1로 맞춰야 함 (특히 enum 값 — section: postdoc/phd/undergrad/alumni, news.category: paper/award/media/member/event/grant/lab, non-sci-patents.kind: non-sci/patent/book 등).
- Members 스키마는 통합 (현 멤버 + alumni). section 필드로 그룹 분리. order 필드로 표시 순서.
- 기존 사이트는 https://skkustem.org (Cloudflare Pages, GitHub SKKU-STEM/skku-stem-website 자동 배포). 변경 push하면 1~3분 내 반영.
- 멤버 사진은 현재 public/members/<INIT>.jpg를 photoPath 필드로 참조. CMS에서 새 멤버 추가 시 사진 업로드 경로를 어떻게 할지 결정 필요 (예: Decap의 media_folder를 public/members/로 두고 photoPath에 자동 채움).

## 우선 확인할 것

- 작업 시작 전 PRD.md §10, checklist.md Stage 5.2, context-notes.md §11 (특히 "11.7 다음 세션이 결정할 것" — pi-publications 통합 여부, photoPath/portrait 이중 경로 정리 등)을 읽어 사용자와 결정 사항을 합의한 뒤 진행.
- OAuth App / Workers 배포처럼 사용자 직접 실행이 필요한 단계는 미리 분리해서 명확히 안내.
- 첫 push까지 가기 전 npm run check + npm run build 둘 다 통과 확인 (5.1 때 한쪽만 돌려서 깨진 사례 있음).
```
