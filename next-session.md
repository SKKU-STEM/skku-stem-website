# Next session — Polish pack (404 page + News RSS feed)

다음 세션 시작 시 아래 코드블록 안 텍스트를 그대로 붙여넣어 사용.

---

```
SKKU-STEM 웹사이트(C:\Users\mirag\Documents\Claude\Projects\skkustem)에 (1) 404 페이지와 (2) News RSS feed 두 개를 한 번에 추가하자. 둘 다 작고 독립적이라 한 세션에 같이 끝낼 수 있음.

## 현재까지 (HEAD: 933d9d6, 2026-05-11)

- Stage 5.2 Sveltia CMS, Pagefind 검색 UI, Research Themes(6 thrusts + per-theme 모달 + auto-classification) 모두 라이브 반영 완료.
- checklist.md에 남은 진짜 미완 항목: **404 페이지 / News RSS / i18n / OG 자동 생성 / Lighthouse**. 이번 세션은 앞 두 개.

## 1) 404 페이지

### 만들 것
`src/pages/404.astro` — BaseLayout 기반의 정적 404. 타입스크립트/콘텐츠 의존 없음. Cloudflare Pages는 dist/404.html이 있으면 자동으로 이를 fallback으로 사용한다 (별도 routing rule 불필요).

### 사용자와 결정
- **톤**: (a) 짧고 위트 있게 ("This page is not at atomic resolution.") (b) 정중하고 사무적 (c) 그냥 "Page not found"
- **CTA**: (a) Home으로 돌아가는 단일 버튼 (b) 주요 nav 링크 5~6개 카드형 (c) 검색창 임베드 (Pagefind UI 재사용)
- **그래픽**: (a) 텍스트만 (b) 기존 hero 패턴(에너지 지형 SVG) 변형 — 우물에 원자가 못 안착한 모습 (c) 단순 큰 "404" 텍스트

### 검증
- `npm run build` → `dist/404.html` 생성 확인
- `npm run preview` 후 임의 잘못된 URL (`/this-does-not-exist`) 접속 → 404 렌더 확인 (preview는 자동 fallback 안 할 수도 있음 — 이 경우 직접 `/404`로 접속)
- 라이브 배포 후 잘못된 URL 접속해서 헤더/푸터 + 디자인 토큰 정상 적용 확인

## 2) News RSS feed

### 만들 것
`src/pages/rss.xml.ts` — `@astrojs/rss` 패키지 추가 + News collection을 RSS 2.0 피드로 export. SEO·구독자용.

```bash
npm install @astrojs/rss
```

### 구현 (간단)
- `getCollection('news')` 로드 → date desc 정렬
- title / description / pubDate / link / category 매핑
- BaseLayout의 `<head>`에 `<link rel="alternate" type="application/rss+xml" title="SKKU-STEM Lab News" href="/rss.xml" />` 추가 (전체 페이지에서 발견 가능하게)

### 사용자와 결정
- **포함 항목 수**: (a) 전체 News (현재 8건) (b) 최신 N건 (예 20)
- **본문 내용**: (a) headline + summary 만 (b) 전체 본문 (.md body) 포함
- **카테고리 매핑**: News.category enum (paper/award/media/member/event/grant/lab) 그대로 RSS `<category>`에 노출

### 검증
- `npm run build` → `dist/rss.xml` 생성, XML 유효성 확인
- W3C Feed Validator (https://validator.w3.org/feed/) 또는 Feedly에 등록 테스트
- BaseLayout `<link rel="alternate">` 가 모든 페이지 source에 보이는지

## 알아둘 것

- 두 작업 모두 기존 컴포넌트/스타일 토큰만 사용, 신규 의존성은 RSS의 `@astrojs/rss` 단 하나.
- Sveltia CMS에는 영향 없음 (404는 정적, RSS는 News collection을 읽기만 함).
- Pagefind 인덱스도 영향 없음 (404는 noindex가 자연스럽고, rss.xml은 비-HTML이라 인덱스 대상 아님).
- checklist.md의 두 라인 (`- [ ] 404 페이지` / `- [ ] RSS feed (/rss.xml endpoint)`) 체크 + Stage/PRD 한 줄 갱신.

## 우선 확인할 것

- 작업 시작 전 PRD.md §9.3 (Sitemap), checklist.md L74 / L70 sub-line 주변, src/content.config.ts의 news 스키마 (date 필드 포맷 확인) 훑기.
- 위 결정 사항을 사용자에게 단답형으로 묻고 합의된 후 코딩.
- 첫 push 전 `npm run check` + `npm run build` + `npm run preview`로 양쪽 다 동작 확인.
```
