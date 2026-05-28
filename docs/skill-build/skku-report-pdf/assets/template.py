# SKKU Report PDF — Platypus builder (Pretendard typography, A4 with header/footer chrome)
# 사용: from template import H1, H2, H3, P, Bul, Note, Warn, Code, TableSimple, cover, toc, build
# 호출자는 story 리스트를 빌드해 build(story, ...) 한 번 호출하면 PDF 생성.
import os
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, Image,
)

# ─── 폰트 등록 (스킬 번들 내 Pretendard) ───
FONT_DIR = Path(__file__).parent / 'fonts'
pdfmetrics.registerFont(TTFont('Pretendard', str(FONT_DIR / 'Pretendard-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Pretendard-Bold', str(FONT_DIR / 'Pretendard-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Pretendard-Medium', str(FONT_DIR / 'Pretendard-Medium.ttf')))
pdfmetrics.registerFont(TTFont('Pretendard-Light', str(FONT_DIR / 'Pretendard-Light.ttf')))
registerFontFamily(
    'Pretendard',
    normal='Pretendard',
    bold='Pretendard-Bold',
    italic='Pretendard-Light',       # Pretendard에는 italic이 없어 Light로 대체 (의도된 동작)
    boldItalic='Pretendard-Bold',
)

# ─── 디자인 토큰 (SKKU-STEM 사이트와 일치) ───
CREAM = HexColor('#FAF9F5')
INK = HexColor('#141413')
INK_70 = HexColor('#5C5B57')
CORAL = HexColor('#CC785C')
CORAL_700 = HexColor('#8C4D3A')
CREAM_200 = HexColor('#F1EFE7')
CREAM_300 = HexColor('#E4E1D5')
WARN_YELLOW = HexColor('#FFF2CC')

# ─── 스타일 ───
_base = getSampleStyleSheet()

def _s(name, parent='Normal', **kw):
    base = _base[parent].clone(name)
    base.fontName = 'Pretendard'
    for k, v in kw.items():
        setattr(base, k, v)
    return base

S_COVER_EYEBROW = _s('CoverEyebrow', fontName='Pretendard-Medium', fontSize=11, leading=14, textColor=CORAL_700)
S_COVER_TITLE = _s('CoverTitle', fontName='Pretendard-Bold', fontSize=32, leading=40, textColor=INK, spaceAfter=4)
S_COVER_SUB = _s('CoverSub', fontSize=14, leading=18, textColor=INK_70)
S_INTRO = _s('Intro', fontSize=11, leading=17, textColor=INK)
S_META = _s('Meta', fontSize=10, leading=14, textColor=INK_70)

S_H1 = _s('H1', parent='Heading1', fontName='Pretendard-Bold', fontSize=20, leading=26, textColor=CORAL_700, spaceBefore=18, spaceAfter=10)
S_H2 = _s('H2', parent='Heading2', fontName='Pretendard-Bold', fontSize=15, leading=20, textColor=INK, spaceBefore=14, spaceAfter=6)
S_H3 = _s('H3', parent='Heading3', fontName='Pretendard-Bold', fontSize=12, leading=16, textColor=CORAL_700, spaceBefore=10, spaceAfter=4)

S_BODY = _s('Body', fontSize=10.5, leading=16, textColor=INK, spaceAfter=6)
S_BULLET = _s('Bullet', fontSize=10.5, leading=16, textColor=INK, leftIndent=14, bulletIndent=4, spaceAfter=2)
S_SMALL = _s('Small', fontSize=9, leading=12, textColor=INK_70)

S_CALLOUT = _s('Callout', fontSize=10, leading=15, textColor=INK, backColor=CREAM_200, borderPadding=8, spaceAfter=8)
S_WARN = _s('Warn', fontSize=10, leading=15, textColor=INK, backColor=WARN_YELLOW, borderPadding=8, spaceAfter=8)
S_CODE = _s('Code', fontName='Courier', fontSize=9, leading=13, textColor=INK, backColor=CREAM_200, borderPadding=6)
S_TOC = _s('TocRow', fontSize=10, leading=14, textColor=INK, leftIndent=2)
S_FAQ_Q = _s('FaqQ', fontSize=11, leading=15, textColor=CORAL_700, spaceBefore=8, spaceAfter=2)
S_FAQ_A = _s('FaqA', fontSize=10, leading=15, textColor=INK, spaceAfter=6)

# ─── 페이지 데코 (헤더/푸터) ───
PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

class PageChrome:
    """페이지 헤더/푸터 렌더러 — build()에서 doc_title/version/footer_url을 받아 closure 형태로 전달."""
    def __init__(self, doc_title, doc_version, doc_footer_url, cover_band=True):
        self.title = doc_title
        self.version = doc_version
        self.footer_url = doc_footer_url
        self.cover_band = cover_band

    def on_first_page(self, canvas, doc):
        canvas.saveState()
        if self.cover_band:
            canvas.setFillColor(CREAM_200)
            canvas.rect(0, PAGE_H - 75*mm, PAGE_W, 75*mm, fill=1, stroke=0)
        canvas.setFillColor(INK_70)
        canvas.setFont('Pretendard', 8)
        canvas.drawString(MARGIN, 10*mm, self.footer_url)
        canvas.drawRightString(PAGE_W - MARGIN, 10*mm, '1')
        canvas.restoreState()

    def on_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(INK_70)
        canvas.setFont('Pretendard', 8)
        canvas.drawString(MARGIN, PAGE_H - 10*mm, self.title)
        canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 10*mm, self.version)
        canvas.setStrokeColor(CREAM_300)
        canvas.line(MARGIN, PAGE_H - 12*mm, PAGE_W - MARGIN, PAGE_H - 12*mm)
        canvas.drawString(MARGIN, 10*mm, self.footer_url)
        canvas.drawRightString(PAGE_W - MARGIN, 10*mm, str(canvas.getPageNumber()))
        canvas.line(MARGIN, 12*mm, PAGE_W - MARGIN, 12*mm)
        canvas.restoreState()

# ─── 콘텐츠 빌더 헬퍼 ───
def H1(text):
    """대단원 헤딩. 코랄-700 굵게 20pt. 페이지 상단 큰 섹션 구분."""
    return Paragraph(text, S_H1)

def H2(text):
    """소단원 헤딩. 잉크 굵게 15pt. H1 안의 주요 분류."""
    return Paragraph(text, S_H2)

def H3(text):
    """세부 헤딩. 코랄-700 굵게 12pt. H2 안의 단계·세부 항목."""
    return Paragraph(text, S_H3)

def P(text):
    """본문 paragraph. 10.5pt, 16 leading."""
    return Paragraph(text, S_BODY)

def Small(text):
    """캡션·각주. 9pt, 회색."""
    return Paragraph(text, S_SMALL)

def Bul(items):
    """코랄 bullet 리스트. items는 문자열 배열 (HTML 인라인 태그 허용)."""
    return ListFlowable(
        [ListItem(Paragraph(t, S_BULLET), leftIndent=12, bulletColor=CORAL) for t in items],
        bulletType='bullet', start='•', leftIndent=14,
        bulletFontName='Pretendard', bulletFontSize=10, spaceAfter=8,
    )

def Note(text):
    """참고 callout. cream-200 배경."""
    return Paragraph(f'<b>※ 참고:</b> {text}', S_CALLOUT)

def Warn(text):
    """경고 callout. 노란 배경."""
    return Paragraph(f'<b>⚠ 주의:</b> {text}', S_WARN)

def Code(text):
    """코드/명령어 박스. Courier 9pt."""
    return Paragraph(f'<font name="Courier">{text}</font>', S_CODE)

def Faq(question, answer):
    """FAQ 한 쌍 — 질문(코랄) + 답변(잉크). 리턴값은 flowable 리스트."""
    return [
        Paragraph(f'<b>Q. {question}</b>', S_FAQ_Q),
        Paragraph(f'A. {answer}', S_FAQ_A),
    ]

def TableSimple(data, col_widths=None):
    """표준 표 — 첫 행이 헤더(코랄-700 배경, cream 텍스트), 나머지는 cream-200 body."""
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), 'Pretendard', 9),
        ('FONT', (0, 0), (-1, 0), 'Pretendard-Bold', 9),
        ('TEXTCOLOR', (0, 0), (-1, 0), CREAM),
        ('BACKGROUND', (0, 0), (-1, 0), CORAL_700),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('BACKGROUND', (0, 1), (-1, -1), CREAM_200),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, CREAM_300),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return t

def cover(eyebrow, title, subtitle, intro=None, footer_meta_lines=None):
    """표지 페이지 — cream-200 상단 띠 + 큰 제목 + 본문 + footer 메타.
    호출자는 build()의 cover_band=True (기본)를 그대로 두면 표지 페이지가 cream 띠와 함께 렌더됨.
    리턴값은 story flowables — story 맨 앞에 append하고 PageBreak()를 뒤에 둘 것."""
    out = []
    out.append(Spacer(1, 30*mm))
    out.append(Paragraph(eyebrow, S_COVER_EYEBROW))
    out.append(Spacer(1, 4*mm))
    out.append(Paragraph(title, S_COVER_TITLE))
    if subtitle:
        out.append(Paragraph(subtitle, S_COVER_SUB))
    out.append(Spacer(1, 60*mm))
    if intro:
        out.append(Paragraph(intro, S_INTRO))
        out.append(Spacer(1, 10*mm))
    for line in footer_meta_lines or []:
        out.append(Paragraph(line, S_META))
    out.append(PageBreak())
    return out

def toc(entries):
    """간단한 목차 — entries는 [(left_label, right_hint), ...] 튜플 리스트."""
    out = [H1('목차')]
    for left, right in entries:
        out.append(Paragraph(
            f'{left} <font color="#5C5B57">— {right}</font>' if right else left,
            S_TOC,
        ))
    out.append(PageBreak())
    return out

# ─── 메인 빌더 ───
def build(story, out_path,
          doc_title='Report',
          doc_version='v1.0',
          doc_footer_url='example.org',
          author='SKKU-STEM Lab',
          cover_band=True):
    """story 리스트를 PDF로 emit. on_first_page에 cream 상단 띠(cover_band) 자동."""
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 4*mm, bottomMargin=MARGIN + 4*mm,
        title=doc_title, author=author,
    )
    chrome = PageChrome(doc_title, doc_version, doc_footer_url, cover_band=cover_band)
    doc.build(story, onFirstPage=chrome.on_first_page, onLaterPages=chrome.on_page)
    return out_path
