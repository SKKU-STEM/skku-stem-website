# Gallery photos

이전 사이트(https://sites.google.com/site/skkustem/upcoming-seminars)는 Google CDN 호스팅이고 외부에서 직접 다운로드 시 403 Forbidden을 반환합니다. 따라서 **브라우저에서 옛 페이지를 열고 각 사진을 우클릭 → "이미지 저장"으로 받아서** 본 디렉토리에 드롭하면 됩니다.

## 파일 명명 규칙

`src/data/gallery-events.ts`에서 각 이벤트는 `slug`(예: `2026-eels-school`)와 `photoCount`를 가집니다. 파일은 다음 패턴으로 저장:

```
<slug>-<index>.<ext>
```

예시:
- `2026-eels-school-1.jpg`
- `2026-eels-school-2.png`
- `2025-graduation-feb25-1.webp`

`<index>`는 1부터 시작. 확장자는 `.jpg` `.jpeg` `.png` `.webp` 모두 인식됨.

## 워크플로

1. 옛 페이지를 브라우저에서 열기: https://sites.google.com/site/skkustem/upcoming-seminars
2. 각 이벤트 사진을 우클릭 → "이미지 저장"
3. `data/gallery-events.ts`에서 해당 이벤트의 slug 확인 (예: `2026-eels-school`)
4. 저장 시 파일명을 `<slug>-1.jpg`, `<slug>-2.jpg`, ... 식으로
5. 본 디렉토리(`src/assets/gallery/`)에 드롭
6. dev 서버 자동 반영 — placeholder가 사진으로 교체됨

## photoCount

각 이벤트에는 옛 페이지에 있던 사진 개수가 `photoCount`로 명시되어 있습니다. 페이지는 항상 `photoCount`만큼의 슬롯을 표시 — 업로드 안 된 슬롯은 점선 placeholder로 보임. 일부만 업로드해도 OK.

`photoCount` 자체를 줄이고 싶다면 데이터 파일에서 직접 숫자 수정.

## 새 이벤트 추가

`src/data/gallery-events.ts` 배열 맨 위(가장 최근이 위)에 새 entry 추가. `slug`는 충돌 안 되게 unique하게 짓고, `photoCount`는 업로드할 사진 수만큼.
