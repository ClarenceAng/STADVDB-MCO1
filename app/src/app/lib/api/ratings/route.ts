import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
        SELECT dp.primaryName, fff.finalAverageRating, fff.movieCount
FROM DimPerson dp
JOIN (
	WITH DirMovs(titleID, personID, averageRating) AS (
		SELECT frs.titleID, m.personID, AVG(frs.averageRating) 
		FROM FactRatingSnapshot frs
		JOIN (
			SELECT dt.titleID, dir.personID
			FROM DimTitle dt
			JOIN (
				SELECT titleID, personID
				FROM DimCrew dc 
				WHERE position = 'director'
			) dir
			ON dt.titleID = dir.titleID
			WHERE dt.titleType = 'movie'
		) m
		ON m.titleID = frs.titleID
		GROUP BY frs.titleID, m.personID
	)
		SELECT personID, AVG(averageRating) AS finalAverageRating, COUNT(titleID) AS movieCount
		FROM DirMovs
		GROUP BY personID
        HAVING movieCount >= 20
) fff
ON fff.personID = dp.personID
ORDER BY fff.finalAverageRating DESC;
`);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
