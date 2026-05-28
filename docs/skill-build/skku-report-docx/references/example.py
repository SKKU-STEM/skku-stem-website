# SKKU Report DOCX — 최소 동작 예제
# 실행: python example.py → example-report.docx 생성
# Word에서 열고 TOC 위 F9 누르면 목차 자동 갱신.
import sys
from pathlib import Path

# assets/template.py 를 import path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent / 'assets'))

from template import Report

r = Report(
    doc_title='Example Report',
    doc_version='v1.0 / 2026-05',
    doc_footer_url='example.org',
)

# === 표지 ===
r.cover(
    eyebrow='SKKU-STEM Lab',
    title='Example Editable Report',
    subtitle='Pretendard typography · 한국어 + English · Word에서 편집 가능',
    intro='본 예제 보고서는 skku-report-docx 스킬의 작동을 확인하기 위한 최소 문서입니다. '
          'cover · 목차 · 본문 · callout · 표 · FAQ 의 모든 빌딩 블록이 한 번씩 등장합니다.',
    footer_meta_lines=[
        '성균관대학교 에너지과학과 김영민 교수 연구실',
        'v1.0 — 2026년 5월 작성',
    ],
)

# === 목차 (Word TOC field) ===
r.toc_field()
r.note('Word에서 위 목차 영역 위에 커서를 두고 F9를 누르면 페이지 번호가 자동으로 채워집니다. '
       '문서 변경 시에도 같은 절차로 갱신.')

# === 1. 개요 ===
r.page_break()
r.h1('1. 개요')
r.p('이 문서는 skku-report-docx 스킬이 제공하는 모든 빌딩 블록을 한 번에 보여줍니다. '
    '각 블록은 SKKU-STEM 사이트의 디자인 토큰(cream / coral / ink)과 1:1 일치하며, '
    'Pretendard 한 폰트로 한국어와 영문을 모두 처리합니다.')
r.p('새 보고서를 만들 때 이 파일을 복사해 콘텐츠만 교체하면 됩니다.')

# === 2. 콘텐츠 블록 시연 ===
r.page_break()
r.h1('2. 콘텐츠 블록 시연')

r.h2('2.1 헤딩 위계')
r.p('H1 → H2 → H3 → P 순서로 작성합니다. 레벨을 건너뛰지 마세요.')
r.h3('H3 예시 — 코랄-700 미니 캡션')
r.p('H3은 단계나 세부 항목을 구분할 때 사용. 본문 paragraph 위에 12pt bold로 노출.')

r.h2('2.2 리스트')
r.bul([
    '첫 번째 항목 — Pretendard 본문 10.5pt, 코랄 bullet',
    '두 번째 항목 — Word/Pages/LibreOffice 모두 같은 코랄 점',
    '세 번째 항목 — 한국어와 English 자유 혼용',
    '네 번째 항목 — 화학식 V_O, HfO2, x10^3 등 인라인 텍스트 그대로',
])

r.h2('2.3 Callout')
r.note('이것은 참고 callout입니다. cream-200 배경에 ※ 접두사가 자동으로 붙어 본문 흐름과 시각적으로 구분됩니다. '
       '부가 정보·팁·맥락 설명에 사용하세요.')
r.warn('이것은 경고 callout입니다. 노란 배경에 ⚠ 접두사가 붙어 절대 하지 말아야 할 행동·실수 방지 알림에 사용합니다.')

r.h2('2.4 Code 블록')
r.p('명령어·파일 경로·URL은 Courier New로 렌더링됩니다.')
r.code('npm run build && pagefind --site dist')

r.h2('2.5 Table')
r.p('표는 첫 행이 코랄-700 헤더, 나머지가 cream-200 본문으로 자동 구성됩니다.')
r.table([
    ['필드', '형식', '필수?'],
    ['title', '문자열', 'O'],
    ['year', '정수', 'O'],
    ['summary', '여러 줄 텍스트', '-'],
    ['doi', 'https://doi.org/... URL', '-'],
], col_widths_mm=[40, 100, 25])

# === 3. FAQ ===
r.page_break()
r.h1('3. FAQ')
for q, a in [
    ('이 스킬은 어떤 문서에 사용하나요?',
     '편집 가능한(Word) 매뉴얼·보고서·가이드·안내서·절차서에 사용합니다. 정적 PDF는 skku-report-pdf, 슬라이드는 skku-energy-slide-design.'),
    ('한국어와 영문을 섞어도 되나요?',
     '네, Pretendard 한 폰트가 두 스크립트를 모두 자연스럽게 렌더링합니다. eastAsia 슬롯에 Pretendard가 명시되어 있어 viewer 기본 동아시아 폰트로 fallback되지 않습니다.'),
    ('TOC 페이지 번호가 비어 보입니다.',
     'Word에서 TOC 위에 커서 두고 F9를 누르면 자동 갱신됩니다. python-docx로 작성한 시점에는 placeholder 텍스트만 들어 있습니다.'),
    ('받는 사람 시스템에 Pretendard가 없으면?',
     'Word가 Calibri(영문) / Malgun Gothic(한국어)로 대체합니다. 레이아웃은 유지되지만 디자인이 살짝 변형됩니다. '
     'Word에서 File → Options → Save → "Embed fonts in the file"을 켜면 docx에 폰트 임베드되어 portable.'),
]:
    r.faq(q, a)

# === 부록 A — 민감 정보 처리 ===
r.page_break()
r.h1('부록 A — 민감 정보 처리')
r.p('ID · 비밀번호 · API 키 · 토큰 등은 docx에 절대 노출하지 말고 항상 ***** 로 표시. '
    '실제 값은 별도 채널(PI 또는 관리 책임자 직접 전달)로 받습니다.')
r.table([
    ['항목', '값'],
    ['GitHub 사용자 ID', '*****'],
    ['GitHub 비밀번호', '*****'],
    ['SSH key passphrase', '*****'],
    ['API 키', '*****'],
], col_widths_mm=[60, 108])
r.warn('docx는 편집 가능하므로 누군가 실제 값으로 교체할 수 있습니다. 교체 후에는 안전한 채널로만 공유. '
       '공유 후 곧바로 ***** 자리로 되돌리거나, 공유본은 PDF로 변환 후 송부 권장.')

# ─── 저장 ───
out_path = str(Path(__file__).parent.parent / 'example-report.docx')
r.build(out_path)
print(f'  generated: {out_path}')
