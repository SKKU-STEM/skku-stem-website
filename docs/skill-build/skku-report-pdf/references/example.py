# SKKU Report PDF — 최소 동작 예제
# 실행: python example.py  → example-report.pdf 생성
# 새 보고서를 만들 때 이 파일을 복사해 시작점으로 사용.
import sys
from pathlib import Path

# assets/template.py 를 import path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent / 'assets'))

from template import (
    H1, H2, H3, P, Bul, Note, Warn, Code, Faq,
    TableSimple, cover, toc, build,
)
from reportlab.platypus import PageBreak, Spacer
from reportlab.lib.units import mm

# ─── 콘텐츠 ───
story = []

# === 표지 ===
story.extend(cover(
    eyebrow='SKKU-STEM Lab',
    title='Example Report',
    subtitle='Pretendard typography on cream canvas — 한국어와 영문 혼용 예제',
    intro='본 예제 보고서는 skku-report-pdf 스킬의 작동을 확인하기 위한 최소 문서입니다. '
          'cover · 목차 · 본문 · callout · 표 · FAQ 의 모든 빌딩 블록이 한 페이지씩 등장합니다.',
    footer_meta_lines=[
        '성균관대학교 에너지과학과 김영민 교수 연구실',
        'v1.0 — 2026년 5월 작성',
    ],
))

# === 목차 ===
story.extend(toc([
    ('1. 개요', '문서의 목적'),
    ('2. 콘텐츠 블록 시연', 'H1/H2/H3, P, Bul, Note, Warn, Code, Table'),
    ('3. FAQ', '자주 묻는 질문 예시'),
    ('부록 A — 민감 정보 처리', '*****  표시 규칙'),
]))

# === 1. 개요 ===
story.append(H1('1. 개요'))
story.append(P('이 문서는 <b>skku-report-pdf</b> 스킬이 제공하는 모든 빌딩 블록을 한 번에 보여줍니다. '
               '각 블록은 SKKU-STEM 사이트의 디자인 토큰(cream / coral / ink)과 1:1 일치하며, '
               'Pretendard 한 폰트로 한국어와 영문을 모두 처리합니다.'))
story.append(P('새 보고서를 만들 때 이 파일을 복사해 콘텐츠만 교체하면 됩니다.'))
story.append(PageBreak())

# === 2. 콘텐츠 블록 시연 ===
story.append(H1('2. 콘텐츠 블록 시연'))

story.append(H2('2.1 헤딩 위계'))
story.append(P('H1 → H2 → H3 → P 순서로 작성합니다. 레벨을 건너뛰지 마세요.'))
story.append(H3('H3 예시 — 코랄-700 미니 캡션'))
story.append(P('H3은 단계나 세부 항목을 구분할 때 사용. 본문 paragraph 위에 12pt bold로 노출.'))

story.append(H2('2.2 리스트'))
story.append(Bul([
    '첫 번째 항목 — Pretendard 본문 10.5pt, 코랄 bullet',
    '두 번째 항목 — 인라인 <b>강조</b>는 b 태그',
    '세 번째 항목 — 한국어와 English 자유 혼용',
    '네 번째 항목 — 화학식은 V<sub>O</sub> · HfO<sub>2</sub> · x10<sup>3</sup> 등 sub/sup 태그',
]))

story.append(H2('2.3 Callout'))
story.append(Note('이것은 참고 callout입니다. cream-200 배경에 ※ 접두사가 자동으로 붙어 본문 흐름과 시각적으로 구분됩니다. '
                  '부가 정보·팁·맥락 설명에 사용하세요.'))
story.append(Warn('이것은 경고 callout입니다. 노란 배경에 ⚠ 접두사가 붙어 절대 하지 말아야 할 행동·실수 방지 알림에 사용합니다.'))

story.append(H2('2.4 Code 블록'))
story.append(P('명령어·파일 경로·URL은 Courier로 렌더링됩니다.'))
story.append(Code('npm run build && pagefind --site dist'))
story.append(Spacer(1, 4*mm))

story.append(H2('2.5 Table'))
story.append(P('표는 첫 행이 코랄-700 헤더, 나머지가 cream-200 본문으로 자동 구성됩니다.'))
story.append(TableSimple([
    ['필드', '형식', '필수?'],
    ['title', '문자열', 'O'],
    ['year', '정수', 'O'],
    ['summary', '여러 줄 텍스트', '-'],
    ['doi', 'https://doi.org/... URL', '-'],
], col_widths=[40*mm, 100*mm, 25*mm]))

story.append(PageBreak())

# === 3. FAQ ===
story.append(H1('3. FAQ'))
for q, a in [
    ('이 스킬은 어떤 문서에 사용하나요?',
     '매뉴얼·보고서·가이드·안내서·절차서 등 구조화된 prose PDF 전반에 사용합니다. 슬라이드는 skku-energy-slide-design을 사용하세요.'),
    ('한국어와 영문을 섞어도 되나요?',
     '네, Pretendard 한 폰트가 두 스크립트를 모두 자연스럽게 렌더링합니다. 별도 폴백 설정 불필요.'),
    ('표지 없이 바로 본문부터 시작할 수 있나요?',
     '가능합니다. cover()를 호출하지 않고 바로 H1으로 시작하면 됩니다. 단 그 경우 첫 페이지에도 cream 상단 띠가 안 그려지도록 build(cover_band=False)로 호출.'),
]:
    story.extend(Faq(q, a))

story.append(PageBreak())

# === 부록 A — 민감 정보 처리 ===
story.append(H1('부록 A — 민감 정보 처리'))
story.append(P('ID · 비밀번호 · API 키 · 토큰 등은 PDF에 절대 노출하지 말고 항상 <font name="Courier">*****</font> 로 표시. '
               '실제 값은 별도 채널(PI 또는 관리 책임자 직접 전달)로 받습니다.'))
story.append(TableSimple([
    ['항목', '값'],
    ['GitHub 사용자 ID', '*****'],
    ['GitHub 비밀번호', '*****'],
    ['SSH key passphrase', '*****'],
    ['API 키', '*****'],
], col_widths=[60*mm, 108*mm]))
story.append(Note('PDF는 공유·재배포가 쉽기 때문에 민감 정보는 절대 평문으로 포함하지 않습니다. 위 표는 <b>자리만 표시</b>한 예시.'))

# ─── PDF 빌드 ───
out_path = str(Path(__file__).parent.parent / 'example-report.pdf')
build(
    story,
    out_path=out_path,
    doc_title='Example Report',
    doc_version='v1.0 / 2026-05',
    doc_footer_url='example.org',
)
print(f'  generated: {out_path}')
