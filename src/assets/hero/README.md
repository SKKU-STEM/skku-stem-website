# Hero slides

홈(`/`) 히어로의 슬라이드쇼 사진을 둡니다. 최대 3장까지 순서대로 자동 재생됩니다.

슬라이드 목록(이미지 경로·alt·caption)은 `src/content/home/hero.json`의 `items` 배열에 있고, `/admin`의 **Home · Hero slides** 컬렉션에서 편집합니다. CMS로 사진을 업로드하면 이 디렉토리에 저장되고 frontmatter 경로는 `/hero/<filename>`으로 들어갑니다 (`HeroSlideshow`가 basename으로 lookup해 Astro `<Image>`로 webp/반응형 변환).

## 파일 명명 규칙

자유롭게 지어도 됩니다. `hero.json`의 `image` 값과 basename만 일치하면 됩니다. 확장자는 `.jpg` `.jpeg` `.png` `.webp` 모두 인식됨.

예시:
- `/hero/2026group-spring.jpg` → `src/assets/hero/2026group-spring.jpg`

## 권장 해상도

1600×1200px 이상 (4:3 비율 권장, Astro Image가 자동으로 WebP + 다중 해상도 srcset 생성). 첫 슬라이드는 LCP 이미지이므로 너무 큰 원본(>2MB)은 피하세요.
