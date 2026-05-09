# People portraits

이 디렉토리에 멤버/alumni 인물 사진을 둡니다. `/people` 페이지의 카드 우측 상단 portrait 슬롯에 자동으로 들어갑니다.

## 파일 규칙

- **형식**: `.jpg` `.jpeg` `.png` `.webp`
- **권장 비율**: 3:4 (페이지에서 어떤 비율이든 3:4로 크롭됨)
- **권장 해상도**: 600×800px 이상 — 레티나 디스플레이에서도 선명, Astro Image가 자동으로 다중 해상도 + WebP로 변환
- **파일명**: 영문 권장 (예: `min-hyoung-jung.jpg`). 공백 금지, kebab-case 권장

## 등록 방법

1. 사진 파일을 본 디렉토리 (`src/assets/people/`) 에 저장
2. `src/pages/people/index.astro` 안의 멤버 데이터에서 `portrait` 필드에 파일명만 적기
   ```ts
   {
     nameKo: '정민형 박사',
     nameEn: 'Min-Hyoung Jung, Ph.D.',
     // ...
     portrait: 'min-hyoung-jung.jpg',  // ← 추가
   }
   ```
3. 저장하면 dev 서버 HMR로 자동 반영. 빌드 시에는 Astro가 WebP/AVIF + 다중 해상도 srcset 생성

`portrait` 필드가 비어 있으면 점선 박스 placeholder("Photo") 표시 — 카드 레이아웃은 항상 슬롯 자리를 비워 둡니다.
