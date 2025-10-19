// rollup query
import { db } from "../../db";

export async function POST(request: Request) {
  try {
    const { selectedGenre } = await request.json();

    const [rows] = await db.query(
      `
    
WITH GenreMoviesRevenues(titleID, primaryTitle, totalGrossRevenueDuringPeriodForMovie, year, month) AS (
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
    SELECT gm.titleID, gm.primaryTitle, MAX(fbor.grossRevenueToDate) AS totalGrossRevenue, dd.year, dd.month
    FROM GenreMovies gm
    JOIN FactBoxOfficeRevenue fbor
    ON fbor.titleID = gm.titleID
    JOIN DimDate dd 
    ON dd.dateID = fbor.revenueRecordDateID 
    GROUP BY gm.titleID, gm.primaryTitle, dd.year, dd.month
    ORDER BY dd.year DESC
)
    SELECT SUM(totalGrossRevenueDuringPeriodForMovie) AS totalGrossRevenue, year, month
    FROM GenreMoviesRevenues
    GROUP BY year, month
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
