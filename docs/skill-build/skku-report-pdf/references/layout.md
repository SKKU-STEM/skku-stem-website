# Layout

A4 페이지 chrome (헤더/푸터)·표지·목차·콘텐츠 페이지의 표준 골격.

## Page Chrome

모든 페이지(표지 제외)에 동일한 헤더/푸터:

```
┌────────────────────────────────────────────────────────┐
│ {doc_title}                              {doc_version} │  ← 상단 8pt ink/70 + 0.3pt cream-300 라인
│ ───────────────────────────────────────────────────── │
│                                                        │
│                                                        │
│                    (콘텐츠)                            │
│                                                        │
│                                                        │
│ ───────────────────────────────────────────────────── │
│ {doc_footer_url}                         {page_number} │  ← 하단 8pt ink/70 + 0.3pt cream-300 라인
└────────────────────────────────────────────────────────┘
```

- 좌측 헤더: 문서 제목 (예 "SKKU-STEM Lab Website — Admin Manual")
- 우측 헤더: 버전 (예 "v1.0 / 2026-05")
- 좌측 푸터: 도메인 또는 URL (예 "skkustem.org/admin")
- 우측 푸터: 페이지 번호 (1, 2, 3, …)

## Cover Page (첫 페이지)

첫 페이지는 헤더가 없고 상단 cream-200 띠가 75mm 채워진다.

```
█████████████████████████████████████████████  ← cream-200 띠 (75mm)
█████████████████████████████████████████████
                                                
SKKU-STEM Lab Website                            ← Cover Eyebrow, Coral-700, 11pt
                                                
웹사이트 관리자 매뉴얼                            ← Cover Title, Ink Bold, 32pt
Content management via Sveltia CMS …             ← Cover Subtitle, Ink/70, 14pt
                                                
                                                
                                                
                                                
본 매뉴얼은 SKKU-STEM 연구실의 학생 관리자가 …      ← Cover Intro, Ink, 11pt
                                                
성균관대학교 에너지과학과 김영민 교수 연구실         ← Cover Meta, Ink/70, 10pt
v1.0 — 2026년 5월 작성                            ← Cover Meta, Ink/70, 10pt
─────────────────────────────────────────────  ← 푸터 라인
example.org                              1     ← Cover Footer
```

호출 방법:

```python
story.extend(cover(
    eyebrow='SKKU-STEM Lab Website',
    title='웹사이트 관리자 매뉴얼',
    subtitle='Content management via Sveltia CMS at skkustem.org/admin',
    intro='본 매뉴얼은 …',
    footer_meta_lines=[
        '성균관대학교 에너지과학과 김영민 교수 연구실',
        'v1.0 — 2026년 5월 작성',
    ],
))
```

`cover()` 마지막에 자동으로 `PageBreak()`를 포함하므로 별도 추가 불필요.

## Table of Contents

TOC는 한 페이지에 가능한 한 모두 넣고 PageBreak. 항목은 (left, right) 튜플 — left는 제목, right는 한 줄 hint (회색 본문 색).

```python
story.extend(toc([
    ('1. 개요', '사이트 구조와 CMS의 위치'),
    ('2. 사전 준비', 'GitHub 계정, 조직 권한'),
    ('  2.1 권한 받기', '조직 멤버 초대'),       # 들여쓰기 2칸으로 sub
    ('3. 로그인 절차', '/admin 접속 → GitHub OAuth'),
]))
```

## Section Page

각 H1으로 시작하는 새 페이지는 일반적인 콘텐츠 페이지. 본문은 H1 → H2 → H3 → P/Bul/Note/Warn/Table 조합.

권장 순서:

1. `H1('1. 개요')` — 대단원 시작
2. `P(...)` — 개요 paragraph
3. `H2('주요 항목')` — 소단원
4. `Bul([...])` 또는 `TableSimple([...])` — 내용
5. `H2('다음 항목')` … 반복
6. `PageBreak()` — 새 H1 시작 직전에 권장

## Callout Boxes

`Note(text)`: cream-200 배경, "※ 참고:" 접두사. 본문에 곁들이는 부가 정보.
`Warn(text)`: warn-yellow 배경, "⚠ 주의:" 접두사. 절대 하면 안 되는 것·실수 방지 알림.

## Tables

`TableSimple(data, col_widths)`:
- 첫 행 = 헤더 (coral-700 배경, cream 텍스트, bold).
- 나머지 = 본문 (cream-200 배경, ink 텍스트).
- col_widths는 mm 단위(reportlab은 portable points 기본이라 `8*mm` 같이 명시).
- 권장 폭 합: 168mm (A4 210 − 좌우 18mm × 2 = 174mm 안에 들어가도록).

## Page Breaks

- 새 H1 시작 직전: `story.append(PageBreak())` 권장 (각 챕터를 새 페이지에서 시작).
- TOC 끝, 표지 끝: 함수 내부에서 자동 PageBreak 포함.
- 표(Table) 직전: 표가 페이지 끝에 걸리지 않도록 미리 PageBreak 또는 `KeepTogether`로 묶기.
