#!/usr/bin/env python3
"""Apply a lesson expansion spec to a lesson file in src/legacy/content/.

A spec is a Python file defining SPEC = dict(...) with any of:
  file        content file name, e.g. "08-product.js"           (required)
  reviewed    "YYYY-MM", shown under Sources as "Last reviewed"
  outcomes    list of extra outcome strings to append
  situation   HTML for the opening situation (inside <div class="scenario">)
  warmup      dict(q=..., a=index, opts=[(text, feedback), ...])   diagnostic question
  sections    HTML (h2 sections) inserted before "Pitfalls", else "Try it", else the checks
  after_try   HTML inserted after "Try it this week" and before the misconceptions
  myths       list of (myth, in_practice)
  recap       list of strings
  checks      list of dict(q=..., a=index, opts=[(text, feedback), ...]); replaces the old checks
  before      optional marker (e.g. "<h2>Where to go") to insert `sections` before instead
  sources     list of HTML strings appended to the sources list; cite them in new HTML as [S1], [S2] ...

Run: python3 scripts/expand_lesson.py path/to/spec.py [more specs...]
"""
import importlib.util, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "src" / "legacy" / "content"


def check_html(c, warm=False):
    lis = "\n".join(f'<li data-fb="{fb.replace(chr(34), "&quot;")}">{t}</li>' for t, fb in c["opts"])
    cls = "check warmup" if warm else "check"
    return f'<div class="{cls}" data-a="{c["a"]}"><p class="q">{c["q"]}</p><ul>\n{lis}\n</ul></div>'


def apply(spec_path):
    spec_mod = importlib.util.spec_from_file_location("spec", spec_path)
    m = importlib.util.module_from_spec(spec_mod); spec_mod.loader.exec_module(m)
    S = m.SPEC
    f = ROOT / S["file"]
    src = f.read_text()
    if "<!-- expanded -->" in src:
        print("skip (already expanded):", f.name); return
    start = src.index("String.raw`") + len("String.raw`")
    end = src.rindex("`")
    head, html, tail = src[:start], src[start:end], src[end:]

    # sources: number new ones after the existing list
    n_old = len(re.findall(r"<li", html.split('<section class="sources">')[1])) if '<section class="sources">' in html else 0
    def cite(s):
        return re.sub(r"\[S(\d+)\]", lambda mm: f"[{n_old + int(mm.group(1))}]", s)

    # opening situation and warm-up question, before the first section
    top = "<!-- expanded -->\n"
    if S.get("situation"): top += f'<div class="scenario">{cite(S["situation"])}</div>\n'
    if S.get("warmup"): top += check_html(S["warmup"], warm=True) + "\n"
    i = html.find("<h2")
    html = html[:i] + top + html[i:]

    def insert_before(markers, block):
        nonlocal html
        for mk in markers:
            j = html.find(mk)
            if j > -1:
                html = html[:j] + block + "\n" + html[j:]; return
        raise SystemExit(f"{f.name}: no insertion point among {markers}")

    if S.get("sections"):
        insert_before(([S["before"]] if S.get("before") else []) + ["<h2>Pitfalls", "<h2>Try it", '<section class="checks">'], cite(S["sections"]))

    tail_block = ""
    if S.get("after_try"): tail_block += cite(S["after_try"]) + "\n"
    if S.get("myths"):
        tail_block += "<h2>Common misconceptions</h2>\n<dl class=\"myths\">\n" + "\n".join(f"<dt>{a}</dt><dd>{cite(b)}</dd>" for a, b in S["myths"]) + "\n</dl>\n"
    if S.get("recap"):
        tail_block += "<h2>Recap</h2>\n<div class=\"recap\"><ul>\n" + "\n".join(f"<li>{x}</li>" for x in S["recap"]) + "\n</ul></div>\n"
    if tail_block:
        insert_before(['<section class="checks">'], tail_block)

    if S.get("checks"):
        a = html.index('<section class="checks">'); b = html.index("</section>", a) + len("</section>")
        html = html[:a] + '<section class="checks"><h2>Check your understanding</h2>\n' + "\n".join(check_html(c) for c in S["checks"]) + "\n</section>" + html[b:]

    if S.get("sources"):
        k = html.rindex("</ol></section>") if "</ol></section>" in html else html.rindex("</ol>")
        html = html[:k] + "".join(f"\n<li>{x}</li>" for x in S["sources"]) + "\n" + html[k:]

    if S.get("reviewed") and "reviewed:" not in head:
        head = re.sub(r'(id: "[^"]+",)', lambda mm: mm.group(1) + f'\n  reviewed: "{S["reviewed"]}",', head, count=1)
    if S.get("outcomes"):
        head = re.sub(r"(outcomes: \[)([\s\S]*?)(\n  \],)", lambda mm: mm.group(1) + mm.group(2) + "," + ",".join(f'\n    "{o}"' for o in S["outcomes"]) + mm.group(3), head, count=1)

    if "`" in html: raise SystemExit(f"{f.name}: backtick in lesson HTML would end the template string; use <code> instead")
    f.write_text(head + html + tail)
    print("expanded:", f.name)


if __name__ == "__main__":
    for p in sys.argv[1:]: apply(p)
