# Design Tokens

`skku-report-pdf` 스킬과 1:1 일치하는 토큰. PDF/DOCX 두 매체에 같은 디자인 시스템 적용. 토큰 값을 바꾸려면 양쪽 skill을 함께 수정.

## Colors (hex without '#')

| 토큰 | Hex | 용도 |
|---|---|---|
| Cream | `FAF9F5` | 페이지 캔버스 (DOCX는 viewer 기본 흰 배경이라 표지 띠와 callout에서만 시각적으로 노출) |
| Cream-200 | `F1EFE7` | 표지 상단 띠, callout(참고) 배경, 표 본문 배경 |
| Cream-300 | `E4E1D5` | 헤더/푸터 가로 라인 |
| Ink | `141413` | H2 제목, 본문 |
| Ink/70 | `5C5B57` | 부제·메타·캡션 |
| Coral | `CC785C` | bullet, 인라인 강조 |
| Coral-700 | `8C4D3A` | H1·H3, 표 헤더 배경, 작은 액센트 텍스트 (WCAG AA 통과) |
| Warn Yellow | `FFF2CC` | 경고 callout 배경 |

색 지정은 `RGBColor.from_string('XXXXXX')` 사용. paragraph/cell 배경은 `w:shd` XML로 직접 삽입.

## Typography

모든 텍스트는 Pretendard. weight별로 별도 폰트 family 이름 사용 — Word는 italic을 자체적으로 합성하지만 weight는 family를 분리하는 게 깔끔.

| 스타일 | Font name (`rFonts.ascii`) | 크기 | 색 | 용도 |
|---|---|---|---|---|
| Cover Eyebrow | `Pretendard Medium` | 11 | Coral-700 | 표지 작은 라벨 |
| Cover Title | `Pretendard Bold` | 32 | Ink | 표지 메인 |
| Cover Subtitle | `Pretendard` | 14 | Ink/70 | 표지 부제 |
| Cover Intro | `Pretendard` | 11 | Ink | 표지 도입 paragraph |
| Cover Meta | `Pretendard` | 10 | Ink/70 | 표지 하단 메타 |
| H1 | `Pretendard Bold` | 20 | Coral-700 | 대단원 |
| H2 | `Pretendard Bold` | 15 | Ink | 소단원 |
| H3 | `Pretendard Bold` | 12 | Coral-700 | 세부 |
| Body | `Pretendard` | 10.5 | Ink | 본문 |
| Bullet | `Pretendard` | 10.5 | Ink (bullet은 Coral) | 리스트 |
| Small | `Pretendard` | 9 | Ink/70 | 캡션 |
| Callout (Note) | `Pretendard` | 10 | Ink | 본문, "※ 참고:" prefix |
| Callout (Warn) | `Pretendard` | 10 | Ink | 본문, "⚠ 주의:" prefix |
| Code | `Courier New` | 9 | Ink | 명령어·URL |
| Table Header | `Pretendard Bold` | 9 | Cream | Coral-700 cell 배경 |
| Table Body | `Pretendard` | 9 | Ink | Cream-200 cell 배경 |
| FAQ Q | `Pretendard Bold` | 11 | Coral-700 | "Q. ..." prefix |
| FAQ A | `Pretendard` | 10 | Ink | "A. ..." prefix |
| Header / Footer | `Pretendard` | 8 | Ink/70 | 페이지 chrome |

## Font Slots (Korean Rendering)

OOXML run properties는 ascii / hAnsi / eastAsia / cs 네 슬롯에 각각 폰트 지정.

- `ascii`: U+0000–007F (영문 기본)
- `hAnsi`: U+00A0–FFFF 중 동아시아 외 (라틴 확장)
- `eastAsia`: CJK 문자 — **한국어 자모는 이 슬롯**
- `cs` (complex script): RTL/아랍 등

Pretendard는 라틴 + 한글 한 family에 둘 다 포함하므로, 네 슬롯 모두 `Pretendard` 또는 weight 변형 (`Pretendard Bold` 등)으로 설정하면 한국어와 영문이 일관되게 렌더링됨. `_set_font_full(run, name)` 헬퍼가 이 작업을 처리.

## Spacing & Layout

- A4 portrait 210 × 297 mm
- 좌/우 margin: 18 mm
- 상/하 margin: 22 mm
- header 거리: 페이지 상단 10 mm
- footer 거리: 페이지 하단 10 mm

표 col_widths는 mm 단위 (예: `[40, 100, 25]` → 합 165mm, 가용 폭 174mm 이내).

## Sensitive Data Convention

`skku-report-pdf` 와 동일. ID / 비밀번호 / API 키 등은 항상 `*****` 로 표시. 실제 값은 별도 채널.

DOCX는 편집 가능하므로 "주의: PI에게 별도 전달 후 *****를 실제 값으로 교체하시오. 교체 후에는 이 문서를 안전한 채널로만 공유하세요." 같은 Warn callout을 같이 두는 것이 권장.
