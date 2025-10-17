import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
    WITH grossRevenueByDate(titleID, total, approxReleaseDistanceInDays, year, month, day) AS (
        SELECT titleID, SUM(grossRevenue) as cumulativeRevenue, AVG(daysSinceRelease) as approxReleaseDistanceInDays, dd.year, dd.month, dd.day
        FROM FactBoxOfficeRevenue fbor
        JOIN DimDate dd ON dd.dateID = fbor.revenueRecordDate
        GROUP BY dd.year, dd.month, dd.day
        WITH ROLLUP
    )
	SELECT MAX(total), approxReleaseDistanceInDays, year, month, day
	FROM grossRevenueByDate
	GROUP BY dd.year, dd.month, dd.day
	WITH ROLLUP;`);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
