import sqlite3
import pandas as pd

db_path = "../data/books.db"
csv_path = "../data/raw/awards_raw.csv"

connection = sqlite3.connect(db_path)
cursor = connection.cursor()

df = pd.read_csv(csv_path)

for _, row in df.iterrows():
    # Check if the book already exists in the books table
    cursor.execute("SELECT id FROM books WHERE title = ?", (row['title'],))
    book_result = cursor.fetchone()
    
    if book_result:
        book_id = book_result[0]
    else:
        # If the book isn't in the books table yet, insert basic info
        cursor.execute("""
            INSERT INTO books (title, author, year)
            VALUES (?, ?, ?)
        """, (row['title'], row['author'], row['year']))
        book_id = cursor.lastrowid

    # Insert into awards table
    cursor.execute("""
        INSERT INTO awards (book_id, award, year, status)
        VALUES (?, ?, ?, ?)
    """, (book_id, row['award'], row['year'], row['status']))

connection.commit()
connection.close()

print("Awards imported and linked successfully.")
