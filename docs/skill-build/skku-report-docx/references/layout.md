# Layout (DOCX 특이사항)

`skku-report-pdf`의 layout.md와 시각적으로는 동일하지만, DOCX는 페이지가 reflow되므로 절대 좌표 대신 paragraph 흐름으로 구성. 아래는 docx-specific 차이 요점.

## Page Chrome (header / footer)

`Report.__init__`에서 자동 설정. 호출자 추가 작업 불필요.

- 헤더: 좌측 `doc_title`, 우측 `doc_version`. 두 텍스트 사이는 우측 정렬 tab stop. 아래 cream-300 가로 라인.
- 푸터: 좌측 `doc_footer_url`, 우측 자동 페이지 번호 (`PAGE` field). 위에 cream-300 가로 라인.

`section.different_first_page_header_footer` 는 미사용 — 표지에도 헤더/푸터가 나옴. 만약 표지에는 chrome을 숨기려면:
```python
section.different_first_page_header_footer = True
section.first_page_header.paragraphs[0].text = ''
section.first_page_footer.paragraphs[0].text = ''
```

## Cover Page

PDF처럼 상단 cream 띠를 절대 위치에 그리는 게 어려워, 표지 첫 4개 paragraph를 cream-200 배경으로 음영 처리해 "띠처럼" 보이게 한다. 완벽하지는 않지만 시각적 hint 유지.

호출:
```python
r.cover(
    eyebrow='SKKU-STEM Lab Website',
    title='웹사이트 관리자 매뉴얼',
    subtitle='Content management via Sveltia CMS at skkustem.org/admin',
    intro='본 매뉴얼은 …',
    footer_meta_lines=['성균관대학교 에너지과학과 김영민 교수 연구실', 'v1.0 — 2026년 5월'],
)
```

`cover()`는 끝에 자동으로 `add_page_break()` 호출.

## Table of Contents

DOCX는 두 가지 TOC 옵션:

1. **Word TOC field (권장)** — `r.toc_field()` 호출. Word는 H1/H2/H3 paragraph를 추적해 자동으로 페이지 번호 포함 TOC 렌더. 사용자가 Word에서 문서 열고 TOC 위에서 F9를 눌러야 갱신. python-docx로 작성 시점에는 placeholder ("목차는 Word에서 F9를 눌러 갱신하세요.")만 보임.

2. **수동 TOC** — `r.h1('목차')` 후 `r.bul([...])` 로 직접 작성. 페이지 번호 자동 산출 안 됨, 변경 시 수동 갱신 필요.

대부분 (1) 사용 — 작성자는 한 줄로 끝, 사용자가 F9 한 번 누름.

## Callout Boxes

paragraph 배경 음영(`w:shd`) + prefix 텍스트로 구현. 박스 보더는 별도 추가 없음 (시각적 단정함을 위해).

- `r.note(text)`: cream-200 배경, "※ 참고:" prefix
- `r.warn(text)`: warn-yellow 배경, "⚠ 주의:" prefix

paragraph 좌우 들여쓰기(`left_indent`/`right_indent` 3mm)로 본문과 시각적 분리.

## Tables

`r.table(data, col_widths_mm=...)`:
- `data`: 2차원 리스트, 첫 행은 헤더.
- `col_widths_mm`: 각 컬럼 너비 (mm). 생략 시 autofit. 명시 시 합이 174mm 이내(가용 폭).
- 헤더 셀: coral-700 배경, cream 텍스트, bold.
- 본문 셀: cream-200 배경, ink 텍스트.

Word는 표가 페이지 끝에 걸리면 자동으로 다음 페이지로 이동. 큰 표는 헤더 행 반복 옵션을 켜는 게 좋음 — 추후 추가 가능.

## Page Breaks

- 새 H1 시작 직전: `r.page_break()` 권장. DOCX는 H1 paragraph 직전에 page break를 두면 깔끔.
- `cover()`, `toc_field()`는 내부에서 자동 page break.

## Images

`r.image(path, width_mm=160)` — 본문 흐름에 PNG/JPG 삽입. 절대 좌표 배치는 미지원 (DOCX의 인라인 이미지는 paragraph anchor에 묶임).

복잡한 floating image / textwrap은 python-docx 한계 — 필요하면 사용자가 Word에서 직접 조정.

## Page Number / Field 동작

Word는 PAGE / TOC 등 field를 문서 열 때 자동 갱신하지 않음. 사용자는:

- TOC 갱신: TOC 위에서 우클릭 → "Update Field" 또는 F9
- 전체 field 갱신: Ctrl+A → F9

이 절차는 출력 docx의 첫 페이지 Note callout에 안내하는 것이 권장.

## Track Changes & Comments

생성 시점에는 Track Changes off, 코멘트 없음. 검토자가 Word에서 Review → Track Changes 켜고 시작. 이건 viewer의 작업이라 skill 책임 밖.

## Font Embedding (선택사항)

기본 출력은 폰트 임베드 없음. 받는 사람 시스템에 Pretendard 미설치면 Calibri/Malgun으로 대체.

폰트를 docx에 임베드하려면 viewer가 Word에서 직접 수행:
- File → Options → Save → "Embed fonts in the file" 체크
- (선택) "Embed only the characters used in the document" 으로 크기 줄임

이 옵션 적용 시 docx 크기 ~10MB 증가 (Pretendard 4 weight 합).

python-docx로 자동 임베드는 OOXML `settings.xml` 의 `w:embedTrueTypeFonts` + `fontTable.xml` 조작 필요 — 현재 skill에는 미구현 (필요시 v2 기능).
