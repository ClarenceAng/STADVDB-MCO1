import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
        SELECT frs.titleID, AVG(frs.averageRating) AS averageRating, dir.personID
        FROM FactRatingSnapshot frs
        JOIN (
            SELECT titleID, personID, position
            FROM DimCrew dc
            JOIN DimPerson dp ON dc.personID = dp.personID
            WHERE dc.position = 'director'
        ) dir ON dir.titleID = frs.titleID
        GROUP BY dir.personID
        ORDER BY averageRating DESC;`);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
