import json
import ssl
import sqlite3
import urllib.request
from pathlib import Path
from urllib.parse import quote

BASE_DIR = Path("../")
WEBSITE_DIR = BASE_DIR / "website"
COVERS_DIR = WEBSITE_DIR / "images" / "covers"
COVERS_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = BASE_DIR / "data" / "books.db"
connection = sqlite3.connect(DB_PATH)
cursor = connection.cursor()

DEFAULT_GENRE = "Speculative Fiction"
DEFAULT_THEME = "Speculative Fiction"
DEFAULT_SUMMARY = "Summary not yet sourced for this local record."
DEFAULT_PUBLISHER = "Publisher not yet sourced."
DEFAULT_LANGUAGE = "English"
DEFAULT_LINK = "https://example.com/unavailable"
PLACEHOLDER_VALUES = {
    DEFAULT_SUMMARY,
    DEFAULT_PUBLISHER,
    DEFAULT_LANGUAGE,
    DEFAULT_LINK,
}

SSL_CONTEXT = ssl._create_unverified_context()
LANGUAGE_MAP = {
    "eng": "English",
    "en": "English",
    "fre": "French",
    "fr": "French",
    "deu": "German",
    "ger": "German",
    "spa": "Spanish",
    "es": "Spanish",
}


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, context=SSL_CONTEXT, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def normalize_text(value):
    return (value or "").strip() if value is not None else ""


def is_placeholder_value(value):
    if value is None:
        return True
    text = normalize_text(value)
    if not text:
        return True
    if text.startswith("images/covers/"):
        return True
    if text in PLACEHOLDER_VALUES:
        return True
    return False


def normalize_language(value):
    if not value:
        return ""
    if isinstance(value, list):
        value = value[0]
    if isinstance(value, dict):
        value = value.get("key") or value.get("name") or ""
    value = str(value).strip()
    value = value.replace("/Languages/", "").replace("/languages/", "")
    value = value.split("/")[-1]
    return LANGUAGE_MAP.get(value.lower(), value.title())


def repair_collapsed_themes():
    distinct_theme_count = cursor.execute("SELECT COUNT(DISTINCT theme) FROM themes").fetchone()[0]
    if distinct_theme_count != 1:
        return

    only_theme = cursor.execute("SELECT theme FROM themes LIMIT 1").fetchone()
    if not only_theme or normalize_text(only_theme[0]).lower() != DEFAULT_THEME.lower():
        return

    cursor.execute("DELETE FROM themes")
    rows = cursor.execute("SELECT id, genre FROM books").fetchall()
    for current_book_id, current_genre in rows:
        primary_theme = normalize_text(current_genre) or DEFAULT_THEME
        cursor.execute(
            "INSERT OR IGNORE INTO themes (book_id, theme) VALUES (?, ?)",
            (current_book_id, primary_theme),
        )
        if primary_theme.lower() != DEFAULT_THEME.lower():
            cursor.execute(
                "INSERT OR IGNORE INTO themes (book_id, theme) VALUES (?, ?)",
                (current_book_id, DEFAULT_THEME),
            )


def lookup_openlibrary_fields(title: str, author: str, isbn: str = ""):
    metadata = {}

    cleaned_isbn = (isbn or "").replace("-", "").strip()
    if cleaned_isbn:
        try:
            isbn_url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{cleaned_isbn}&jscmd=data&format=json"
            data = fetch_json(isbn_url)
            book_payload = data.get(f"ISBN:{cleaned_isbn}") or {}
            if book_payload:
                publishers = book_payload.get("publishers") or []
                if publishers:
                    metadata["publisher"] = normalize_text(publishers[0].get("name"))

                page_count = book_payload.get("number_of_pages")
                if page_count:
                    metadata["pages"] = int(page_count)

                identifiers = book_payload.get("identifiers") or {}
                isbn_13 = identifiers.get("isbn_13") or []
                isbn_10 = identifiers.get("isbn_10") or []
                if isbn_13:
                    metadata["isbn"] = normalize_text(isbn_13[0])
                elif isbn_10:
                    metadata["isbn"] = normalize_text(isbn_10[0])

                if book_payload.get("cover"):
                    metadata["cover_url"] = (
                        book_payload["cover"].get("large")
                        or book_payload["cover"].get("medium")
                        or book_payload["cover"].get("small")
                    )
                else:
                    if isbn_10:
                        metadata["cover_url"] = f"https://covers.openlibrary.org/b/isbn/{isbn_10[0]}-L.jpg"

                book_key = book_payload.get("key") or ""
                if book_key:
                    book_detail = fetch_json(f"https://openlibrary.org{book_key}.json")
                    work_key = ""
                    works = book_detail.get("works") or []
                    if works:
                        first_work = works[0]
                        work_key = first_work.get("key") if isinstance(first_work, dict) else str(first_work)

                    if work_key:
                        work_detail = fetch_json(f"https://openlibrary.org{work_key}.json")
                        description_value = work_detail.get("description")
                        if description_value:
                            metadata["summary"] = normalize_text(
                                description_value.get("value") if isinstance(description_value, dict) else description_value
                            )

                        languages = work_detail.get("languages") or []
                        if languages:
                            language_key = languages[0].get("key") if isinstance(languages[0], dict) else str(languages[0])
                            metadata["language"] = normalize_language(language_key)

                    description_value = book_detail.get("description")
                    if description_value and not metadata.get("summary"):
                        metadata["summary"] = normalize_text(
                            description_value.get("value") if isinstance(description_value, dict) else description_value
                        )

                    languages = book_detail.get("languages") or []
                    if languages and not metadata.get("language"):
                        language_key = languages[0].get("key") if isinstance(languages[0], dict) else str(languages[0])
                        metadata["language"] = normalize_language(language_key)

                return metadata
        except Exception:
            pass

    search_terms = quote(f"{title} {author}".strip())
    search_url = f"https://openlibrary.org/search.json?q={search_terms}&limit=5"

    try:
        data = fetch_json(search_url)
    except Exception:
        return {}

    docs = data.get("docs") or []
    if not docs:
        return {}

    chosen_doc = None
    title_normalized = normalize_text(title).lower()
    for doc in docs:
        doc_title = normalize_text(doc.get("title")).lower()
        if title_normalized and doc_title == title_normalized:
            chosen_doc = doc
            break
        if title_normalized and title_normalized in doc_title:
            chosen_doc = doc
            break

    if chosen_doc is None:
        chosen_doc = docs[0]

    if chosen_doc.get("cover_i"):
        metadata["cover_url"] = f"https://covers.openlibrary.org/b/id/{chosen_doc['cover_i']}-L.jpg"
    else:
        isbn_values = chosen_doc.get("isbn") or []
        if isbn_values:
            metadata["cover_url"] = f"https://covers.openlibrary.org/b/isbn/{isbn_values[0]}-L.jpg"

    isbn_values = chosen_doc.get("isbn") or []
    if isbn_values and not metadata.get("isbn"):
        metadata["isbn"] = normalize_text(isbn_values[0])

    number_of_pages = chosen_doc.get("number_of_pages_median")
    if number_of_pages and not metadata.get("pages"):
        metadata["pages"] = int(number_of_pages)

    work_key = chosen_doc.get("key") or ""
    if work_key:
        try:
            work_detail = fetch_json(f"https://openlibrary.org{work_key}.json")
            description_value = work_detail.get("description")
            if description_value:
                metadata["summary"] = normalize_text(
                    description_value.get("value") if isinstance(description_value, dict) else description_value
                )

            languages = work_detail.get("languages") or []
            if languages:
                language_key = languages[0].get("key") if isinstance(languages[0], dict) else str(languages[0])
                metadata["language"] = normalize_language(language_key)
        except Exception:
            pass

        try:
            editions_data = fetch_json(f"https://openlibrary.org{work_key}/editions.json?limit=5")
            entries = editions_data.get("entries") or []
            for entry in entries:
                publishers = entry.get("publishers") or []
                if publishers:
                    metadata["publisher"] = normalize_text(publishers[0])
                    break
        except Exception:
            pass

    if not metadata.get("publisher"):
        publisher = chosen_doc.get("publisher") or []
        if publisher:
            metadata["publisher"] = normalize_text(publisher[0])

    return metadata


def write_cover_svg(book_id: int, title: str, author: str) -> str:
    safe_title = (title or "Unknown Title")[:36]
    safe_author = (author or "Unknown Author")[:34]
    cover_path = COVERS_DIR / f"cover_{book_id}.svg"
    cover_path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480">
  <rect width="320" height="480" rx="12" fill="#10182f"/>
  <rect x="18" y="18" width="284" height="444" rx="8" fill="#1d2b4b" stroke="#6e84d9" stroke-width="2"/>
  <text x="160" y="130" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#eef4ff">Speculative Fiction</text>
  <text x="160" y="190" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#f9fbff">{safe_title}</text>
  <text x="160" y="232" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#c1d1ff">{safe_author}</text>
  <text x="160" y="305" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#9bb0f6">Local placeholder cover</text>
</svg>
'''
    )
    return f"images/covers/cover_{book_id}.svg"


books = cursor.execute(
    "SELECT id, title, author, isbn, pages, genre, summary, publisher, language, cover_url, goodreads_link, libby_link, series, standalone FROM books"
).fetchall()

repair_collapsed_themes()

for book_id, title, author, isbn, pages, genre, summary, publisher, language, cover_url, goodreads_link, libby_link, series, standalone in books:
    updates = []
    params = []
    metadata = lookup_openlibrary_fields(title, author, isbn)
    search_query = quote(f"{title} {author}".strip())

    if not genre:
        updates.append("genre = ?")
        params.append(DEFAULT_GENRE)

    if not pages and metadata.get("pages"):
        updates.append("pages = ?")
        params.append(metadata["pages"])

    if not isbn and metadata.get("isbn"):
        updates.append("isbn = ?")
        params.append(metadata["isbn"])

    if is_placeholder_value(summary):
        summary_value = metadata.get("summary") or DEFAULT_SUMMARY
        updates.append("summary = ?")
        params.append(summary_value)

    if is_placeholder_value(publisher):
        publisher_value = metadata.get("publisher") or DEFAULT_PUBLISHER
        updates.append("publisher = ?")
        params.append(publisher_value)

    if is_placeholder_value(language):
        language_value = metadata.get("language") or DEFAULT_LANGUAGE
        updates.append("language = ?")
        params.append(language_value)

    if is_placeholder_value(cover_url):
        remote_cover = metadata.get("cover_url")
        if remote_cover:
            updates.append("cover_url = ?")
            params.append(remote_cover)
        else:
            generated_cover = write_cover_svg(book_id, title, author)
            updates.append("cover_url = ?")
            params.append(generated_cover)

    if not series:
        updates.append("series = ?")
        params.append("Standalone")

    if standalone is None:
        updates.append("standalone = ?")
        params.append(1)

    if is_placeholder_value(goodreads_link):
        updates.append("goodreads_link = ?")
        params.append(f"https://www.goodreads.com/search?q={search_query}")

    if is_placeholder_value(libby_link):
        updates.append("libby_link = ?")
        params.append(f"https://libbyapp.com/search/query-{search_query}")

    if updates:
        cursor.execute(
            f"UPDATE books SET {', '.join(updates)} WHERE id = ?",
            params + [book_id],
        )

    existing_theme_count = cursor.execute(
        "SELECT COUNT(*) FROM themes WHERE book_id = ?",
        (book_id,),
    ).fetchone()[0]
    if existing_theme_count == 0:
        primary_theme = normalize_text(genre) or DEFAULT_THEME
        cursor.execute(
            "INSERT OR IGNORE INTO themes (book_id, theme) VALUES (?, ?)",
            (book_id, primary_theme),
        )
        if primary_theme.lower() != DEFAULT_THEME.lower():
            cursor.execute(
                "INSERT OR IGNORE INTO themes (book_id, theme) VALUES (?, ?)",
                (book_id, DEFAULT_THEME),
            )

connection.commit()
connection.close()
print("Metadata enrichment complete")
