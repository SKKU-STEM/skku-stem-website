---
name: skku-report-pdf
description: Builds Korean+English professional report-style PDF documents in the SKKU-STEM Lab visual language — Pretendard typography on cream canvas with coral accents, A4 pages with header/footer chrome, three-level heading hierarchy, bulleted lists, info/warning callouts, and field cheat-sheet style tables. Use whenever the user asks for a 매뉴얼, 보고서, manual, report, guide, handbook, 가이드, 안내서, 절차서, 사용 설명서, 운영 매뉴얼, training document, onboarding doc, FAQ document, or any structured PDF prose document. Encodes A4 with 18 mm margins, sticky page header showing document title + version, sticky footer with URL + page number, Pretendard 300/400/500/700, cream #FAF9F5 background, coral #CC785C accents, ink #141413 body, three-level heading hierarchy (H1 coral / H2 ink / H3 coral mini-caps), bulleted lists with coral bullets, callouts with cream-200/yellow backgrounds. Output is always a self-contained PDF rendered via reportlab Platypus. Triggers for "매뉴얼 만들어줘", "보고서 PDF로 만들어줘", "가이드 작성해줘", "안내서 만들어줘", "사용 설명서 작성해줘", "training doc 만들어줘". Apply this skill for any PDF document made of structured prose; do not use it for slide decks (use skku-energy-slide-design instead) or .docx reports.
---

# SKKU Report PDF Skill

This skill builds professional Korean+English report-style PDF documents in the visual language of the **SKKU-STEM Lab** (성균관대학교 에너지과학과 김영민 교수 연구실). It adapts the cream-tinted, coral-accented house style established for the lab website and admin manual into a structured A4 page grammar with Pretendard typography.

The output is always a **single self-contained PDF file** at A4 size, rendered with `reportlab` Platypus, with all required fonts (Pretendard 300/400/500/700) bundled in the skill.

## When to Use This Skill

Use this skill whenever the user produces a structured PDF prose document. The system applies to **every** report-shaped artifact, not just admin manuals:

- **운영·관리 매뉴얼**: 사이트 관리, 장비 운영, 실험 절차, 안전 매뉴얼
- **보고서**: 연구 보고서, 결과 보고서, 진척 보고서, BK 연차보고
- **가이드/안내서**: 신입생 안내서, 워크플로 가이드, FAQ 문서
- **training documentation**: onboarding doc, internal handbook
- **Korean or English content**: Pretendard handles both seamlessly

The system triggers on any of: "매뉴얼", "보고서", "manual", "report", "가이드", "안내서", "절차서", "사용 설명서", "training document", "handbook", "PDF 문서". When the user says "한 페이지로 정리해줘" without specifying format, use the slide skill instead — this skill is for multi-page prose PDF only.

## Six Inviolable Rules

These rules are non-negotiable. Every PDF produced under this skill must obey all six:

1. **Pretendard only.** No Malgun Gothic, no Noto Sans, no system fallbacks for the visible text. Pretendard 300/400/500/700 handle every weight class needed. Code blocks may use Courier monospace.
2. **A4 portrait only.** No letter, no A5, no landscape. Fixed 210 × 297 mm with 18 mm margins.
3. **Sticky header/footer.** Top: document title (left) + version/date (right). Bottom: URL or domain (left) + page number (right). 0.3 pt cream-300 horizontal line beneath header and above footer.
4. **Three-level heading hierarchy.** H1 (coral-700 #8C4D3A bold 20 pt) for chapters; H2 (ink #141413 bold 15 pt) for sections; H3 (coral-700 bold 12 pt) for sub-sections. Never skip levels (no H1 → H3).
5. **Cream throughout.** Canvas is `#FAF9F5` (cream). Callouts use `#F1EFE7` (cream-200) for info and `#FFF2CC` (warm yellow) for warnings. No dark backgrounds, no cool grey.
6. **Bulleted lists use coral bullets, never dashes.** Coral `#CC785C` filled circles. Indent 14 pt, leading 16 pt.

Violating any of these is a system failure, not a stylistic choice.

## Standard Workflow

When asked to make a report PDF:

1. **Plan the document structure.** Outline chapters (H1) and sections (H2) before writing. A typical lab manual has 8–12 H1 chapters; a status report has 4–6.
2. **Read `assets/template.py`.** It exposes helper functions (`H1`, `H2`, `H3`, `P`, `Bul`, `Note`, `Warn`, `Code`, `TableSimple`, `cover`, `toc`) and a `build()` function that emits the final PDF.
3. **Read `references/design-tokens.md`.** Verify color tokens, font sizes, and spacing rules before laying out new components.
4. **Read `references/layout.md`.** Understand the page chrome, cover page anatomy, and TOC layout.
5. **Write a Python script** that imports from `template.py`, builds a story list with the helpers, and calls `build(story, out_path, doc_title, doc_version, doc_footer_url)`.
6. **Mask sensitive data.** ID, password, secret tokens must always be `*****` in the visible PDF. Add a note about where to obtain the real value.
7. **Save the PDF** somewhere the user can find it — typically a `docs/` directory in the user's project, or `/mnt/user-data/outputs/` when run in a sandbox.

For multi-language content, mix Korean and English freely. Pretendard's hangul + latin coverage means no font fallback is needed for either script.

## Reference Files

Load these as needed — SKILL.md gives you the rules; references give the implementation specifics.

- **`references/design-tokens.md`** — Full color tokens, typography hierarchy, spacing scale, paragraph styles. Read before choosing any color or size.
- **`references/layout.md`** — A4 page chrome, margins, cover page anatomy, TOC layout, callout boxes. Read before laying out cover or section break.
- **`references/example.py`** — Minimal working example. Run it directly to confirm fonts and template load. Copy as starting point for new reports.

## Asset Files

- **`assets/template.py`** — The Platypus builder. Imports reportlab, registers Pretendard fonts, defines styles + helpers, and exposes `build()`. Always source from this rather than duplicating styles in caller scripts.
- **`assets/fonts/Pretendard-{Light,Regular,Medium,Bold}.ttf`** — Pretendard variable weights. Already self-contained in this skill — no external download needed.

## Quick Start

A minimal "Hello world" report:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / 'assets'))
from template import H1, H2, P, Bul, Note, build

story = []
story.append(H1('1. 개요'))
story.append(P('본 보고서는 …에 대한 결과를 정리합니다.'))
story.append(H2('주요 결과'))
story.append(Bul([
    '항목 1 — 설명',
    '항목 2 — 설명',
    '항목 3 — 설명',
]))
story.append(Note('주요 발견 사항은 부록 A에서 자세히 다룹니다.'))

build(story, out_path='example-report.pdf',
      doc_title='Example Report', doc_version='v1.0 / 2026-05',
      doc_footer_url='example.org')
```

For a fully worked example with cover, TOC, and multiple chapters, read `references/example.py`.

## Common Patterns

- **Sensitive data masking**: ID / password rows in a table become `*****` with a note explaining where to get the real value (e.g., "PI 또는 관리 책임자에게 별도 전달받음").
- **Field cheat-sheet tables**: 3-column tables with coral-700 header row, cream-200 body — used for enum lists, parameter descriptions, schema reference.
- **Step-by-step procedures**: Bulleted list with each step as one short imperative sentence. Reserve numbered ordering for explicit sequence; bullets work fine for non-strict order.
- **Troubleshooting Q&A**: Each entry as a P with `<b>Q. ...</b>` followed by `A. ...` body. No extra ornament needed.

## What This Skill Does NOT Do

- **Slides / decks**: Use `skku-energy-slide-design` instead. That skill outputs 16:9 HTML.
- **.docx reports**: Use the SKKU 지원자 분석 v2 prompt's docx workflow. That uses `python-docx` against a base template.
- **Diagrams/flowcharts**: This skill renders plain prose + tables + simple bullet flows. For complex diagrams, embed pre-rendered PNGs via `Image()`.
- **Interactive forms / fillable PDFs**: Output is read-only static prose.
