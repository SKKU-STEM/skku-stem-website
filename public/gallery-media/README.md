# Gallery media

`/gallery` 각 행사(event)의 사진/GIF/동영상을 두는 디렉토리. `src/content/gallery-events/<slug>.md`의 `media` 리스트에서 참조한다.

## 사용법

frontmatter `media`는 이미지/GIF 슬라이드와 YouTube 슬라이드를 섞어 담을 수 있다. 2개 이상이면 자동 슬라이드 캐러셀, 1개면 단일 표시 (공용 `src/components/MediaCarousel.astro`).

```yaml
media:
  - image: /gallery-media/2023-bk-thesis-1.jpg   # public 경로. GIF도 가능(원본 그대로 재생)
  - image: /gallery-media/2023-bk-thesis-2.jpg
  - youtube: https://youtu.be/<id>               # 입력 시 이 슬라이드는 동영상(썸네일 클릭 재생)
    alt: 설명 텍스트
```

- 이미지/GIF는 이 폴더에 올리고 `/gallery-media/<파일명>`으로 참조 (Astro Image 최적화 없이 원본 서빙 — GIF 애니메이션 보존 + YouTube와 일관 처리).
- `/admin` CMS의 Gallery Events 항목에서 업로드/입력 가능 (Media 필드).
- 이미지는 잘리지 않게 contain(레터박스) 표시되므로 가로/세로 비율은 자유. `alt`를 비우면 행사 제목이 자동으로 들어간다.
