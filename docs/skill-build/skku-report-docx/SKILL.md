---
name: skku-report-docx
description: Builds Korean+English editable .docx report documents in the SKKU-STEM Lab visual language — Pretendard typography on cream-tinted pages with coral accents, A4 with header/footer chrome, three-level heading hierarchy, bulleted lists, info/warning callouts, field cheat-sheet tables, and an auto-updating TOC field. Use whenever the user asks for a Word 문서, .docx, 워드 파일, 워드 매뉴얼, 보고서 워드로, 편집 가능한 매뉴얼, 협업용 초안, team draft, editable manual/report, docx report, Word document. Encodes A4 with 18 mm margins, Pretendard 300/400/500/700 across ascii + hAnsi + eastAsia + cs (for stable Korean rendering), cream #FAF9F5 background tint via paragraph shading, coral #CC785C accents, ink #141413 body, three-level heading hierarchy (H1 coral / H2 ink / H3 coral mini-caps), bulleted lists with coral bullets, callouts with cream-200/yellow paragraph shading, Word TOC field that updates on F9. Output is a self-contained .docx file written via python-docx. Triggers for "Word로 만들어줘", "docx로 만들어줘", "워드 파일로 작성해줘", "편집 가능한 보고서", "협업용 초안 만들어줘". Apply this skill for any editable PDF-style prose document; for read-only static PDF use skku-report-pdf; for slide decks use skku-energy-slide-design.
---

# SKKU Report DOCX Skill

This skill builds professional editable Word documents in the visual language of the **SKKU-STEM Lab**. It mirrors the cream-tinted, coral-accented house style of `skku-report-pdf` but emits `.docx` for team editing, comments, and track-changes workflows.

The output is always a **single self-contained `.docx` file** at A4 size, rendered with `python-docx`, with Pretendard specified for both Latin (`ascii`/`hAnsi`) and East Asian (`eastAsia`) text frames so Korean renders correctly regardless of the viewer's default font.

## When to Use This Skill

Use this skill whenever the user wants an **editable** prose document. Trigger words include "Word로", "docx로", "워드 파일", "워드 매뉴얼", "편집 가능한", "협업용", "team draft", "초안". When the user wants a finalized, share-only document, use `skku-report-pdf` instead.

Common scenarios:
- 매뉴얼 초안 (팀이 같이 다듬을 매뉴얼)
- 협업용 보고서 (track-changes로 검토 받을 초안)
- 절차서, 운영 가이드의 편집 가능한 버전
- BK 보고서, IR/IRB 문서의 초안
- 학생이 채워야 할 폼·체크리스트가 있는 가이드

If the user's intent is unclear ("매뉴얼 만들어줘" 만 명시), Claude는 짧게 "PDF로 공유용인가요, Word로 편집 가능한 버전인가요?" 한 번 묻고 선택에 따라 이 skill 또는 `skku-report-pdf`로 진행.

## Six Inviolable Rules

These rules are non-negotiable. Every .docx produced under this skill must obey all six:

1. **Pretendard only.** All paragraph runs explicitly set `rFonts.ascii`, `rFonts.hAnsi`, `rFonts.eastAsia`, `rFonts.cs` to `Pretendard` (or `Pretendard-Bold` for headings/bold). No Calibri, no Malgun Gothic, no Apple SD Gothic Neo. Code blocks may use Courier New.
2. **A4 portrait only.** Section properties set page size to 210 × 297 mm, margins to 18 mm each side. No letter, no landscape.
3. **Sticky header/footer.** Document title (left) + version (right) in header. Domain URL (left) + auto page number (right) in footer. Same as `skku-report-pdf` chrome.
4. **Three-level heading hierarchy.** H1 (coral-700 `#8C4D3A` bold 20 pt) — overrides built-in `Heading 1`. H2 (ink `#141413` bold 15 pt) — overrides `Heading 2`. H3 (coral-700 bold 12 pt) — overrides `Heading 3`. The TOC field references these three levels.
5. **Cream-tinted callouts.** `Note(...)` uses cream-200 `#F1EFE7` paragraph shading. `Warn(...)` uses warm yellow `#FFF2CC`. Never plain bordered boxes; shading only.
6. **Bullets are coral characters, not Word default.** Use `•` (U+2022) typed inline with explicit color, not the built-in list style. This keeps the bullet color stable across Word/Pages/LibreOffice.

## Standard Workflow

When asked to make a report docx:

1. **Plan the document structure.** Outline H1 chapters and H2 sections before writing.
2. **Read `assets/template.py`.** It exposes the `Report` class with methods `cover()`, `toc()`, `h1/h2/h3()`, `p()`, `bul()`, `note()`, `warn()`, `code()`, `faq()`, `table()`, and `build()`.
3. **Read `references/design-tokens.md`** to confirm colors, sizes, spacing.
4. **Read `references/layout.md`** for cover/TOC/callout/table layout details.
5. **Write a Python script** that imports `Report`, calls the helpers in order, ends with `r.build('out.docx')`.
6. **Mask sensitive data.** ID, password, secret tokens always `*****`. Add a Note callout pointing to where to obtain real values.
7. **Save to** the user's project `docs/` or `/mnt/user-data/outputs/`.

For multi-language content, mix Korean and English freely — Pretendard handles both at every weight.

## Reference Files

- **`references/design-tokens.md`** — Color tokens, typography hierarchy, spacing. Mirrors `skku-report-pdf` skill; the design system is shared.
- **`references/layout.md`** — DOCX-specific: cover page, TOC field, paragraph shading, table cell shading, header/footer XML insertion details.
- **`references/example.py`** — Minimal working example. Run directly to confirm fonts and template load. Copy as starting point.

## Asset Files

- **`assets/template.py`** — The `Report` class. Imports python-docx, registers Pretendard via `rFonts` XML manipulation, defines styles + helpers, exposes `build()`. Always import from here rather than duplicating XML manipulation in caller scripts.

## Font Availability Note

Unlike the PDF skill, this skill **does not bundle Pretendard font files**. The .docx file references `Pretendard` by name only — the viewing machine (whoever opens the .docx) must have Pretendard installed in their system fonts for it to render correctly. If absent, Word substitutes Calibri (English) / Malgun Gothic (Korean) and the layout still works but the design drifts.

Pretendard is open-source (SIL OFL) and freely downloadable from <https://github.com/orioncactus/pretendard/releases>. The skill output includes an opening Note callout reminding the viewer to install Pretendard if it's missing.

If portability matters more than file size, the user can enable **font embedding** by manually opening the .docx in Word → File → Options → Save → "Embed fonts in the file". This embeds the TTF files in the .docx (adds ~10 MB but guarantees consistent rendering everywhere). This skill's template surfaces this option as a comment, but does not embed automatically (default = lighter file, ~50 KB).

## Quick Start

A minimal "Hello world" report:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / 'assets'))
from template import Report

r = Report(
    doc_title='Example Report',
    doc_version='v1.0 / 2026-05',
    doc_footer_url='example.org',
)
r.cover(
    eyebrow='SKKU-STEM Lab',
    title='Example Editable Report',
    subtitle='Pretendard typography, A4, ready for team review',
    intro='본 보고서는 …',
    footer_meta_lines=['성균관대학교 에너지과학과 김영민 교수 연구실', 'v1.0 — 2026년 5월'],
)
r.h1('1. 개요')
r.p('본 보고서는 …에 대한 결과를 정리합니다.')
r.h2('주요 결과')
r.bul(['항목 1 — 설명', '항목 2 — 설명', '항목 3 — 설명'])
r.note('주요 발견 사항은 부록 A에서 자세히 다룹니다.')
r.build('example-report.docx')
```

For a fully worked example with cover, TOC, FAQ, and multiple chapters, read `references/example.py`.

## Common Patterns

- **Sensitive data masking**: ID / password rows in a table become `*****` plus a Note about the real value channel.
- **Field cheat-sheet tables**: `r.table([...], col_widths=[...])` — 3-column tables with coral-700 header row, cream-200 body.
- **Step-by-step procedures**: `r.bul([...])` with each step as one imperative sentence.
- **TOC**: call `r.toc_field()` after cover. Word renders "Right-click and Update field" placeholder until the user presses F9 in Word.
- **Korean + English mix**: just write inline — Pretendard handles both. No special markup needed.

## What This Skill Does NOT Do

- **Slides / decks**: Use `skku-energy-slide-design`.
- **Read-only static PDF**: Use `skku-report-pdf`.
- **PowerPoint .pptx**: out of scope.
- **Fillable forms / track changes setup**: Output is a clean baseline; reviewers can enable Word's Review → Track Changes after opening.
- **Embedded diagrams from external sources**: Pre-render to PNG and embed via `r.image(path)` (basic helper provided).
