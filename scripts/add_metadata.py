import sqlite3


connection = sqlite3.connect("../data/books.db")

cursor = connection.cursor()


columns = [

    "publisher TEXT",
    "language TEXT",
    "cover_url TEXT",
    "description TEXT",
    "genre TEXT",
    "pacing TEXT",
    "tone TEXT",
    "romance TEXT",
    "difficulty TEXT"

]


for column in columns:

    try:

        cursor.execute(
            f"ALTER TABLE books ADD COLUMN {column}"
        )

    except sqlite3.OperationalError:

        pass


connection.commit()

connection.close()


print("Metadata fields added")
