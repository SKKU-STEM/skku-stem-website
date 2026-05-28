# SKKU-STEM 사이트 관리자 매뉴얼 PDF 생성 — Sveltia CMS 사용 가이드
# 출력: docs/SKKU-STEM_Admin_Manual.pdf
# 폰트: Malgun Gothic (한글), Inter 비유 — 시스템 sans
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, ListFlowable, ListItem, Image,
)

# ─── 폰트 등록 ───
FONT_DIR = 'C:/Windows/Fonts'
pdfmetrics.registerFont(TTFont('Malgun', os.path.join(FONT_DIR, 'malgun.ttf')))
pdfmetrics.registerFont(TTFont('MalgunBd', os.path.join(FONT_DIR, 'malgunbd.ttf')))
pdfmetrics.registerFont(TTFont('MalgunSl', os.path.join(FONT_DIR, 'malgunsl.ttf')))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('Malgun', normal='Malgun', bold='MalgunBd', italic='MalgunSl', boldItalic='MalgunBd')

# ─── 색상 토큰 (사이트 디자인 시스템과 일치) ───
CREAM = HexColor('#FAF9F5')
INK = HexColor('#141413')
INK_70 = HexColor('#5C5B57')
CORAL = HexColor('#CC785C')
CORAL_700 = HexColor('#8C4D3A')
CREAM_200 = HexColor('#F1EFE7')
CREAM_300 = HexColor('#E4E1D5')

# ─── 스타일 ───
styles = getSampleStyleSheet()

def s(name, parent='Normal', **kw):
    base = styles[parent].clone(name)
    base.fontName = 'Malgun'
    for k, v in kw.items():
        setattr(base, k, v)
    return base

S_TITLE = s('Title', parent='Title', fontName='MalgunBd', fontSize=28, leading=34, textColor=INK, alignment=TA_LEFT, spaceAfter=12)
S_SUBTITLE = s('Subtitle', parent='Normal', fontSize=14, leading=20, textColor=INK_70, spaceAfter=8)
S_META = s('Meta', parent='Normal', fontSize=10, leading=14, textColor=INK_70)
S_H1 = s('H1', parent='Heading1', fontName='MalgunBd', fontSize=20, leading=26, textColor=CORAL_700, spaceBefore=18, spaceAfter=10)
S_H2 = s('H2', parent='Heading2', fontName='MalgunBd', fontSize=15, leading=20, textColor=INK, spaceBefore=14, spaceAfter=6)
S_H3 = s('H3', parent='Heading3', fontName='MalgunBd', fontSize=12, leading=16, textColor=CORAL_700, spaceBefore=10, spaceAfter=4)
S_BODY = s('Body', fontSize=10.5, leading=16, textColor=INK, spaceAfter=6)
S_BULLET = s('Bullet', fontSize=10.5, leading=16, textColor=INK, leftIndent=14, bulletIndent=4, spaceAfter=2)
S_CALLOUT = s('Callout', fontSize=10, leading=15, textColor=INK, backColor=CREAM_200, borderPadding=8, borderRadius=4, spaceAfter=8)
S_CODE = s('Code', fontName='Courier', fontSize=9, leading=13, textColor=INK, backColor=CREAM_200, borderPadding=6)
S_SMALL = s('Small', fontSize=9, leading=12, textColor=INK_70)

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

# ─── 페이지 데코 (헤더/푸터) ───
def on_page(canvas, doc):
    canvas.saveState()
    # 상단 헤더
    canvas.setFillColor(INK_70)
    canvas.setFont('Malgun', 8)
    canvas.drawString(MARGIN, PAGE_H - 10*mm, 'SKKU-STEM Lab Website — Admin Manual')
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 10*mm, 'v1.1 / 2026-05')
    canvas.setStrokeColor(CREAM_300)
    canvas.line(MARGIN, PAGE_H - 12*mm, PAGE_W - MARGIN, PAGE_H - 12*mm)
    # 푸터
    canvas.setFont('Malgun', 8)
    canvas.drawString(MARGIN, 10*mm, 'skkustem.org/admin')
    canvas.drawRightString(PAGE_W - MARGIN, 10*mm, str(canvas.getPageNumber()))
    canvas.line(MARGIN, 12*mm, PAGE_W - MARGIN, 12*mm)
    canvas.restoreState()

def on_first_page(canvas, doc):
    canvas.saveState()
    # 표지 배경 — cream-200 상단 띠
    canvas.setFillColor(CREAM_200)
    canvas.rect(0, PAGE_H - 75*mm, PAGE_W, 75*mm, fill=1, stroke=0)
    # 푸터
    canvas.setFillColor(INK_70)
    canvas.setFont('Malgun', 8)
    canvas.drawString(MARGIN, 10*mm, 'skkustem.org/admin')
    canvas.drawRightString(PAGE_W - MARGIN, 10*mm, '1')
    canvas.restoreState()

# ─── 콘텐츠 빌더 헬퍼 ───
def H1(t): return Paragraph(t, S_H1)
def H2(t): return Paragraph(t, S_H2)
def H3(t): return Paragraph(t, S_H3)
def P(t): return Paragraph(t, S_BODY)
def Bul(items):
    return ListFlowable(
        [ListItem(Paragraph(t, S_BULLET), leftIndent=12, bulletColor=CORAL) for t in items],
        bulletType='bullet', start='•', leftIndent=14, bulletFontName='Malgun',
        bulletFontSize=10, spaceAfter=8,
    )
def Code(t): return Paragraph(f'<font name="Courier">{t}</font>', S_CODE)
def Note(t): return Paragraph(f'<b>※ 참고:</b> {t}', S_CALLOUT)
def Warn(t): return Paragraph(f'<b>⚠ 주의:</b> {t}', s('Warn', parent='Normal', fontSize=10, leading=15, textColor=INK,
                                                          backColor=HexColor('#FFF2CC'), borderPadding=8, spaceAfter=8))
def TableSimple(data, col_widths=None):
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('FONT', (0,0), (-1,-1), 'Malgun', 9),
        ('FONT', (0,0), (-1,0), 'MalgunBd', 9),
        ('TEXTCOLOR', (0,0), (-1,0), CREAM),
        ('BACKGROUND', (0,0), (-1,0), CORAL_700),
        ('TEXTCOLOR', (0,1), (-1,-1), INK),
        ('BACKGROUND', (0,1), (-1,-1), CREAM_200),
        ('LINEBELOW', (0,0), (-1,-1), 0.3, CREAM_300),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    return t

# ─── 콘텐츠 ───
story = []

# === 표지 ===
story.append(Spacer(1, 30*mm))
story.append(Paragraph('SKKU-STEM Lab Website', s('CoverEyebrow', fontName='Malgun', fontSize=11, leading=14, textColor=CORAL_700)))
story.append(Spacer(1, 4*mm))
story.append(Paragraph('웹사이트 관리자 매뉴얼', s('CoverTitle', fontName='MalgunBd', fontSize=32, leading=40, textColor=INK, spaceAfter=4)))
story.append(Paragraph('Content management via Sveltia CMS at <font color="#CC785C">skkustem.org/admin</font>',
                       s('CoverSub', fontName='Malgun', fontSize=14, leading=18, textColor=INK_70)))
story.append(Spacer(1, 60*mm))
story.append(Paragraph(
    '본 매뉴얼은 SKKU-STEM 연구실의 학생 관리자가 웹사이트의 News, Members, Publications 등을 GitHub 인증 후 ' \
    '관리자 페이지(<font color="#CC785C">/admin</font>)에서 직접 편집·게시할 수 있도록 절차를 안내합니다. ' \
    '편집 → 저장 시 main 브랜치에 자동 commit되며 1~3분 내 라이브 사이트에 반영됩니다.',
    s('Intro', fontSize=11, leading=17, textColor=INK)))
story.append(Spacer(1, 10*mm))
story.append(Paragraph('성균관대학교 에너지과학과 김영민 교수 연구실', S_META))
story.append(Paragraph('v1.1 — 2026년 5월 갱신', S_META))
story.append(PageBreak())

# === 목차 ===
story.append(H1('목차'))
toc = [
    ('1. 개요', '사이트 구조와 CMS의 위치'),
    ('2. 사전 준비', 'GitHub 계정, 조직 권한'),
    ('3. 로그인 절차', '/admin 접속 → GitHub OAuth'),
    ('4. 화면 구성', '컬렉션 목록, 항목 목록, 편집 화면'),
    ('5. 콘텐츠별 작업 가이드', '각 컬렉션의 추가·수정·삭제'),
    ('  공통 — 미디어 입력', '이미지 / GIF / YouTube 리스트'),
    ('  5.0 Home', '히어로 슬라이드 + Research highlights 카드'),
    ('  5.1 News 새 글 추가', '논문 / 수상 / 발표 / 이벤트 게시'),
    ('  5.2 Members 추가·수정·졸업 처리', '신입 등록, 사진 업로드, alumni 이동'),
    ('  5.3 Publications · SKKU SCI 추가', '신규 논문 등록'),
    ('  5.4 Publications · Pre-SKKU / Non-SCI · Patents / PI Selected', '하위 3개 컬렉션'),
    ('  5.5 Research Highlights 추가', '대표 연구 timeline 항목'),
    ('  5.6 Research Themes', 'PI 결정 영역 — 6개 thrust'),
    ('  5.7 Facilities', '장비 정보 갱신'),
    ('  5.8 Gallery Events', '연구실 사진/미디어 업로드 (CMS 직접)'),
    ('6. 자주 하는 작업 — 빠른 참조', '체크리스트 형식'),
    ('7. 주의사항·금지 사항', '슬러그, 이미지, 화학식 등'),
    ('8. 문제 해결 (Troubleshooting)', '로그인 실패, 라이브 미반영 등'),
    ('9. 자주 묻는 질문', 'FAQ'),
    ('부록 A — 컬렉션 필드 cheat sheet', '한 눈에 보는 필드 의미'),
    ('부록 B — 워크플로 다이어그램', '편집 → 저장 → 빌드 → 라이브'),
]
for left, right in toc:
    style = s('TocRow', fontSize=10, leading=14, textColor=INK, leftIndent=2)
    story.append(Paragraph(f'{left} <font color="#5C5B57">— {right}</font>', style))
story.append(PageBreak())

# === 1. 개요 ===
story.append(H1('1. 개요'))
story.append(P('SKKU-STEM Lab 웹사이트는 Astro 5 정적 사이트 생성기로 구축되었으며, 콘텐츠는 GitHub 저장소 ' \
               '(<font name="Courier">SKKU-STEM/skku-stem-website</font>) 에 마크다운/JSON 파일로 저장됩니다. ' \
               '관리자 페이지는 Sveltia CMS를 사용하며, 학생이 GitHub에서 직접 파일을 편집할 필요 없이 ' \
               '웹 폼 인터페이스로 콘텐츠를 추가·수정·삭제할 수 있습니다.'))

story.append(H2('전체 흐름 요약'))
story.append(Bul([
    '관리자가 <b>skkustem.org/admin</b> 접속',
    'GitHub 계정으로 로그인 (조직 멤버 권한 필요)',
    '편집 → 저장 → main 브랜치에 자동 commit',
    'Cloudflare Pages가 자동 빌드 (1~3분 소요)',
    '<b>skkustem.org</b> 라이브 사이트에 반영',
]))

story.append(H2('관리 가능한 콘텐츠'))
story.append(TableSimple([
    ['#', '컬렉션', '용도'],
    ['1', 'Home', '히어로 슬라이드(최대 3장) + Research highlights 카드(2장)'],
    ['2', 'Publications · SKKU SCI', 'SKKU 부임 후(2016~) SCI 논문'],
    ['3', 'Publications · Pre-SKKU SCI', '부임 전(~2015) SCI 논문'],
    ['4', 'Publications · Non-SCI & Patents', '특허 / 비SCI 논문 / 단행본'],
    ['5', 'Publications · PI Selected', 'PI 페이지에 노출하는 대표 논문'],
    ['6', 'News', '논문 / 수상 / 발표 / 이벤트 등 소식'],
    ['7', 'Members', '연구원 / 학생 / 졸업생 (alumni)'],
    ['8', 'Research Themes', '6개 thrust (PI 결정 영역)'],
    ['9', 'Research Highlights', '/research 의 연도별 대표 연구'],
    ['10', 'Facilities', '장비/시설 정보'],
    ['11', 'Gallery Events', '연구실 사진 모음 (그룹 단위)'],
], col_widths=[12*mm, 56*mm, 100*mm]))
story.append(Note('Publications가 4개 하위 컬렉션으로 분리되어 사이드바에는 총 11개 항목이 표시됩니다. ' \
                  'Home은 히어로 슬라이드와 홈 상단 Research highlights 카드를 담는 파일 모음입니다.'))
story.append(PageBreak())

# === 2. 사전 준비 ===
story.append(H1('2. 사전 준비'))

story.append(H2('필요한 것'))
story.append(Bul([
    'GitHub 계정 (개인 계정)',
    'SKKU-STEM GitHub 조직(<font name="Courier">https://github.com/SKKU-STEM</font>) 의 멤버 권한',
    '최신 브라우저 (Chrome, Edge, Firefox, Safari 모두 OK)',
    '안정적인 인터넷 연결',
]))

story.append(H2('첫 사용자 — 권한 받기'))
story.append(Bul([
    '본인의 GitHub 사용자명을 PI 또는 사이트 관리 책임자에게 전달',
    '조직(<font name="Courier">SKKU-STEM</font>) 멤버 초대 메일 수신 → <b>Accept invitation</b> 클릭',
    'GitHub 프로필에서 SKKU-STEM 조직 멤버로 표시되는지 확인',
]))

story.append(H2('관리자 ID / 비밀번호 안내'))
story.append(Note('CMS 자체에 별도 ID/비밀번호가 없습니다. <b>GitHub 계정의 ID와 비밀번호로 로그인</b>합니다. ' \
                  '본 매뉴얼에서 민감 정보는 <font name="Courier">*****</font> 로 표시되며, 실제 값은 PI 또는 ' \
                  '사이트 관리 책임자에게 직접 전달받습니다.'))

story.append(TableSimple([
    ['항목', '값'],
    ['로그인 방식', 'GitHub OAuth'],
    ['GitHub 사용자 ID', '*****'],
    ['GitHub 비밀번호', '*****'],
    ['(2FA 사용 시) 백업 코드', '*****'],
    ['SKKU-STEM 조직 권한', 'Member 또는 Owner'],
], col_widths=[60*mm, 108*mm]))

story.append(PageBreak())

# === 3. 로그인 절차 ===
story.append(H1('3. 로그인 절차'))

story.append(H2('첫 단계 — 관리자 페이지 접속'))
story.append(Bul([
    '브라우저에서 <font name="Courier"><font color="#CC785C">https://skkustem.org/admin</font></font> 입력',
    '또는 라이브 사이트 어디에서든 URL 끝에 <font name="Courier">/admin</font> 추가',
]))

story.append(H2('두 번째 단계 — GitHub 로그인'))
story.append(Bul([
    '"<b>Sign in with GitHub</b>" 버튼 클릭',
    '팝업으로 GitHub 인증 창 → 본인 계정 ID / 비밀번호 (<font name="Courier">*****</font>) 입력',
    '2단계 인증(2FA) 사용 중이면 인증 코드 입력',
    '"<b>Authorize SKKU-STEM</b>" 클릭으로 권한 부여',
]))
story.append(Note('첫 로그인 시에만 GitHub의 권한 요청 화면이 나타납니다. 이후에는 자동으로 인증됩니다 (브라우저 세션 유지 시).'))

story.append(H2('세 번째 단계 — CMS 화면 진입'))
story.append(Bul([
    '인증 완료 후 자동으로 CMS 메인 화면으로 이동',
    '왼쪽 사이드바에 컬렉션 목록 표시 (Home · Publications · News · Members 등)',
    '오른쪽 영역에 선택한 컬렉션의 항목 목록',
]))

story.append(Warn('GitHub 로그인 시 비밀번호가 브라우저에 저장될 수 있습니다. 공용 PC 사용 후에는 ' \
                  'GitHub에서 로그아웃 + 브라우저 쿠키 삭제 권장.'))

story.append(PageBreak())

# === 4. 화면 구성 ===
story.append(H1('4. 화면 구성'))

# 스크린샷 삽입 (있으면)
shot = 'docs/admin-sveltia-collections.jpg'
if os.path.exists(shot):
    img = Image(shot, width=160*mm, height=90*mm, kind='proportional')
    story.append(img)
    story.append(Paragraph('관리자 메인 화면 — 좌측 컬렉션, 우측 항목 목록', S_SMALL))
    story.append(Spacer(1, 4*mm))

story.append(H2('주요 영역'))
story.append(Bul([
    '<b>좌측 사이드바</b>: 컬렉션 목록 + 검색창',
    '<b>중앙 영역</b>: 선택한 컬렉션의 항목 목록 (제목 / 날짜 / 상태)',
    '<b>우측 상단 "+"</b>: 새 항목 추가',
    '<b>각 항목 클릭</b>: 편집 화면 (필드별 폼)',
    '<b>편집 화면 우측 상단</b>: <b>Save</b> 버튼 — 클릭 시 GitHub에 commit',
]))

story.append(H2('편집 화면 공통 구성'))
story.append(Bul([
    '<b>좌측 폼</b>: 필드명 + 입력 위젯 (텍스트 / 숫자 / 셀렉트 / 이미지 업로드 등)',
    '<b>우측 미리보기</b>: 일부 컬렉션은 마크다운 미리보기 자동 갱신',
    '<b>상단 툴바</b>: <b>Save</b> / 뒤로 가기 / 미리보기 토글',
]))

story.append(PageBreak())

# === 5. 콘텐츠별 작업 가이드 ===
story.append(H1('5. 콘텐츠별 작업 가이드'))
story.append(P('각 컬렉션의 신규 추가·수정·삭제 절차입니다. 모든 작업의 마지막은 <b>Save 버튼 클릭</b>이며, ' \
               '저장 시 자동으로 GitHub main 브랜치에 commit됩니다.'))

# 공통 — 미디어 입력
story.append(H2('공통 — 미디어(이미지·GIF·동영상) 입력'))
story.append(P('Home의 Research highlights, News, Gallery는 모두 같은 <b>Media 리스트</b> 위젯을 씁니다. ' \
               '슬롯을 추가한 뒤 각 슬롯에 <b>이미지/GIF 업로드</b> 또는 <b>YouTube URL</b> 중 하나를 채웁니다.'))
story.append(Bul([
    '이미지/GIF는 잘리지 않고 전체가 보이도록 표시되며, GIF는 원본 그대로 재생됩니다.',
    '슬롯이 2개 이상이면 자동으로 넘어가는 캐러셀, 1개면 단일 이미지로 표시됩니다.',
    'YouTube는 URL만 붙여넣으면 썸네일이 뜨고, 방문자가 클릭하면 그 자리에서 재생됩니다.',
    'Alt text는 이미지 설명(접근성)이며, Gallery에서 비우면 행사 제목이 자동으로 들어갑니다.',
]))
story.append(Note('예전의 "Photo count + 파일명 규칙(slug-1.jpg) + git push" 방식은 폐지되었습니다. ' \
                  '이제 모든 사진/동영상을 CMS에서 바로 업로드·입력합니다.'))

# 5.0 Home
story.append(H2('5.0 Home — 히어로 슬라이드 + Research highlights'))
story.append(P('<b>Home</b> 컬렉션은 두 개의 파일로 구성됩니다 — 첫 화면 상단의 히어로 슬라이드쇼와 그 아래 Research highlights 카드.'))
story.append(H3('히어로 슬라이드 (최대 3장)'))
story.append(Bul([
    '좌측 <b>Home</b> → <b>Hero slideshow</b> 파일 열기',
    'Slides 리스트에 사진 추가 (최대 3장, 위에서부터 순서대로 자동 재생)',
    '각 슬라이드: <b>Photo</b>(4:3, 1600×1200px 이상 권장) · <b>Alt text</b> · <b>Caption</b>(사진 위 작은 설명, 선택)',
    '첫 장이 가장 먼저(그리고 가장 크게) 보이므로 대표 사진을 맨 위에',
    '<b>Save</b>',
]))
story.append(H3('Research highlights 카드 (홈 상단, 2장)'))
story.append(Bul([
    '좌측 <b>Home</b> → <b>Research highlights (홈 카드 2장)</b> 열기',
    '<b>Eyebrow</b>: 저널·연도 등 작은 라벨 (예: "Reports on Progress in Physics · 2026")',
    '<b>Title</b>: 카드 제목 — 클릭하면 아래 <b>Link</b>로 이동',
    '<b>Summary</b>: 한두 문장 설명',
    '<b>Link</b>: 제목 클릭 시 열릴 URL (논문 DOI·보도자료·영상 등)',
    '<b>Media</b>: 대표 이미지/GIF/YouTube (위 "공통 — 미디어 입력" 참고)',
    '<b>Save</b>',
]))
story.append(Note('Research highlights 카드는 홈 전용으로 직접 고르는 2장입니다. /research 페이지의 timeline과는 별개로 관리됩니다.'))

# 5.1 News
story.append(H2('5.1 News 새 글 추가'))
story.append(P('<b>언제 추가하나요?</b> 새 논문 출판 / 학생 수상 / 발표·세미나 / 신입 환영 / 졸업 / 행사 등'))
story.append(H3('단계'))
story.append(Bul([
    '좌측에서 <b>News</b> 클릭',
    '우측 상단 <b>"+ News"</b> 클릭',
    '필드 채우기 (아래 표 참고)',
    '<b>Save</b> 클릭',
    '1~3분 후 라이브 <font name="Courier">/news</font> 에 노출 확인',
]))
story.append(H3('필드 설명'))
story.append(TableSimple([
    ['필드', '의미', '예시'],
    ['Order', '0~∞, 작을수록 위 (최신=0)', '0'],
    ['Slug', 'URL용 영문 ID (중복 금지)', '2026-rpp-silver-films'],
    ['Year', '연도', '2026'],
    ['Date', '자유 형식 날짜', 'May 2026'],
    ['Category', 'paper / award / media / member / event / grant / lab', 'paper'],
    ['Headline', '한 줄 제목', '"Reports on Progress in Physics features ..."'],
    ['Summary', '2~4 문장 요약 (선택)', '본문 요약'],
    ['Links', '관련 URL 배열 (선택)', '[{href, label}]'],
    ['Media', '이미지/GIF/YouTube 리스트 (선택)', '공통 안내 참고'],
    ['Featured', '★ 강조 표시 (선택)', 'true / false'],
], col_widths=[28*mm, 70*mm, 70*mm]))
story.append(Note('<b>Slug</b>는 한 번 정해지면 RSS feed의 link로 영구 사용되니 처음부터 신중하게. ' \
                  '예: "2026-rpp-silver-films" 형식 (연도-저널약자-키워드).'))

# 5.2 Members
story.append(H2('5.2 Members 추가·수정·졸업 처리'))
story.append(H3('신입 멤버 추가'))
story.append(Bul([
    '좌측 <b>Members</b> → <b>"+ Member"</b>',
    'Section: <b>postdoc / phd / undergrad / alumni</b> 중 선택',
    'Order: 같은 섹션 내 표시 순서 (작을수록 위)',
    'Name (KO): 한국어 이름',
    'Name (EN): 영문 이름',
    'Position / Program / Year range / Email / ORCID / KRI: 해당되는 항목 입력',
    'Photo: 이미지 업로드 (사진 업로드 절차는 5.2 마지막 참고)',
    '<b>Save</b>',
]))
story.append(H3('졸업 처리 — Alumni로 이동'))
story.append(Bul([
    '해당 멤버 항목 열기',
    'Section을 <b>alumni</b>로 변경',
    'Role 필드 추가: 예 "Ph.D. (2018–2024)"',
    'Current affiliation: 졸업 후 소속 (예: "KAIST", "Lam Research", "KRISS")',
    '<b>Save</b>',
]))
story.append(H3('사진 업로드'))
story.append(Bul([
    'Photo 필드 옆 <b>"이미지 선택"</b> 클릭',
    '파일 선택 다이얼로그에서 jpg/png 업로드 (권장: 600×800 이상, 3:4 비율)',
    '파일명은 영문 이니셜 권장 (예: <font name="Courier">EBP.jpg</font>)',
    '저장 후 자동으로 webp 변환 + 240w/480w 두 가지 크기로 빌드됨',
]))

# 5.3 Publications · SKKU SCI
story.append(H2('5.3 Publications · SKKU SCI 추가'))
story.append(P('<b>언제 추가하나요?</b> 본인이 저자로 참여한 신규 SCI 논문 출판 시 (SKKU 부임 2016년 이후)'))
story.append(H3('단계'))
story.append(Bul([
    '좌측 <b>Publications · SKKU SCI</b> → <b>SKKU SCI papers</b> 클릭',
    'Entries 목록 우측 상단 <b>"+"</b> 로 새 entry 추가',
    '필드 채우기 (Number는 기존 최댓값 + 1)',
    '<b>Save</b>',
]))
story.append(H3('필드 설명'))
story.append(TableSimple([
    ['필드', '의미'],
    ['ID', 'Number와 동일하게 (예: "230")'],
    ['Number', '논문 일련번호 (기존 최댓값+1, 정수)'],
    ['Year', '출판 연도'],
    ['Lead author group?', '우리 그룹이 1저자/교신이면 true (체크)'],
    ['Authors', '저자 전체 목록. 우리 그룹은 † 또는 *로 표시.'],
    ['Title', '논문 제목 (화학식은 V_O 와 같이 마크업)'],
    ['Journal', '저널명 (정식 표기)'],
    ['Volume / pages', '예: "112(3), 1234–1245" (선택)'],
    ['DOI URL', 'https://doi.org/... 형식'],
], col_widths=[55*mm, 113*mm]))
story.append(Warn('<b>Lead author group?</b> 체크는 site의 coral 강조와 모달 분류에 직결됩니다. 잘못 표시하면 ' \
                  'theme 모달에 빠지거나 잘못 들어갈 수 있으니 신중하게.'))

# 5.4 Other publications
story.append(H2('5.4 Publications · Pre-SKKU / Non-SCI · Patents / PI Selected'))
story.append(Bul([
    '<b>Pre-SKKU SCI</b>: PI 부임 전(~2015) SCI 논문. 일반적으로 학생이 추가하지 않음 (PI 조정 영역).',
    '<b>Non-SCI &amp; Patents</b>: 특허 / 비SCI 논문 / 단행본. <b>Kind</b> 필드에서 patent/non-sci/book 선택.',
    '<b>PI Selected</b>: PI 페이지에 노출되는 대표 논문 24편. <b>Category</b>는 microscopy / ai 중 선택.',
]))
story.append(P('상세 필드는 본 컬렉션의 편집 화면 hint 참고. 일반적으로 학생이 직접 추가하기 전에 PI 확인 필수.'))

# 5.5 Research Highlights
story.append(H2('5.5 Research Highlights 추가'))
story.append(P('<b>언제 추가하나요?</b> 새 논문이 출판되어 /research 페이지의 연도별 timeline에 ' \
               '대표 연구로 노출하고 싶을 때.'))
story.append(H3('단계'))
story.append(Bul([
    '좌측 <b>Research Highlights</b> → <b>"+ Highlight"</b>',
    'Year, Title, Summary, Journal, Volume/pages, DOI URL 입력',
    'Code URL, Press mention text/URL: 해당되면 입력',
    'Figure: 4:3 비율 이미지 업로드 (선택, 없으면 placeholder)',
    'Order: 작을수록 위 (보통 0 또는 1)',
    '<b>Save</b>',
]))
story.append(Note('Highlight를 추가하면 자동으로 /research 페이지의 해당 연도 timeline에 합류합니다.'))

# 5.6 Research Themes
story.append(H2('5.6 Research Themes (PI 결정 영역)'))
story.append(P('6개 thrust 카드는 PI가 직접 정의·관리하므로 <b>학생은 일반적으로 수정하지 않습니다.</b> ' \
               '오타 수정이 필요한 경우에만 해당 theme을 열어 수정 후 PI에게 검토 요청.'))
story.append(P('관련 논문은 <b>자동 분류</b>됩니다 — Publications · SKKU SCI에 새 lead-author 논문을 추가하면 ' \
               '다음 빌드(1~3분)에서 자동으로 해당 theme 모달에 등장합니다.'))

# 5.7 Facilities
story.append(H2('5.7 Facilities'))
story.append(P('JEM-ARM300F, ARM200F 등 장비 정보. 새 장비 도입 또는 사양 변경 시 수정.'))
story.append(Bul([
    'Title: 장비 명칭',
    'Model: 모델명 (예: "JEM-ARM300F")',
    'Description: 본문',
    'Highlights: 주요 사양 bullet 배열',
    'Location: 설치 위치 (선택)',
    'Photo count: 첨부 사진 개수',
]))

# 5.8 Gallery
story.append(H2('5.8 Gallery Events'))
story.append(P('연구실 행사 / 단체 사진을 그룹 단위로 등록.'))
story.append(Bul([
    '좌측 <b>Gallery Events</b> → <b>"+ Event"</b>',
    'Year, Date, Title (KR), Title EN, Location, Participants, Awards 입력',
    '<b>Media</b>: 사진/GIF를 <b>CMS에서 직접 업로드</b>하거나 YouTube URL 추가 (위 "공통 — 미디어 입력" 참고)',
    '여러 장 올리면 자동으로 캐러셀로 넘어갑니다',
    '<b>Save</b>',
]))
story.append(Note('이제 사진을 CMS에서 바로 업로드합니다 — 예전처럼 slug-N.jpg 파일명을 맞춰 git push할 필요가 없습니다.'))

story.append(PageBreak())

# === 6. 자주 하는 작업 — 빠른 참조 ===
story.append(H1('6. 자주 하는 작업 — 빠른 참조'))
story.append(P('가장 많이 사용되는 5가지 시나리오. 위 5장 가이드의 핵심만 추렸습니다.'))

story.append(H3('① 새 논문 출판 → News + Publication 등록'))
story.append(Bul([
    'Publications · SKKU SCI에 entry 추가 (Number, Year, Authors, Title, Journal, DOI)',
    'News에 새 글 추가 (Category=paper, Headline에 저널·핵심 내용)',
    '둘 다 Save → 1~3분 후 라이브',
]))

story.append(H3('② 학생 졸업 → Alumni 이동'))
story.append(Bul([
    'Members → 해당 학생 열기',
    'Section을 alumni로 변경 + Role / Current affiliation 입력',
    'Save',
]))

story.append(H3('③ 신입 학생 등록'))
story.append(Bul([
    'Members → "+ Member"',
    'Section / Order / Name (KO/EN) / Position / Program / Year range / Email / Photo',
    'Save',
]))

story.append(H3('④ 학생 수상 / 발표'))
story.append(Bul([
    'News → "+" → Category=award (또는 event)',
    'Headline, Summary, Date 입력',
    'Save',
]))

story.append(H3('⑤ 그룹 사진 업로드 (행사 후)'))
story.append(Bul([
    'Gallery Events → "+ Event"',
    'Year / Date / Title / Participants 입력',
    'Media 리스트에 사진을 직접 업로드 (여러 장이면 캐러셀, GIF·YouTube도 가능)',
    'Save',
]))

story.append(PageBreak())

# === 7. 주의사항 ===
story.append(H1('7. 주의사항·금지 사항'))

story.append(H2('절대 하지 말아야 할 것'))
story.append(Warn('아래 행동은 사이트를 망가뜨리거나 콘텐츠를 영구 손실시킬 수 있습니다.'))
story.append(Bul([
    '<b>Slug 중복</b> — 같은 slug로 여러 항목 만들지 말 것 (URL 충돌)',
    '<b>Number 중복</b> — Publications에서 같은 Number 두 번 사용 금지 (기존 최댓값+1)',
    '<b>Section enum 외 값</b> — Members.section은 postdoc/phd/undergrad/alumni만 가능',
    '<b>Category enum 외 값</b> — News.category는 paper/award/media/member/event/grant/lab만',
    '<b>다른 사람 작업 도중 같은 항목 동시 편집</b> — Save 시 conflict 가능, 동시 편집 피하기',
]))

story.append(H2('이미지 업로드 규칙'))
story.append(Bul([
    '포트레이트(member): 3:4 비율, 600×800 이상',
    '논문/highlight figure: 4:3 비율, 800×600 이상',
    '단체사진(gallery): 가로 1200 이상',
    '파일 형식: <b>jpg / png</b> (자동 webp 변환)',
    '파일 크기: 1MB 이하 권장 (대용량은 빌드 느려짐)',
]))

story.append(H2('한국어 입력'))
story.append(Bul([
    'Members.nameKo는 반드시 한국어',
    '나머지 텍스트는 기본 영어 (사이트 전체가 영문 우선)',
    'News.summary 등 본문에 한국어 사용 가능 (자동 인덱싱은 영어 우선)',
]))

story.append(H2('화학식 마크업'))
story.append(P('아래 단축 표기를 그대로 입력하면 사이트에서 자동으로 형식화됩니다.'))
story.append(TableSimple([
    ['입력', '결과'],
    ['V_O', 'V<sub>O</sub> (산소 공격)'],
    ['Li_2O', 'Li<sub>2</sub>O'],
    ['HfO_2', 'HfO<sub>2</sub>'],
    ['x10^3', 'x10<sup>3</sup>'],
], col_widths=[40*mm, 50*mm]))

story.append(PageBreak())

# === 8. Troubleshooting ===
story.append(H1('8. 문제 해결 (Troubleshooting)'))

story.append(H2('로그인이 안 됩니다'))
story.append(Bul([
    'GitHub 사용자 이름 / 비밀번호가 정확한지 확인',
    'SKKU-STEM 조직 멤버 권한 확인 (PI 또는 관리 책임자에게 문의)',
    '브라우저 쿠키 삭제 후 재시도',
    '시크릿/InPrivate 창에서 시도',
]))

story.append(H2('저장(Save)했는데 라이브에 반영 안 됩니다'))
story.append(Bul([
    '1~3분 기다려 보세요 (Cloudflare Pages 빌드 시간)',
    'GitHub <font name="Courier">SKKU-STEM/skku-stem-website</font> 저장소의 commit 히스토리 확인',
    'Cloudflare Pages 대시보드의 Deployments 탭 확인 — 빌드 실패 시 빨간 X',
    '빌드 실패면 PI 또는 Claude에게 문의 (필드 검증 오류, enum 위반 등 가능)',
]))

story.append(H2('편집 화면이 빈 폼으로 뜹니다'))
story.append(Bul([
    '브라우저 새로고침 (F5)',
    '브라우저 콘솔(F12) 에러 메시지 확인',
    '로그아웃 후 재로그인',
]))

story.append(H2('이미지 업로드가 안 됩니다'))
story.append(Bul([
    '파일 크기 5MB 이하인지 확인',
    '파일 형식 jpg/png/webp 중 하나인지 확인',
    'GitHub 권한 확인 (commit 권한 있어야 업로드 가능)',
]))

story.append(H2('실수로 항목을 삭제했어요'))
story.append(Bul([
    'GitHub 저장소의 commit history에서 직전 commit을 revert (관리자 권한)',
    '또는 PI / Claude에게 즉시 알려 복구 요청',
    '삭제 후 다음 빌드까지 1~3분 시간이 있으니 빠르게 알리는 게 좋음',
]))

story.append(PageBreak())

# === 9. FAQ ===
story.append(H1('9. 자주 묻는 질문 (FAQ)'))

faqs = [
    ('CMS에서 편집한 내용이 즉시 적용되나요?',
     '아닙니다. Save 시 GitHub에 commit되고 Cloudflare Pages가 자동으로 빌드한 뒤 라이브에 반영됩니다. ' \
     '보통 1~3분 정도 소요됩니다.'),
    ('두 명이 동시에 다른 항목을 편집해도 되나요?',
     '네, 다른 항목이면 문제 없습니다. 단 같은 항목을 동시에 편집하면 나중에 저장한 사람이 ' \
     '앞 사람 변경을 덮어쓸 수 있으니 피해야 합니다.'),
    ('영어 / 한국어 어느 쪽을 기본으로 작성하나요?',
     '사이트 전체가 영문 우선입니다. Members의 한국어 이름과 News의 본문 일부에만 한국어를 사용합니다.'),
    ('논문에 있는 화학식·수식은 어떻게 표현하나요?',
     '7장의 "화학식 마크업" 섹션 참고. V_O, Li_2O 같은 단축 표기를 그대로 입력하면 자동으로 형식화됩니다.'),
    ('PI Selected Publications는 학생이 수정해도 되나요?',
     '일반적으로 PI 결정 영역입니다. 추가/삭제는 PI 확인 후, 오타 수정만 학생이 직접 가능.'),
    ('내 작업이 다른 사람 작업과 충돌(conflict)되었습니다.',
     'GitHub merge conflict가 발생한 경우 Sveltia CMS에서 에러 표시됩니다. 이 경우 PI 또는 Claude에게 ' \
     '문의하여 conflict 해결 요청. 본인이 git에 익숙하면 직접 resolve 가능합니다.'),
    ('뉴스를 잘못 올렸어요. 빠르게 수정하려면?',
     '같은 항목을 다시 열어 수정 후 Save. 라이브 반영은 다시 1~3분 소요. ' \
     '삭제하려면 우측 상단의 메뉴 → Delete.'),
    ('비밀번호를 잊어버렸습니다.',
     'GitHub 자체의 비밀번호 재설정 절차를 따르세요 (github.com/password_reset). ' \
     'CMS 별도 비밀번호는 없습니다.'),
]
for q, a in faqs:
    story.append(Paragraph(f'<b>Q. {q}</b>', s('FaqQ', fontSize=11, leading=15, textColor=CORAL_700, spaceBefore=8, spaceAfter=2)))
    story.append(Paragraph(f'A. {a}', s('FaqA', fontSize=10, leading=15, textColor=INK, spaceAfter=6)))

story.append(PageBreak())

# === 부록 A — 컬렉션 필드 cheat sheet ===
story.append(H1('부록 A — 컬렉션 필드 cheat sheet'))
story.append(P('각 컬렉션의 핵심 필드를 한 눈에. <b>필수</b> 표시는 비워두면 저장 안 됨.'))

story.append(H2('News'))
story.append(TableSimple([
    ['필드', 'enum / 형식', '필수?'],
    ['order', '정수', 'O'],
    ['slug', '영문 ID', 'O'],
    ['year', '정수', 'O'],
    ['date', '자유 문자열', 'O'],
    ['category', 'paper/award/media/member/event/grant/lab', 'O'],
    ['headline', '문자열', 'O'],
    ['summary', '여러 줄 텍스트', '-'],
    ['links', '[{href, label}] 배열', '-'],
    ['media', '[{image|youtube, alt}] 배열', '-'],
    ['featured', 'boolean', '-'],
], col_widths=[35*mm, 90*mm, 25*mm]))

story.append(H2('Members'))
story.append(TableSimple([
    ['필드', 'enum / 형식', '필수?'],
    ['section', 'postdoc/phd/undergrad/alumni', 'O'],
    ['order', '정수', 'O'],
    ['nameKo', '한국어', 'O'],
    ['nameEn', '영문', 'O'],
    ['position', '문자열', '-'],
    ['program', '문자열', '-'],
    ['yearRange', '예: "2020–"', '-'],
    ['email', 'youngmk@skku.edu 형식', '-'],
    ['orcid', '0000-0000-0000-0000', '-'],
    ['kri', 'KRI 식별자', '-'],
    ['coAdvisor', '문자열', '-'],
    ['photoPath', '/members/INIT.jpg', '-'],
    ['role', '예: "Ph.D. (2018–2024)"', '- (alumni만)'],
    ['currentAffiliation', '예: "KAIST"', '- (alumni만)'],
], col_widths=[42*mm, 88*mm, 25*mm]))

story.append(H2('Publications · SKKU SCI'))
story.append(TableSimple([
    ['필드', '형식', '필수?'],
    ['id', '문자열 (number와 동일)', 'O'],
    ['number', '정수 (기존 최댓값+1)', 'O'],
    ['year', '정수', 'O'],
    ['lead', 'boolean', 'O'],
    ['authors', '여러 줄 텍스트', 'O'],
    ['title', '여러 줄 텍스트', 'O'],
    ['journal', '문자열', 'O'],
    ['volumePages', '문자열', '-'],
    ['doi', 'https://doi.org/... URL', '-'],
], col_widths=[35*mm, 105*mm, 25*mm]))

story.append(PageBreak())

# === 부록 B — 워크플로 ===
story.append(H1('부록 B — 워크플로 다이어그램'))
story.append(P('편집부터 라이브 반영까지의 전체 흐름:'))
story.append(Spacer(1, 4*mm))

# 단순 텍스트 다이어그램
diag = '''
[학생 관리자]
      ↓ 1) skkustem.org/admin 접속
[Sveltia CMS 로그인 화면]
      ↓ 2) GitHub OAuth 인증 (***** 로그인)
[CMS 메인 화면 — 컬렉션 목록]
      ↓ 3) 컬렉션 선택 → 항목 추가/수정
[편집 폼]
      ↓ 4) Save 클릭
[GitHub 자동 commit]
      ↓ 5) main 브랜치에 push (자동, SKKU-STEM author 명의)
[Cloudflare Pages 자동 빌드]
      ↓ 6) Astro build + Pagefind 인덱스 생성 + OG 카드 생성 (1~3분)
[skkustem.org 라이브 사이트]
      ↓ 7) 변경 내용 노출
[방문자 확인]
'''
story.append(Paragraph(f'<font name="Courier">{diag.replace(chr(10), "<br/>")}</font>',
                       s('Diag', fontName='Courier', fontSize=10, leading=14, textColor=INK,
                         backColor=CREAM_200, borderPadding=10)))

story.append(Spacer(1, 8*mm))
story.append(H2('관련 외부 시스템'))
story.append(TableSimple([
    ['시스템', '역할', 'URL'],
    ['GitHub 저장소', '콘텐츠 + 코드 저장', 'github.com/SKKU-STEM/skku-stem-website'],
    ['Cloudflare Pages', '자동 빌드 + 호스팅', 'dash.cloudflare.com (관리자만)'],
    ['Sveltia CMS', '관리자 UI', 'skkustem.org/admin'],
    ['라이브 사이트', '공개 페이지', 'skkustem.org'],
], col_widths=[40*mm, 50*mm, 78*mm]))

story.append(Spacer(1, 12*mm))
story.append(P('<b>문의 / 권한 요청:</b> ' \
               '<font color="#CC785C">youngmk@skku.edu</font> (PI) 또는 사이트 관리 책임자.'))
story.append(Paragraph('본 매뉴얼의 최신 버전은 GitHub 저장소의 <font name="Courier">docs/</font> 디렉토리에 PDF로 보관됩니다.', S_SMALL))

# ─── PDF 빌드 ───
def build():
    out_path = 'docs/SKKU-STEM_Admin_Manual.pdf'
    os.makedirs('docs', exist_ok=True)
    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN + 4*mm, bottomMargin=MARGIN + 4*mm,
        title='SKKU-STEM Lab Website — Admin Manual',
        author='SKKU-STEM Lab',
    )
    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
    size = os.path.getsize(out_path)
    print(f'  {out_path}  ({size/1024:.0f} KB)')

if __name__ == '__main__':
    build()
