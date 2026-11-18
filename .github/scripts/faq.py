#!/usr/bin/env python3
"""Keep a FAQ page's `faq:` front matter in step with its body.

The theme builds the page's FAQPage JSON-LD from `faq:` (templates cannot read the
rendered body), so the list is generated here from the body: each `### ` heading is
a question, the text under it (links reduced to their text, a trailing "read more"
link and link-only lines dropped) is the answer.

    faq.py FILE...          rewrite the `faq:` block of each file
    faq.py --check FILE...  exit 1 if a block is stale (make lint)
"""
import json
import re
import sys

LINK = re.compile(r"\[([^\]]+)\]\([^)]+\)")
LINK_ONLY = re.compile(r"^(\[[^\]]+\]\([^)]+\)\s*(·\s*)?)+$")
TRAILING_LINK = re.compile(r"\s*\[[^\]]+\]\([^)]+\)\s*$")


def plain(text):
    return LINK.sub(r"\1", TRAILING_LINK.sub("", text)).replace("**", "").strip()


def questions(body):
    items, question, answer = [], None, []
    for line in body.split("\n") + ["#"]:
        if line.startswith("#"):
            if question:
                items.append((question, " ".join(answer)))
            question = line[4:].strip() if line.startswith("### ") else None
            answer = []
            continue
        line = line.strip()
        if not line or LINK_ONLY.match(line):
            continue
        if line.startswith("- "):
            item = plain(line[2:])
            line = item[:1].upper() + item[1:] + ("" if item[-1:] in ".?!" else ".")
        else:
            line = plain(line)
        if line:
            answer.append(line)
    return items


def render(src):
    head, front, body = src.split("---\n", 2)
    assert head == "", "the file must start with its front matter"
    front = re.sub(r"^faq:\n(?:  .*\n)*", "", front, flags=re.M)
    block = "faq:\n" + "".join(
        f"  - q: {json.dumps(q, ensure_ascii=False)}\n    a: {json.dumps(a, ensure_ascii=False)}\n"
        for q, a in questions(body))
    return f"---\n{front}{block}---\n{body}"


def main(args):
    check = args[:1] == ["--check"]
    stale = False
    for path in args[1:] if check else args:
        with open(path, encoding="utf-8") as f:
            src = f.read()
        out = render(src)
        if out == src:
            continue
        if check:
            print(f"lint: the faq: front matter of {path} is out of step with its questions — run make faq")
            stale = True
        else:
            with open(path, "w", encoding="utf-8") as f:
                f.write(out)
    return 1 if stale else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
