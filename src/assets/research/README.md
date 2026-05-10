# Research highlight figures

이 디렉토리에 각 research highlight의 대표 이미지(논문 figure / TEM 사진 / 도식 등)를 둡니다. `/research` 페이지의 각 entry 우측(데스크톱) 또는 본문 아래(모바일·태블릿)에 자동 노출됩니다.

## 파일 규칙

- **형식**: `.jpg` `.jpeg` `.png` `.webp`
- **권장 비율**: 4:3 (페이지에서 4:3로 크롭됨 — `object-cover`)
- **권장 해상도**: 1200×900px 이상 — 레티나 디스플레이 + 자동 srcset 대응
- **파일명**: 영문 kebab-case (예: `silver-thin-films-2026.jpg`, `hfo2-ion-bombardment.png`)

## 등록 방법

1. 이미지 파일을 본 디렉토리(`src/assets/research/`)에 저장
2. `src/content/research-highlights/<slug>.md`의 frontmatter에 `image` 필드 추가
   ```yaml
   ---
   year: 2026
   title: "A growth mechanism for grain-boundary-free ultraflat silver thin films"
   # ...
   image: "silver-thin-films-2026.jpg"
   imageAlt: "STEM micrograph of grain-boundary-free silver film"  # 옵션 — 미설정 시 title 사용
   ---
   ```
3. 저장하면 dev 서버 HMR로, 빌드 시에는 자동으로 WebP/AVIF + 다중 해상도 srcset 생성됨

`image` 필드가 비어 있으면 점선 placeholder ("Figure") 표시 — 카드 레이아웃은 이미지 슬롯 자리를 항상 비워 둡니다.

## Tip

- 논문 figure 그대로 캡쳐해서 쓸 경우 published version의 cropping을 4:3으로 맞춰 잘라두면 보기 좋습니다.
- 도식이나 schematic은 흰 배경보다 cream 톤(#FAF9F5 ± 5%)으로 export하면 페이지 배경과 자연스럽게 어울립니다.
