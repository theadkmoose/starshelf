#!/usr/bin/env python3
"""Build and enrich the speculative fiction catalog from upstream sources.

What this script does:
- Ingests local upstream sources (CSV + Reddit rankings JS)
- Deduplicates title/author variants
- Enriches metadata from Open Library + iTunes audiobook search
- Preserves curated audiobook fallback metadata for known titles
- Exports refreshed JSON to both data/books.json and website/books.json
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import subprocess
import time
import unicodedata
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
WEBSITE_JS_DIR = BASE_DIR / "website" / "js"
DATA_JSON_PATH = BASE_DIR / "data" / "books.json"
WEBSITE_JSON_PATH = BASE_DIR / "website" / "books.json"

DEFAULT_THEME = "Speculative Fiction"
DEFAULT_GENRE = "Speculative Fiction"
USER_AGENT = "SpecFicExplorerCatalogBot/1.0"

AUDIOBOOK_FALLBACK_ROWS = [
    ("A Desolation Called Peace", "Arkady Martine", 4.4, "Amy Landon"),
    ("A Fire Upon the Deep", "Vernor Vinge", 4.1, "Peter Larkin"),
    ("A Memory Called Empire", "Arkady Martine", 4.3, "Amy Landon"),
    ("All Systems Red", "Martha Wells", 4.6, "Kevin R. Free"),
    ("Anathem", "Neal Stephenson", 4.2, "William Dufris"),
    ("Children of Time", "Adrian Tchaikovsky", 4.5, "Mel Hudson"),
    ("Dune", "Frank Herbert", 4.6, "Scott Brick and ensemble cast"),
    ("Left Hand of Darkness", "Ursula K. Le Guin", 4.2, "George Guidall"),
    ("Neuromancer", "William Gibson", 4.0, "Robertson Dean"),
    ("The City & The City", "China Mieville", 4.0, "John Lee"),
    ("The Fifth Season", "N.K. Jemisin", 4.6, "Robin Miles"),
    ("The Name of the Wind", "Patrick Rothfuss", 4.7, "Nick Podehl"),
    ("The Obelisk Gate", "N.K. Jemisin", 4.5, "Robin Miles"),
    ("The Stone Sky", "N.K. Jemisin", 4.5, "Robin Miles"),
    ("The Way of Kings", "Brandon Sanderson", 4.8, "Michael Kramer and Kate Reading"),
]


@dataclass
class BookRecord:
    title: str
    author: str
    year: Optional[int] = None
    pages: Optional[int] = None
    series: Optional[str] = None
    series_number: Optional[str] = None
    standalone: Optional[bool] = None
    isbn: Optional[str] = None
    cover_url: Optional[str] = None
    publisher: Optional[str] = None
    language: Optional[str] = None
    summary: Optional[str] = None
    pov: Optional[str] = None
    ending: Optional[str] = None
    violence: Optional[str] = None
    magic: Optional[str] = None
    genre: Optional[str] = None
    pacing: Optional[str] = None
    tone: Optional[str] = None
    romance: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    reddit_rank: Optional[int] = None
    reddit_votes: Optional[int] = None
    goodreads_link: Optional[str] = None
    libby_link: Optional[str] = None
    audiobook_rating: Optional[float] = None
    audiobook_rank: Optional[int] = None
    audiobook_narrator: Optional[str] = None
    overall_rating: Optional[float] = None
    overall_rank: Optional[int] = None
    award_entries: List[Tuple[str, str]] = field(default_factory=list)
    themes_set: set = field(default_factory=set)


def normalize_text(value: str) -> str:
    text = unicodedata.normalize("NFKD", str(value or ""))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[^a-zA-Z0-9\s&]", "", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def normalize_title(value: str) -> str:
    return re.sub(r"^the\s+", "", normalize_text(value))


def book_key(title: str, author: str) -> str:
    return f"{normalize_title(title)}|{normalize_text(author)}"


def valid_title_author(title: str, author: str) -> bool:
    t = normalize_text(title)
    a = normalize_text(author)
    if not t or not a:
        return False
    if t == "title" and a == "author":
        return False
    return True


def parse_int(value) -> Optional[int]:
    try:
        if value is None or value == "":
            return None
        return int(str(value).strip())
    except Exception:
        return None


def parse_float(value) -> Optional[float]:
    try:
        if value is None or value == "":
            return None
        f = float(str(value).strip())
        return f if f > 0 else None
    except Exception:
        return None


def choose_text(*values: Optional[str]) -> Optional[str]:
    for value in values:
        if value is None:
            continue
        cleaned = str(value).strip()
        if cleaned:
            return cleaned
    return None


def fetch_json(url: str, timeout_sec: int = 12) -> Optional[dict]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as err:
        # Some local Python installs on macOS have certificate chain issues.
        # Fallback to curl so network enrichment still works reliably.
        if "CERTIFICATE_VERIFY_FAILED" not in str(err):
            return None

        try:
            result = subprocess.run(
                [
                    "curl",
                    "-fsSL",
                    "--max-time",
                    str(timeout_sec),
                    "-H",
                    f"User-Agent: {USER_AGENT}",
                    url,
                ],
                capture_output=True,
                text=True,
                check=True,
            )
            return json.loads(result.stdout)
        except Exception:
            return None


def read_csv_rows(path: Path) -> List[dict]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_reddit_rankings(path: Path) -> List[dict]:
    if not path.exists():
        return []

    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        r"\{\s*rank:\s*(\d+),\s*title:\s*\"(.*?)\",\s*votes:\s*(\d+),\s*author:\s*\"(.*?)\",\s*change:\s*\"(.*?)\"\s*\}",
        re.DOTALL,
    )

    rows = []
    for match in pattern.finditer(text):
        rows.append(
            {
                "rank": int(match.group(1)),
                "title": match.group(2).strip(),
                "votes": int(match.group(3)),
                "author": match.group(4).strip(),
                "change": match.group(5).strip(),
            }
        )
    return rows


def get_or_create(catalog: Dict[str, BookRecord], title: str, author: str) -> BookRecord:
    key = book_key(title, author)
    if key not in catalog:
        catalog[key] = BookRecord(title=title.strip(), author=author.strip())
    return catalog[key]


def ingest_local_sources(catalog: Dict[str, BookRecord]) -> None:
    books_rows = read_csv_rows(RAW_DIR / "books.csv")
    enrichment_rows = read_csv_rows(RAW_DIR / "enrichment.csv")
    awards_rows = read_csv_rows(RAW_DIR / "awards_raw.csv")
    hugo_rows = read_csv_rows(RAW_DIR / "hugo.csv")
    nebula_rows = read_csv_rows(RAW_DIR / "nebula.csv")
    reddit_rows = parse_reddit_rankings(WEBSITE_JS_DIR / "reddit-top-2025.js")

    for row in books_rows:
        title = choose_text(row.get("title"))
        author = choose_text(row.get("author"))
        if not title or not author or not valid_title_author(title, author):
            continue

        book = get_or_create(catalog, title, author)
        book.year = book.year or parse_int(row.get("year"))
        book.pages = book.pages or parse_int(row.get("pages"))
        book.series = choose_text(book.series, row.get("series"))
        book.isbn = choose_text(book.isbn, row.get("isbn"))
        book.cover_url = choose_text(book.cover_url, row.get("cover_url"), row.get("image_url"), row.get("thumbnail"))

        if book.series and normalize_text(book.series) != "standalone":
            book.standalone = False
        elif book.standalone is None:
            book.standalone = True

    enrich_by_title = {}
    for row in enrichment_rows:
        t = choose_text(row.get("title"))
        if not t:
            continue
        enrich_by_title[normalize_title(t)] = row

    for book in catalog.values():
        extra = enrich_by_title.get(normalize_title(book.title))
        if not extra:
            continue
        book.genre = choose_text(book.genre, extra.get("genre"), DEFAULT_GENRE)
        book.pacing = choose_text(book.pacing, extra.get("pacing"))
        book.tone = choose_text(book.tone, extra.get("tone"))
        book.romance = choose_text(book.romance, extra.get("romance"))
        book.difficulty = choose_text(book.difficulty, extra.get("difficulty"))

    for row in awards_rows:
        title = choose_text(row.get("title"))
        author = choose_text(row.get("author"))
        if not title or not author or not valid_title_author(title, author):
            continue
        book = get_or_create(catalog, title, author)
        award = choose_text(row.get("award")) or "Award"
        status = choose_text(row.get("status")) or "Mention"
        year = parse_int(row.get("year"))
        if year and not book.year:
            book.year = year
        book.award_entries.append((award, status))

    for row in hugo_rows:
        title = choose_text(row.get("title"))
        author = choose_text(row.get("author"))
        if not title or not author or not valid_title_author(title, author):
            continue
        book = get_or_create(catalog, title, author)
        status = choose_text(row.get("status")) or "Mention"
        year = parse_int(row.get("year"))
        if year and not book.year:
            book.year = year
        book.award_entries.append(("Hugo", status))

    for row in nebula_rows:
        title = choose_text(row.get("title"))
        author = choose_text(row.get("author"))
        if not title or not author or not valid_title_author(title, author):
            continue
        book = get_or_create(catalog, title, author)
        status = choose_text(row.get("status")) or "Mention"
        year = parse_int(row.get("year"))
        if year and not book.year:
            book.year = year
        book.award_entries.append(("Nebula", status))

    for row in reddit_rows:
        title = choose_text(row.get("title"))
        author = choose_text(row.get("author"))
        if not title or not author or not valid_title_author(title, author):
            continue

        book = get_or_create(catalog, title, author)
        rank = parse_int(row.get("rank"))
        votes = parse_int(row.get("votes"))
        if rank is not None and (book.reddit_rank is None or rank < book.reddit_rank):
            book.reddit_rank = rank
        if votes is not None and (book.reddit_votes is None or votes > book.reddit_votes):
            book.reddit_votes = votes
        if not book.genre:
            book.genre = DEFAULT_GENRE
        if book.standalone is None:
            # Most reddit rows are series/franchise level, so keep nullable-ish as non-standalone.
            book.standalone = False


def build_fallback_lookup() -> Dict[str, Tuple[float, str]]:
    lookup = {}
    for title, author, rating, narrator in AUDIOBOOK_FALLBACK_ROWS:
        lookup[book_key(title, author)] = (rating, narrator)
    return lookup


def openlibrary_enrich(book: BookRecord) -> Tuple[Optional[float], Optional[str], Optional[dict]]:
    term = urllib.parse.quote(f"{book.title} {book.author}")
    search_url = f"https://openlibrary.org/search.json?q={term}&limit=5"
    data = fetch_json(search_url)
    if not data:
        return None, None, None

    docs = data.get("docs") or []
    if not docs:
        return None, None, None

    title_norm = normalize_title(book.title)
    candidate = None
    book_author_norm = normalize_text(book.author)
    for doc in docs:
        doc_title = normalize_title(str(doc.get("title") or ""))
        if not doc_title:
            continue

        # Keep covers/metadata accurate by requiring a strong title match,
        # with optional author corroboration when available.
        strong_title_match = (
            doc_title == title_norm
            or title_norm in doc_title
            or doc_title in title_norm
        )

        if not strong_title_match:
            continue

        doc_author_blob = " ".join(
            [str(name) for name in (doc.get("author_name") or []) if name]
        )
        doc_author_norm = normalize_text(doc_author_blob)
        if doc_author_norm and book_author_norm:
            if book_author_norm not in doc_author_norm and doc_author_norm not in book_author_norm:
                continue

        candidate = doc
        break

    if candidate is None:
        return None, None, None

    book.year = book.year or parse_int(candidate.get("first_publish_year"))
    book.pages = book.pages or parse_int(candidate.get("number_of_pages_median"))

    isbn_values = candidate.get("isbn") or []
    if isbn_values and not book.isbn:
        book.isbn = choose_text(isbn_values[0])

    if not book.cover_url and candidate.get("cover_i"):
        book.cover_url = f"https://covers.openlibrary.org/b/id/{candidate['cover_i']}-L.jpg"

    work_key = choose_text(candidate.get("key"))
    if work_key and work_key.startswith("/works/"):
        rating_payload = fetch_json(f"https://openlibrary.org{work_key}/ratings.json")
        if rating_payload and isinstance(rating_payload.get("summary"), dict):
            avg = parse_float(rating_payload["summary"].get("average"))
            if avg:
                book.overall_rating = book.overall_rating or avg

        work_payload = fetch_json(f"https://openlibrary.org{work_key}.json")
        if work_payload:
            description = work_payload.get("description")
            if isinstance(description, dict):
                description = description.get("value")
            book.summary = choose_text(book.summary, description)

        # Try to extract narrator signals from editions for audiobook formats.
        editions = fetch_json(f"https://openlibrary.org{work_key}/editions.json?limit=30")
        narrator = None
        if editions:
            for entry in editions.get("entries") or []:
                physical_format = choose_text(entry.get("physical_format"), "") or ""
                title_text = choose_text(entry.get("title"), "") or ""
                by_statement = choose_text(entry.get("by_statement"), "") or ""
                hint_blob = f"{physical_format} {title_text} {by_statement}".lower()
                if "audio" not in hint_blob and "narrat" not in hint_blob:
                    continue

                match = re.search(r"narrated by\s+([^.;,]+)", by_statement, re.IGNORECASE)
                if match:
                    narrator = match.group(1).strip()
                    break

                contributors = entry.get("contributors") or []
                for contributor in contributors:
                    role = choose_text(contributor.get("role"), "") or ""
                    name = choose_text(contributor.get("name"), "") or ""
                    if "narrat" in role.lower() and name:
                        narrator = name
                        break
                if narrator:
                    break

                authors = entry.get("authors") or []
                if authors:
                    # Weak fallback: some OpenLibrary audiobook entries expose performer names here.
                    author_key = authors[0].get("key") if isinstance(authors[0], dict) else None
                    if author_key and "OL" in author_key:
                        narrator = None
        return book.overall_rating, narrator, candidate

    return None, None, candidate


def itunes_audiobook_enrich(book: BookRecord) -> Tuple[Optional[float], Optional[str]]:
    term = urllib.parse.quote(f"{book.title} {book.author}")
    url = f"https://itunes.apple.com/search?media=audiobook&term={term}&limit=5"
    payload = fetch_json(url)
    if not payload:
        return None, None

    results = payload.get("results") or []
    if not results:
        return None, None

    title_norm = normalize_title(book.title)
    best = None
    for row in results:
        name = normalize_title(str(row.get("collectionName") or row.get("trackName") or ""))
        if title_norm and title_norm in name:
            best = row
            break
    if best is None:
        best = results[0]

    narrator = choose_text(best.get("artistName"))
    rating = parse_float(best.get("averageUserRating"))
    return rating, narrator


def add_links_and_themes(book: BookRecord) -> None:
    query = urllib.parse.quote(f"{book.title} {book.author}")
    if not book.goodreads_link:
        book.goodreads_link = f"https://www.goodreads.com/search?q={query}"
    if not book.libby_link:
        book.libby_link = f"https://libbyapp.com/search/query-{query}"

    if not book.cover_url and book.isbn:
        isbn_clean = re.sub(r"[^0-9Xx]", "", book.isbn)
        if isbn_clean:
            book.cover_url = f"https://covers.openlibrary.org/b/isbn/{isbn_clean}-L.jpg?default=false"

    if not book.genre:
        book.genre = DEFAULT_GENRE

    if not book.themes_set:
        book.themes_set.add(DEFAULT_THEME)

    book.themes_set.add(book.genre)

    if book.tone:
        book.themes_set.add(f"Tone: {book.tone}")
    if book.pacing:
        book.themes_set.add(f"Pacing: {book.pacing}")
    if book.difficulty:
        book.themes_set.add(f"Difficulty: {book.difficulty}")
    if book.romance:
        book.themes_set.add(f"Romance: {book.romance}")


def assign_ranks(records: List[BookRecord]) -> None:
    overall_ranked = [b for b in records if b.overall_rating]
    overall_ranked.sort(key=lambda b: b.overall_rating, reverse=True)
    for idx, book in enumerate(overall_ranked, start=1):
        book.overall_rank = idx

    audio_ranked = [b for b in records if b.audiobook_rating]
    audio_ranked.sort(key=lambda b: b.audiobook_rating, reverse=True)
    for idx, book in enumerate(audio_ranked, start=1):
        book.audiobook_rank = idx


def award_summary(award_entries: Iterable[Tuple[str, str]]) -> Optional[str]:
    seen = set()
    formatted = []
    for award, status in award_entries:
        value = f"{award} ({status})"
        key = normalize_text(value)
        if key in seen:
            continue
        seen.add(key)
        formatted.append(value)
    return " | ".join(formatted) if formatted else None


def to_export_rows(records: List[BookRecord]) -> List[dict]:
    rows = []
    for idx, book in enumerate(sorted(records, key=lambda b: (normalize_title(b.title), normalize_text(b.author))), start=1):
        themes_text = " | ".join(sorted(book.themes_set, key=lambda t: normalize_text(t)))
        rows.append(
            {
                "id": idx,
                "title": book.title,
                "author": book.author,
                "year": book.year,
                "pages": book.pages,
                "series": book.series,
                "series_number": book.series_number,
                "standalone": 1 if book.standalone else 0,
                "isbn": book.isbn,
                "cover_url": book.cover_url,
                "publisher": book.publisher,
                "language": book.language,
                "summary": book.summary,
                "pov": book.pov,
                "ending": book.ending,
                "violence": book.violence,
                "magic": book.magic,
                "genre": book.genre,
                "pacing": book.pacing,
                "tone": book.tone,
                "romance": book.romance,
                "difficulty": book.difficulty,
                "description": book.description,
                "reddit_rank": book.reddit_rank,
                "reddit_votes": book.reddit_votes,
                "goodreads_link": book.goodreads_link,
                "libby_link": book.libby_link,
                "audiobook_rating": round(book.audiobook_rating, 2) if book.audiobook_rating else None,
                "audiobook_rank": book.audiobook_rank,
                "audiobook_narrator": book.audiobook_narrator,
                "overall_rating": round(book.overall_rating, 2) if book.overall_rating else None,
                "overall_rank": book.overall_rank,
                "award_summary": award_summary(book.award_entries),
                "themes": themes_text,
            }
        )
    return rows


def enrich_with_network(records: List[BookRecord], max_books: int, sleep_ms: int, use_network: bool) -> None:
    if not use_network:
        return

    for idx, book in enumerate(records):
        if idx >= max_books:
            break

        openlibrary_enrich(book)
        itunes_rating, itunes_narrator = itunes_audiobook_enrich(book)

        if itunes_rating:
            book.audiobook_rating = book.audiobook_rating or itunes_rating
        if itunes_narrator:
            # Keep external narrator only if it doesn't just echo the author name.
            if normalize_text(itunes_narrator) != normalize_text(book.author):
                book.audiobook_narrator = book.audiobook_narrator or itunes_narrator

        if sleep_ms > 0:
            time.sleep(sleep_ms / 1000.0)


def apply_audiobook_fallback(records: List[BookRecord]) -> None:
    fallback = build_fallback_lookup()
    for book in records:
        key = book_key(book.title, book.author)
        if key not in fallback:
            continue
        rating, narrator = fallback[key]
        if not book.audiobook_rating:
            book.audiobook_rating = rating
        if not book.audiobook_narrator:
            book.audiobook_narrator = narrator
        if not book.overall_rating:
            book.overall_rating = rating


def build_catalog(use_network: bool, max_network_books: int, sleep_ms: int) -> List[dict]:
    catalog: Dict[str, BookRecord] = {}
    ingest_local_sources(catalog)

    records = list(catalog.values())

    for book in records:
        add_links_and_themes(book)

    enrich_with_network(records, max_network_books, sleep_ms, use_network)
    apply_audiobook_fallback(records)
    assign_ranks(records)

    return to_export_rows(records)


def write_outputs(rows: List[dict]) -> None:
    DATA_JSON_PATH.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    WEBSITE_JSON_PATH.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh speculative fiction catalog from upstream sources")
    parser.add_argument("--no-network", action="store_true", help="Skip external API enrichment")
    parser.add_argument("--max-network-books", type=int, default=120, help="Max books to enrich from external APIs")
    parser.add_argument("--sleep-ms", type=int, default=120, help="Delay between network requests in ms")
    args = parser.parse_args()

    rows = build_catalog(
        use_network=not args.no_network,
        max_network_books=max(0, args.max_network_books),
        sleep_ms=max(0, args.sleep_ms),
    )
    write_outputs(rows)

    print(f"Wrote {len(rows)} books to {DATA_JSON_PATH}")
    print(f"Wrote {len(rows)} books to {WEBSITE_JSON_PATH}")


if __name__ == "__main__":
    main()
