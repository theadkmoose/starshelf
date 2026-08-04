import sqlite3
import json
from pathlib import Path

connection = sqlite3.connect("../data/books.db")
cursor = connection.cursor()


def safe_text(value):
    return (value or "").strip() or "Unknown"


def make_placeholder_cover(book):
    book_id = book.get("id")
    title = safe_text(book.get("title"))
    author = safe_text(book.get("author"))
    cover_dir = Path("../website/images/covers")
    cover_dir.mkdir(parents=True, exist_ok=True)
    cover_path = cover_dir / f"cover_{book_id}.svg"

    title_line = title[:36]
    author_line = author[:34]

    cover_path.write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480">
  <rect width="320" height="480" rx="12" fill="#171b2f"/>
  <rect x="18" y="18" width="284" height="444" rx="8" fill="#1f2947" stroke="#6b7dcf" stroke-width="2"/>
  <text x="160" y="130" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#eef4ff">Speculative Fiction</text>
  <text x="160" y="190" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#f8fbff">{title_line}</text>
  <text x="160" y="232" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#b6c5f7">{author_line}</text>
  <text x="160" y="305" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#88a0ef">Local placeholder cover</text>
</svg>
''')

    return f"images/covers/cover_{book_id}.svg"

cursor.execute("""
SELECT
    b.id,
    b.title,
    b.author,
    b.year,
    b.pages,
    b.series,
    b.series_number,
    b.standalone,
    b.isbn,
    b.cover_url,
    b.publisher,
    b.language,
    b.summary,
    b.pov,
    b.ending,
    b.violence,
    b.magic,
    b.genre,
    b.pacing,
    b.tone,
    b.romance,
    b.difficulty,
    b.description,
    b.reddit_rank,
    b.reddit_votes,
    b.goodreads_link,
    b.libby_link,
    b.audiobook_rating,
    b.audiobook_rank,
    b.overall_rating,
    b.overall_rank,
    (
        SELECT GROUP_CONCAT(award_status, ' | ')
        FROM (
            SELECT DISTINCT a.award || ' (' || a.status || ')' AS award_status
            FROM awards AS a
            WHERE a.book_id = b.id
        )
    ) AS award_summary,
    (
        SELECT GROUP_CONCAT(theme, ' | ')
        FROM (
            SELECT DISTINCT t.theme
            FROM themes AS t
            WHERE t.book_id = b.id
        )
    ) AS themes
FROM books AS b
ORDER BY b.title ASC
""")

columns = [
    description[0]
    for description in cursor.description
]

books = []

for row in cursor.fetchall():
    book = dict(zip(columns, row))

    if not book.get("cover_url"):
        book["cover_url"] = make_placeholder_cover(book)

    if not book.get("themes"):
        book["themes"] = book.get("genre") or "Unknown Theme"

    books.append(book)

with open("../data/books.json", "w") as file:
    json.dump(books, file, indent=2)

connection.close()
print("JSON exported")
