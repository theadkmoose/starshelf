import sqlite3

connection = sqlite3.connect("../data/books.db")
cursor = connection.cursor()

# Ensure the main core tables exist.
cursor.execute("""
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    year INTEGER,
    pages INTEGER,
    series TEXT,
    isbn TEXT,
    summary TEXT,
    pov TEXT,
    ending TEXT,
    violence TEXT,
    magic TEXT,
    publisher TEXT,
    language TEXT,
    cover_url TEXT,
    description TEXT,
    genre TEXT,
    pacing TEXT,
    tone TEXT,
    romance TEXT,
    difficulty TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    canonical_name TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY,
    book_id INTEGER,
    award TEXT,
    year INTEGER,
    status TEXT,
    category TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY,
    book_id INTEGER,
    source TEXT,
    rating REAL,
    votes INTEGER
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY,
    book_id INTEGER,
    theme TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY,
    book_id INTEGER,
    genre TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    book_id INTEGER,
    note TEXT
)
""")

# Add the richer metadata columns to the live books table if they are missing.
existing_columns = {
    row[1]
    for row in cursor.execute("PRAGMA table_info(books)").fetchall()
}

new_columns = {
    "series_number": "TEXT",
    "standalone": "BOOLEAN",
    "reddit_rank": "INTEGER",
    "reddit_votes": "INTEGER",
    "goodreads_link": "TEXT",
    "libby_link": "TEXT",
    "audiobook_rating": "REAL",
    "audiobook_rank": "INTEGER",
    "overall_rating": "REAL",
    "overall_rank": "INTEGER",
}

for column_name, column_type in new_columns.items():
    if column_name not in existing_columns:
        cursor.execute(f"ALTER TABLE books ADD COLUMN {column_name} {column_type}")

connection.commit()
connection.close()
print("Database upgraded")
