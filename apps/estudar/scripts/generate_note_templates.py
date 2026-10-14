#!/usr/bin/env python3
"""Generate the printable A4 and Markdown study templates from one catalog.

Requires reportlab. Run from any directory:
    python3 scripts/generate_note_templates.py

Set NOTE_TEMPLATE_FONT_DIR to a folder containing Ubuntu-R.ttf/Ubuntu-B.ttf
or DejaVuSans.ttf/DejaVuSans-Bold.ttf to override automatic font discovery.
"""

from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
import re
import unicodedata

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


APP_DIR = Path(__file__).resolve().parents[1]
PAGE_W, PAGE_H = A4
MARGIN = 48.0
INK = colors.HexColor("#242724")
MUTED = colors.HexColor("#656A65")
BORDER = colors.HexColor("#B8BDB7")
RULE = colors.HexColor("#D9DDD6")
BODY_BOTTOM = 62.0
FONT_REGULAR = "TemplateSans"
FONT_BOLD = "TemplateSansBold"
WRITING_LINE_GAP = 21.0


def clean(value: str) -> str:
    """Keep accents and replace typographic dashes with printable ASCII hyphens."""
    return unicodedata.normalize("NFC", re.sub("[\u2010-\u2015\u2212]", "-", value))


def register_fonts() -> None:
    home = Path.home()
    override = os.environ.get("NOTE_TEMPLATE_FONT_DIR")
    directories = ([Path(override)] if override else []) + [
        home / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/fonts",
        home / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype",
        Path("/usr/share/fonts/truetype/dejavu"),
        Path("/Library/Fonts"),
    ]
    for directory in directories:
        for regular, bold in (
            ("Ubuntu-R.ttf", "Ubuntu-B.ttf"),
            ("DejaVuSans.ttf", "DejaVuSans-Bold.ttf"),
        ):
            if (directory / regular).exists() and (directory / bold).exists():
                pdfmetrics.registerFont(TTFont(FONT_REGULAR, str(directory / regular)))
                pdfmetrics.registerFont(TTFont(FONT_BOLD, str(directory / bold)))
                return
    raise FileNotFoundError("Set NOTE_TEMPLATE_FONT_DIR to an Ubuntu or DejaVu font directory.")


def wrap_text(text: str, width: float, font: str, size: float) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in clean(text).split():
        candidate = f"{line} {word}".strip()
        if line and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(line)
            line = word
        else:
            line = candidate
        if pdfmetrics.stringWidth(line, font, size) > width:
            raise ValueError(f"Unbreakable text exceeds its box: {line!r}")
    return lines + ([line] if line else [])


def draw_text_block(
    doc: canvas.Canvas, text: str, x: float, top: float, width: float,
    *, font: str = FONT_REGULAR, size: float = 9.0,
    leading: float = 12.0, color: colors.Color = INK,
) -> float:
    doc.setFont(font, size)
    doc.setFillColor(color)
    lines = wrap_text(text, width, font, size)
    baseline = top - size
    for line in lines:
        doc.drawString(x, baseline, line)
        baseline -= leading
    return top - max(0, len(lines)) * leading


def draw_header(doc: canvas.Canvas, template: dict) -> float:
    width = PAGE_W - 2 * MARGIN
    doc.setFillColor(MUTED)
    doc.setFont(FONT_BOLD, 7.5)
    doc.drawString(MARGIN, PAGE_H - 44, "ESTUDAR / MODELOS DE ANOTAÇÃO")
    y = draw_text_block(
        doc, template["title"], MARGIN, PAGE_H - 61, width,
        font=FONT_BOLD, size=23, leading=28,
    )
    y -= 8
    y = draw_text_block(
        doc, template["description"], MARGIN, y, width,
        size=9.2, leading=12.2, color=MUTED,
    )
    y -= 8
    y = draw_text_block(
        doc, f"Como preencher: {template['howToUse']}", MARGIN, y, width,
        size=8.5, leading=11.5, color=INK,
    )
    y -= 22
    # Two columns leave useful space for handwriting in every metadata field.
    gap = 22
    field_width = (width - gap) / 2
    metadata = template["metadata"]
    for index, label in enumerate(metadata):
        col, row = index % 2, index // 2
        x = MARGIN + col * (field_width + gap)
        row_y = y - row * 32
        label_text = clean(label)
        doc.setFillColor(MUTED)
        doc.setFont(FONT_REGULAR, 8)
        doc.drawString(x, row_y, label_text)
        label_width = pdfmetrics.stringWidth(label_text, FONT_REGULAR, 8)
        doc.setStrokeColor(BORDER)
        doc.setLineWidth(0.45)
        doc.line(x + label_width + 7, row_y - 1, x + field_width, row_y - 1)
    return y - math.ceil(len(metadata) / 2) * 32 - 7


def draw_section(doc: canvas.Canvas, section: dict, x: float, top: float, width: float, height: float) -> None:
    bottom = top - height
    if bottom < BODY_BOTTOM - 0.1:
        raise ValueError(f"Section below safe page boundary: {section['label']}")
    doc.setStrokeColor(BORDER)
    doc.setLineWidth(0.55)
    doc.rect(x, bottom, width, height, stroke=1, fill=0)
    label_bottom = draw_text_block(
        doc, section["label"], x + 12, top - 10, width - 24,
        font=FONT_BOLD, size=9, leading=11.2,
    )
    hint_bottom = draw_text_block(
        doc, section["hint"], x + 12, label_bottom - 4, width - 24,
        size=8, leading=10.2, color=MUTED,
    )
    line_top = hint_bottom - 17
    if line_top < bottom + 10:
        raise ValueError(f"Section has no handwriting space: {section['label']}")
    doc.setStrokeColor(RULE)
    doc.setLineWidth(0.35)
    while line_top >= bottom + 12:
        doc.line(x + 12, line_top, x + width - 12, line_top)
        line_top -= WRITING_LINE_GAP


def draw_page(doc: canvas.Canvas, template: dict, page_number: int | None = None, total: int | None = None) -> None:
    doc.setFillColor(colors.white)
    doc.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    top = draw_header(doc, template)
    width = PAGE_W - 2 * MARGIN
    body_height = top - BODY_BOTTOM
    sections = template["sections"]
    gap = 9.0
    if template["layout"] == "cornell":
        if len(sections) != 3:
            raise ValueError("Cornell requires cues, notes and summary, in that order.")
        summary_height = max(110.0, body_height * 0.23)
        main_height = body_height - summary_height - gap
        cues_width = (width - gap) * 0.29
        notes_width = width - gap - cues_width
        draw_section(doc, sections[0], MARGIN, top, cues_width, main_height)
        draw_section(doc, sections[1], MARGIN + cues_width + gap, top, notes_width, main_height)
        draw_section(doc, sections[2], MARGIN, top - main_height - gap, width, summary_height)
    elif template["layout"] == "sections":
        usable_height = body_height - gap * (len(sections) - 1)
        weight_sum = sum(float(section["weight"]) for section in sections)
        # Give every prompt enough room before distributing the remaining space.
        minimum_heights = []
        for section in sections:
            labels = len(wrap_text(section["label"], width - 24, FONT_BOLD, 9))
            hints = len(wrap_text(section["hint"], width - 24, FONT_REGULAR, 8))
            minimum_heights.append(10 + labels * 11.2 + 4 + hints * 10.2 + 17 + 12)
        extra_height = usable_height - sum(minimum_heights)
        if extra_height < 0:
            raise ValueError(f"Too many sections on A4: {template['id']}")
        for section, minimum in zip(sections, minimum_heights):
            height = minimum + extra_height * float(section["weight"]) / weight_sum
            draw_section(doc, section, MARGIN, top, width, height)
            top -= height + gap
    else:
        raise ValueError(f"Unknown layout: {template['layout']}")
    doc.setFillColor(MUTED)
    doc.setFont(FONT_REGULAR, 7)
    doc.drawString(MARGIN, 32, "anavanzin.com/estudar")
    footer = f"{page_number} / {total}" if page_number else "A4 / para preencher à mão"
    doc.drawRightString(PAGE_W - MARGIN, 32, footer)
    doc.showPage()


def markdown(template: dict) -> str:
    blocks = [f"# {template['title']}", template["description"], f"**Quando usar:** {template['whenToUse']}"]
    blocks.append(f"**Como preencher:** {template['howToUse']}")
    blocks.append("\n\n".join(f"**{label}:**" for label in template["metadata"]))
    for section in template["sections"]:
        blocks.extend([f"## {section['label']}", section["hint"], "[Escreva aqui]"])
    return clean("\n\n".join(blocks)) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--catalog", type=Path, default=APP_DIR / "src/data/noteTemplates.json")
    parser.add_argument("--output-dir", type=Path, default=APP_DIR / "public/templates")
    args = parser.parse_args()
    templates = json.loads(args.catalog.read_text(encoding="utf-8"))
    if not isinstance(templates, list) or len(templates) != 6:
        raise ValueError("Expected the six study templates in the shared catalog.")
    register_fonts()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    collection_path = args.output_dir / "caderno-de-modelos.pdf"
    collection = canvas.Canvas(str(collection_path), pagesize=A4, pageCompression=1, invariant=1)
    collection.setTitle("Caderno de modelos de anotação")
    collection.setAuthor("Ana Vanzin")
    collection.setSubject("Seis modelos A4 para imprimir e preencher à mão")
    for index, template in enumerate(templates, 1):
        pdf_path = args.output_dir / f"{template['id']}.pdf"
        doc = canvas.Canvas(str(pdf_path), pagesize=A4, pageCompression=1, invariant=1)
        doc.setTitle(clean(template["title"]))
        doc.setAuthor("Ana Vanzin")
        doc.setSubject("Modelo A4 para imprimir e preencher à mão")
        draw_page(doc, template)
        doc.save()
        draw_page(collection, template, index, len(templates))
        (args.output_dir / f"{template['id']}.md").write_text(markdown(template), encoding="utf-8")
        print(f"{template['id']}: {pdf_path.stat().st_size:,} bytes (PDF) + Markdown")
    collection.save()
    print(f"caderno-de-modelos: {collection_path.stat().st_size:,} bytes (PDF, {len(templates)} pages)")


if __name__ == "__main__":
    main()
