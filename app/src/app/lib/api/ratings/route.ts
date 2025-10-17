import { db } from "../../db";

export async function GET() {
  try {
    const [rows] = await db.query(`
        SELECT titleID, SUM(grossRevenue) as cumulativeRevenue, lrm.averageRating
        FROM FactBoxOfficeRevenue fbor
        JOIN (
            SELECT dt.titleID, dt.startYear, lr.averageRating
            FROM DimTitle dt
            JOIN (
                SELECT titleID, averageRating
                FROM FactRatingSnapshot
                WHERE averageRating < 2.0
            ) lr ON lr.titleID = dt.titleID
            WHERE dt.titleType = 'movie'
        ) lrm ON lrm.titleID = fbor.titleID
        JOIN DimDate dd ON dd.dateID = fbor.revenueRecordDate
        WHERE dd.year >= lrm.startYear 
        AND dd.year <= lrm.startYear + 1
        GROUP BY titleID;`);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
