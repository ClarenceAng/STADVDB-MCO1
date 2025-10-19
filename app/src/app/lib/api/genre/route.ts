// rollup query
import { db } from "../../db";

export async function POST(request: Request) {
  try {
    const { selectedGenre } = await request.json();

    const [rows] = await db.query(
      `
    WITH GenreMovies(titleID, primaryTitle) AS (
    SELECT titleID, primaryTitle
    FROM DimTitle
    WHERE titleType = 'movie'
    AND (
        genre1 = ?
        OR genre2 = ?
        OR genre3 = ?
    )
)
    SELECT gm.titleID, gm.primaryTitle, SUM(fbor.grossRevenue)
    FROM GenreMovies gm
    JOIN FactBoxOfficeRevenue fbor
    ON fbor.titleID = gm.titleID
    JOIN DimDate dd
    ON fbor.revenueRecordDateID = dd.dateID
    GROUP BY dd.quarter, dd.weekOfYear
    WITH ROLLUP;
    `,
      [selectedGenre, selectedGenre, selectedGenre]
    );
    console.log(rows);
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
