import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

mydb = mysql.connector.connect(
  host=os.getenv("MYSQL_HOST"),
  user=os.getenv("MYSQL_USER"),
  password=os.getenv("MYSQL_PASSWORD"),
  database=os.getenv("MYSQL_DATABASE")
)

base_offset = 16_000_000
number_per_insert = 8_000_000

count_cursor = mydb.cursor()
count_cursor.execute("SELECT COUNT(*) FROM imdb.title_principals")
myresult = count_cursor.fetchall()

count = myresult[0][0]

i = base_offset
while i < count:
    crs = mydb.cursor()
    query = f"""
    INSERT IGNORE INTO BridgeTitlePerson (titleID, personID, categoryName)
    SELECT DISTINCT
        t.titleID,
        p.personID,
        tp.category AS categoryName
    FROM imdb.title_principals tp
    JOIN DimTitle t ON t.tconst = tp.tconst
    JOIN DimPerson p ON p.nconst = tp.nconst
    WHERE tp.category IS NOT NULL LIMIT 8000000 OFFSET {i};
    """
    crs.execute(query)
    mydb.commit()
    
    print(f"done with {i}. {crs.rowcount} inserted.")
    i = i + number_per_insert