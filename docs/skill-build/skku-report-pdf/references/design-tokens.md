# Design Tokens

SKKU-STEM 사이트와 1:1 일치하는 PDF용 토큰. 모든 색·크기는 `template.py`의 상수와 동기화되어 있으니, 토큰을 변경하려면 `template.py`도 같이 수정.

## Colors

| 토큰 | Hex | 용도 |
|---|---|---|
| Cream | `#FAF9F5` | 캔버스 배경 (페이지 전체). 표지 띠 위와 헤더/푸터에서 살짝 옅은 cream-200 사용. |
| Cream-200 | `#F1EFE7` | callout 배경 (참고 ※), 표 본문 행 배경, 표지 상단 띠. |
| Cream-300 | `#E4E1D5` | 헤더/푸터 가로 라인, 표 셀 경계선. |
| Ink | `#141413` | H2 제목, 본문 텍스트, 표 본문 텍스트. |
| Ink/70 | `#5C5B57` | 부제·메타·캡션 텍스트 (Small 스타일). |
| Coral | `#CC785C` | 강조 액센트, bullet 점, 인라인 강조. 작은 텍스트(≤14pt 평문)에는 가독성 ↓ — 작은 강조는 Coral-700 사용. |
| Coral-700 | `#8C4D3A` | H1·H3 제목, 표 헤더 배경, 작은 액센트 텍스트. WCAG AA 통과(5.6:1 on cream). |
| Warn Yellow | `#FFF2CC` | 경고 callout(⚠) 배경. 노란-cream 톤. |

## Typography

모든 텍스트는 **Pretendard**. weight 300 / 400 / 500 / 700 네 가지를 사용.

| 스타일 | 폰트·웨이트 | 크기 / leading | 색 | 용도 |
|---|---|---|---|---|
| Cover Eyebrow | Pretendard-Medium | 11 / 14 | Coral-700 | 표지의 작은 라벨 ("SKKU-STEM Lab Website" 등) |
| Cover Title | Pretendard-Bold | 32 / 40 | Ink | 표지 메인 타이틀 |
| Cover Subtitle | Pretendard | 14 / 18 | Ink/70 | 표지 부제 |
| Cover Intro | Pretendard | 11 / 17 | Ink | 표지 하단 도입 paragraph |
| Cover Meta | Pretendard | 10 / 14 | Ink/70 | 표지 맨 아래 메타 (작성일, 버전 등) |
| H1 | Pretendard-Bold | 20 / 26 | Coral-700 | 대단원 ("1. 개요" 등). 18pt spaceBefore, 10pt spaceAfter. |
| H2 | Pretendard-Bold | 15 / 20 | Ink | 소단원. 14pt spaceBefore, 6pt spaceAfter. |
| H3 | Pretendard-Bold | 12 / 16 | Coral-700 | 세부 항목. 10pt spaceBefore, 4pt spaceAfter. |
| Body | Pretendard | 10.5 / 16 | Ink | 본문 paragraph |
| Bullet | Pretendard | 10.5 / 16 | Ink | 리스트 항목 (들여쓰기 14pt, bullet 색은 Coral) |
| Small / Caption | Pretendard | 9 / 12 | Ink/70 | 캡션·각주·표지 메타 |
| Callout (Note) | Pretendard | 10 / 15 | Ink | cream-200 배경 + 8pt padding. "※ 참고:" 접두사. |
| Callout (Warn) | Pretendard | 10 / 15 | Ink | warn-yellow 배경 + 8pt padding. "⚠ 주의:" 접두사. |
| Code | Courier | 9 / 13 | Ink | cream-200 배경, 6pt padding. 명령어·파일명·URL. |
| Table Header | Pretendard-Bold | 9 / — | Cream (텍스트) | Coral-700 배경. |
| Table Body | Pretendard | 9 / — | Ink | Cream-200 배경. |
| FAQ Q | Pretendard-Bold | 11 / 15 | Coral-700 | "Q. ..." 접두사 |
| FAQ A | Pretendard | 10 / 15 | Ink | "A. ..." 접두사 |

## Spacing & Layout

- A4 portrait 210 × 297 mm
- 좌/우 margin: 18 mm
- 상/하 margin: 22 mm (페이지 상단/하단 라인까지 포함)
- 표지 상단 cream 띠 높이: 75 mm
- 표지 콘텐츠 들여쓰기: 30 mm top
- 헤더 라인: 페이지 상단 12 mm
- 푸터 라인: 페이지 하단 12 mm

## Sensitive Data Convention

ID / password / secret tokens / API key 등은 **항상 `*****`** 로 표시. PDF가 정적이고 공유 가능하므로 실제 값은 절대 노출 금지. 매뉴얼·보고서에 민감 정보를 명시할 자리에는:

```
| 항목 | 값 |
|---|---|
| GitHub 사용자 ID | ***** |
| GitHub 비밀번호 | ***** |
```

추가로 "PI 또는 관리 책임자에게 별도 전달받음" 같은 안내 한 줄을 Note callout에 포함.
