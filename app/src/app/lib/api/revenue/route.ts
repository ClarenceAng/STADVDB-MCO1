import { db } from "../../db";

export async function POST(request: Request) {
  try {
    const { page, pageSize } = await request.json();

    const offset = page * pageSize;

    const [rows] = await db.query(
      `
    SELECT fbor.titleID,
      lrm.primaryTitle,
      SUM(grossRevenue) AS cumulativeRevenue,
      AVG(lrm.averageRating) AS avgRating
    FROM FactBoxOfficeRevenue fbor
    JOIN (
        SELECT dt.titleID, dt.primaryTitle, dt.startYear, lr.averageRating
        FROM DimTitle dt
        JOIN (
            SELECT titleID, averageRating
            FROM FactRatingSnapshot
            WHERE averageRating < 4.0
        ) lr ON lr.titleID = dt.titleID
        WHERE dt.titleType = 'movie'
    ) lrm ON lrm.titleID = fbor.titleID
    JOIN DimDate dd ON dd.dateID = fbor.revenueRecordDateID
    GROUP BY titleID, lrm.primaryTitle
    ORDER BY cumulativeRevenue DESC
    LIMIT ? OFFSET ?;`,
      [pageSize, offset]
    );

    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
