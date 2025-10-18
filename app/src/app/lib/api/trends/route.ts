import { db } from "../../db";

export async function POST(request: Request) {
  try {
    const { selectedYear } = await request.json();

    const [rows] = await db.query(
      `
    WITH Movies(titleID) AS ( 
        SELECT dt.titleID
        FROM DimTitle dt
        WHERE dt.titleType = 'movie'
    )
        SELECT SUM(fbor.grossRevenue) / 1000000 AS totalRevenueThatDayInMillions, dd.year, dd.month, dd.day
        FROM Movies m
        JOIN FactBoxOfficeRevenue fbor ON fbor.titleID = m.titleID
        JOIN DimDate dd ON dd.dateID = fbor.revenueRecordDateID
        WHERE dd.year = ?
        GROUP BY dd.year, dd.month, dd.day
        ORDER BY dd.year, dd.month, dd.day;
    `,
      [selectedYear]
    );
    console.log(rows);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
