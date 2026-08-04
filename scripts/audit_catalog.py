#!/usr/bin/env python3
"""Create and validate a provenance manifest for the static book catalog."""

from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "docs" / "books.json"
MANIFEST_PATH = ROOT / "data" / "catalog_audit.json"
CHANGELOG_PATH = ROOT / "data" / "catalog_audit_changelog.json"


def key_for(book: dict) -> str:
    return f"{book['id']}:{book['title']}|{book['author']}"


def isbn_is_valid(value: object) -> bool:
    text = re.sub(r"[^0-9Xx]", "", str(value or ""))
    if not text:
        return True
    if len(text) == 10:
        total = sum((10 - index) * (10 if char in "Xx" else int(char)) for index, char in enumerate(text))
        return total % 11 == 0
    if len(text) == 13 and text.isdigit():
        total = sum(int(char) * (1 if index % 2 == 0 else 3) for index, char in enumerate(text))
        return total % 10 == 0
    return False


def source_record(book: dict) -> dict:
    return {
        "book_id": book["id"],
        "title": book["title"],
        "author": book["author"],
        "status": "unverified",
        "verified_at": None,
        "fields": {
            "bibliographic": {"source_url": None, "match_method": None, "confidence": "unverified"},
            "goodreads": {
                "source_url": book.get("goodreads_link"),
                "match_method": "search-link",
                "confidence": "candidate",
            },
            "wikipedia": {"source_url": None, "match_method": None, "confidence": "unverified"},
            "cover": {"source_url": None, "license": None, "confidence": "unverified"},
            "reddit_2025": {"source_url": None, "match_method": None, "confidence": "unverified"},
            "editorial": {"source_url": "internal-rubric", "match_method": "derived", "confidence": "editorial"},
        },
        "review_notes": [],
    }


def main() -> int:
    books = json.loads(CATALOG_PATH.read_text())
    existing = {}
    if MANIFEST_PATH.exists():
        existing = json.loads(MANIFEST_PATH.read_text()).get("records", {})

    errors = []
    ids = set()
    records = {}
    for book in books:
        if not book.get("id") or not book.get("title") or not book.get("author"):
            errors.append(f"required field missing: {book!r}")
            continue
        if book["id"] in ids:
            errors.append(f"duplicate id: {book['id']}")
        ids.add(book["id"])
        if book.get("year") and not (1400 <= int(book["year"]) <= date.today().year):
            errors.append(f"invalid year: {book['title']}")
        if not isbn_is_valid(book.get("isbn")):
            errors.append(f"invalid ISBN checksum: {book['title']}")
        records[key_for(book)] = existing.get(key_for(book), source_record(book))

    manifest = {
        "schema_version": 1,
        "generated_at": date.today().isoformat(),
        "catalog_path": "docs/books.json",
        "records": records,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    if not CHANGELOG_PATH.exists():
        CHANGELOG_PATH.write_text("[]\n")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Validated {len(books)} catalog records; {len(records)} audit records written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
