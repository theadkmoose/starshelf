import sqlite3
import csv


database = "../data/books.db"
csv_file = "../data/raw/books.csv"


connection = sqlite3.connect(database)
cursor = connection.cursor()


with open(csv_file, newline="") as file:

    reader = csv.DictReader(file)

    for book in reader:

        cursor.execute("""
        INSERT INTO books
        (
        title,
        author,
        year,
        pages,
        series,
        isbn
        )

        VALUES
        (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
        )
        """,
        (
        book["title"],
        book["author"],
        book["year"],
        book["pages"],
        book["series"],
        book["isbn"]
        ))


connection.commit()
connection.close()

print("Books imported")
