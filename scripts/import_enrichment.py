import sqlite3
import csv


connection = sqlite3.connect("../data/books.db")

cursor = connection.cursor()


with open("../data/raw/enrichment.csv") as file:

    reader = csv.DictReader(file)

    for row in reader:

        cursor.execute(
        """
        UPDATE books

        SET
        genre=?,
        pacing=?,
        tone=?,
        romance=?,
        difficulty=?

        WHERE title=?
        """,
        (
        row["genre"],
        row["pacing"],
        row["tone"],
        row["romance"],
        row["difficulty"],
        row["title"]
        )
        )


connection.commit()

connection.close()


print("Enrichment added")
