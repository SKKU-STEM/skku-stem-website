# News photos

`/news` 페이지 각 entry에 첨부할 사진을 두는 디렉토리.

## 파일 명명 규칙

`src/content/news/<slug>.md`의 entry는 frontmatter에 `slug`(파일명과 동일, 예: `2026-bk-thesis-awards`)와 `photoCount`를 가집니다. 파일명은 다음 패턴:

```
<slug>-<index>.<ext>
```

예시:
- `2026-bk-thesis-awards-1.jpg`
- `2026-bk-thesis-awards-2.png`
- `2026-eels-school-graz-1.webp`

`<index>`는 1부터 시작. `.jpg` `.jpeg` `.png` `.webp` 모두 인식됨.

## 사진 grid 레이아웃

`photoCount`에 따라 자동:
- 1장: 전체 폭, 4:3
- 2장: 2-col grid
- 3장: 첫 사진이 가로 2칸, 나머지 2장이 아래에

## 권장

해상도: 1200×900px 이상 (Astro Image가 WebP/AVIF + 다중 해상도 srcset 자동 생성).

게시판 entry에 사진이 어울리지 않으면 `photoCount: 0` (또는 필드 생략) — 헤드라인과 본문만으로 구성하면 깔끔.
