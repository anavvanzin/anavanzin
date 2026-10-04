#!/usr/bin/env python3
"""Fetch the original seminar webfonts and licenses for local publication.

Run with the iconocracy Python environment. Only writes the seminar fonts folder;
the global fonts and source-audit repositories remain untouched.
"""

import hashlib
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

from fontTools.ttLib import TTFont

SITE_ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = SITE_ROOT / "seminario8-dever-poder" / "fonts"
KEEP_SUBSETS = {"latin", "latin-ext"}
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)
# Preserve the families/styles in index.html, Seminario8.html and Wireframes.html.
# Continuous weight requests use the variable font axis, rather than faux weights.
FAMILIES = {
    "Geist": ("geist", "Geist:wght@300..600"),
    "Geist Mono": ("geistmono", "Geist+Mono:wght@400..500"),
    "EB Garamond": (
        "ebgaramond", "EB+Garamond:ital,wght@0,400..800;1,400..700"
    ),
    "Spectral": (
        "spectral", "Spectral:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500"
    ),
    "Caveat": ("caveat", "Caveat:wght@500..700"),
    "Source Serif 4": (
        "sourceserif4", "Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400"
    ),
    "Space Grotesk": ("spacegrotesk", "Space+Grotesk:wght@400..700"),
    # The global JetBrains files start at 400; fetch the missing 300 only.
    "JetBrains Mono": ("jetbrainsmono", "JetBrains+Mono:wght@300"),
}
SLUGS = {
    "Geist": "geist", "Geist Mono": "geist-mono", "EB Garamond": "eb-garamond",
    "Spectral": "spectral", "Caveat": "caveat", "Source Serif 4": "source-serif-4",
    "Space Grotesk": "space-grotesk", "JetBrains Mono": "jetbrains-mono",
}
LICENSE_FOLDERS = {name: folder for name, (folder, _) in FAMILIES.items()}
LICENSE_FOLDERS["Playfair Display"] = "playfairdisplay"
BLOCK_RE = re.compile(
    r"/\*\s*(?P<subset>[\w-]+)\s*\*/\s*(?P<face>@font-face\s*\{.*?\})", re.S
)


def field(face, name):
    match = re.search(rf"{name}:\s*([^;]+);", face)
    if not match:
        raise ValueError(f"Missing {name} in font-face")
    return match.group(1).strip()


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def validate_font(path, weight):
    if path.read_bytes()[:4] != b"wOF2":
        raise ValueError(f"Not a WOFF2 font: {path}")
    font = TTFont(path)
    if "fvar" in font:
        axis = next((item for item in font["fvar"].axes if item.axisTag == "wght"), None)
        requested = [float(value) for value in weight.split()]
        if axis and (min(requested) < axis.minValue or max(requested) > axis.maxValue):
            raise ValueError(f"Weight range {weight} exceeds font axis: {path}")
    font.close()


def render_face(face):
    return "\n".join([
        "@font-face {",
        f"  font-family: '{face['family']}';",
        f"  font-style: {face['style']};",
        f"  font-weight: {face['weight']};",
        "  font-display: swap;",
        f"  src: url({face['local_url']}) format('woff2');",
        f"  unicode-range: {face['unicode_range']};",
        "}",
    ])


def reused_faces():
    """Reuse existing root fonts, with their real declared weight ranges."""
    css = (SITE_ROOT / "fonts" / "fonts.css").read_text(encoding="utf-8")
    faces = []
    for block in re.findall(r"@font-face\s*\{.*?\}", css, re.S):
        family = field(block, "font-family").strip("'\"")
        if family not in {"JetBrains Mono", "Playfair Display"}:
            continue
        match = re.search(r"url\(\./([^\)]+)\)", block)
        if not match:
            raise ValueError("Unexpected global font URL")
        path = SITE_ROOT / "fonts" / match.group(1)
        weight = field(block, "font-weight")
        validate_font(path, weight)
        faces.append({
            "family": family, "style": field(block, "font-style"),
            "weight": weight, "unicode_range": field(block, "unicode-range"),
            "local_url": f"../../fonts/{path.name}",
            "source": "existing global self-hosted font",
            "sha256": sha256(path.read_bytes()), "bytes": path.stat().st_size,
        })
    if len(faces) != 6:
        raise ValueError(f"Expected 6 shared font faces, found {len(faces)}")
    return faces


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    faces, css_sources = [], []
    for family, (_, query) in FAMILIES.items():
        url = f"https://fonts.googleapis.com/css2?family={query}&display=swap"
        css_bytes = fetch(url)
        css_sources.append({"family": family, "url": url, "sha256": sha256(css_bytes)})
        selected = []
        for match in BLOCK_RE.finditer(css_bytes.decode("utf-8")):
            subset = match.group("subset")
            if subset not in KEEP_SUBSETS:
                continue
            block = match.group("face")
            url_match = re.search(r"url\((https://[^)]+\.woff2)\)", block)
            if not url_match:
                raise ValueError(f"Missing WOFF2 for {family}/{subset}")
            selected.append({
                "family": family, "style": field(block, "font-style"),
                "weight": field(block, "font-weight"), "subset": subset,
                "unicode_range": field(block, "unicode-range"),
                "source_url": url_match.group(1),
            })
        if {face["subset"] for face in selected} != KEEP_SUBSETS:
            raise ValueError(f"Missing required subsets for {family}")
        faces.extend(selected)

    urls = sorted({face["source_url"] for face in faces})
    with ThreadPoolExecutor(max_workers=6) as pool:
        downloads = dict(zip(urls, pool.map(fetch, urls)))
    written = {}
    for face in faces:
        data = downloads[face["source_url"]]
        digest = sha256(data)
        style_tag = "" if face["style"] == "normal" else f"-{face['style']}"
        weight_tag = face["weight"].replace(" ", "-")
        name = (
            f"{SLUGS[face['family']]}{style_tag}-{weight_tag}-"
            f"{face['subset'].replace('-', '')}.woff2"
        )
        if digest not in written:
            (OUT_DIR / name).write_bytes(data)
            written[digest] = name
        name = written[digest]
        validate_font(OUT_DIR / name, face["weight"])
        face.update(local_url=f"./{name}", sha256=digest, bytes=len(data))

    licenses = []
    license_urls = {
        family: f"https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/OFL.txt"
        for family, folder in LICENSE_FOLDERS.items()
    }
    with ThreadPoolExecutor(max_workers=6) as pool:
        license_data = dict(zip(license_urls, pool.map(fetch, license_urls.values())))
    for family, data in license_data.items():
        if b"SIL OPEN FONT LICENSE" not in data or b"Version 1.1" not in data:
            raise ValueError(f"Unexpected license for {family}")
        name = f"OFL-{LICENSE_FOLDERS[family]}.txt"
        (OUT_DIR / name).write_bytes(data)
        licenses.append({
            "family": family, "license": "SIL Open Font License 1.1",
            "file": name, "source_url": license_urls[family], "sha256": sha256(data),
        })

    faces.extend(reused_faces())
    header = (
        "/* Original seminar fonts, self-hosted: latin + latin-ext.\n"
        "   Licenses: OFL-*.txt; exact upstream URLs/hashes: manifest.json.\n"
        "   Shared Playfair and JetBrains 400-700 use ../../fonts/.\n"
        "   Regenerate: scripts/work-demos/seminario-fonts/fetch_fonts.py. */\n\n"
    )
    (OUT_DIR / "fonts.css").write_text(
        header + "\n\n".join(render_face(face) for face in faces) + "\n", encoding="utf-8"
    )
    manifest = {
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "generator": "scripts/work-demos/seminario-fonts/fetch_fonts.py",
        "css_sources": css_sources, "faces": faces, "licenses": licenses,
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Generated {len(faces)} faces; {len(written)} local WOFF2 files; {len(licenses)} licenses.")


if __name__ == "__main__":
    main()
