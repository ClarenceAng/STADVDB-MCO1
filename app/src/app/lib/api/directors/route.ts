import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
    WITH MovieGrossRevenues(titleID, totalGrossRevenue) AS (
        SELECT fbor.titleID, SUM(fbor.grossRevenue) as totalGrossRevenue
        FROM FactBoxOfficeRevenue fbor
        JOIN ( 
            SELECT dt.titleID
            FROM DimTitle dt
            WHERE dt.titleType = 'movie'
        ) mov ON mov.titleID = fbor.titleID
        GROUP BY fbor.titleID
    )

	SELECT dp.primaryName, MIN(mgr.totalGrossRevenue) / 1000000 AS minPerMovieRevenueInMillions, MAX(mgr.totalGrossRevenue) / 1000000 AS maxPerMovieRevenueInMillions, AVG(mgr.totalGrossRevenue) / 1000000 AS avgPerMovieRevenueInMillions, COUNT(mgr.totalGrossRevenue) AS totalMovies
	FROM MovieGrossRevenues mgr
	JOIN (
		SELECT personID, titleID
		FROM DimCrew dc
		WHERE dc.position = 'director'
	) dir ON dir.titleID = mgr.titleID
    JOIN DimPerson dp ON dp.personID = dir.personID
	GROUP BY dir.personID
    HAVING totalMovies >= 3
    ORDER BY avgPerMovieRevenueInMillions DESC;
    `);
    console.log(rows);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
