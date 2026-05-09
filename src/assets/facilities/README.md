# Facility photos

이 디렉토리에 lab 장비 사진을 둡니다. `/facilities` 페이지의 각 장비 카드에 자동 노출됩니다.

옛 사이트(https://sites.google.com/site/skkustem/services)의 이미지는 Google CDN 외부 접근이 403으로 차단되어 자동 다운로드가 불가능합니다. 브라우저로 옛 페이지를 열고 우클릭 → "이미지 저장"으로 받아서 본 디렉토리에 드롭하세요.

## 파일 명명 규칙

`src/data/facilities.ts`의 각 장비는 `slug`(예: `jeol-arm300f`)와 `photoCount`를 가집니다. 파일은 다음 패턴으로 저장:

```
<slug>-<index>.<ext>
```

예시:
- `jeol-arm300f-1.jpg`
- `jeol-arm300f-2.jpg`
- `jeol-arm300f-3.png`
- `jeol-arm200f-1.jpg`
- `jeol-arm200f-2.webp`

`<index>`는 1부터 시작. 확장자는 `.jpg` `.jpeg` `.png` `.webp` 모두 인식됨.

## 권장 해상도

1200×900px 이상 (Astro Image가 자동으로 WebP/AVIF + 다중 해상도 srcset 생성).
