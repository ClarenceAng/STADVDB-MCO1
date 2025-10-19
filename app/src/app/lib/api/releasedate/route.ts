import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
    WITH GrossRevenueByDate(titleID, grossRevenue, daysSinceRelease, year, month, day) AS (
        SELECT dt.titleID, fbor.grossRevenue, fbor.daysSinceRelease, dd.year, dd.month, dd.day
        FROM (
            SELECT titleID
            FROM DimTitle
            WHERE titleType = 'movie'
        ) dt
        JOIN FactBoxOfficeRevenue fbor ON dt.titleID = fbor.titleID
        JOIN DimDate dd ON dd.dateID = fbor.revenueRecordDateID
    )
	SELECT AVG(grd1.grossRevenue) / 1000000 AS grossRevInMillions, grd1.daysSinceRelease
    FROM GrossRevenueByDate grd1
    JOIN (
		SELECT MAX(grossRevenue) AS maxGrossRevenue, titleID
		FROM GrossRevenueByDate
		GROUP BY titleID
	) grd2
    ON grd1.titleID = grd2.titleID
    WHERE grd1.grossRevenue = grd2.maxGrossRevenue
    AND daysSinceRelease IS NOT NULL
    GROUP BY grd1.daysSinceRelease
    ORDER BY grd1.daysSinceRelease;
`);
    console.log(rows);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
