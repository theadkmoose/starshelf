import sqlite3

connection = sqlite3.connect("../data/books.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    year INTEGER,
    pages INTEGER,
    series TEXT,
    series_number TEXT,
    standalone BOOLEAN,
    isbn TEXT,
    cover_url TEXT,
    publisher TEXT,
    language TEXT,
    summary TEXT,
    pov TEXT,
    ending TEXT,
    violence TEXT,
    magic TEXT,
    reddit_rank INTEGER,
    reddit_votes INTEGER,
    goodreads_link TEXT,
    libby_link TEXT,
    audiobook_rating REAL,
    audiobook_rank INTEGER,
    overall_rating REAL,
    overall_rank INTEGER
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

connection.commit()
connection.close()

print("Database created successfully")

