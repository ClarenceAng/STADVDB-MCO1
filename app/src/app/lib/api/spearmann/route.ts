// statistical query
import { db } from "../../db";

export async function POST(request: Request) {
  try {
    const { genre } = await request.json();
    const [rows] = await db.query(
      `
      WITH N(total, count) AS (
    WITH Deltas(deltaSquared) AS (
        WITH Ranks(revenueRank, ratingRank) AS (
            WITH Movies(titleID) AS (
                SELECT dt.titleID
                FROM DimTitle dt
                WHERE dt.titleType = 'movie'
                AND (
                    dt.genre1 = ?
                    OR dt.genre2 = ?
                    OR dt.genre3 = ?
                )
            )
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY tgr.totalGrossRevenueToDateInMillions DESC) AS revenueRank,
                    ROW_NUMBER() OVER (ORDER BY tr.rating DESC) AS ratingRank
                FROM (
                    SELECT m.titleID, MAX(grossRevenueToDate) / 1000000 AS totalGrossRevenueToDateInMillions
                    FROM FactBoxOfficeRevenue fbor
                    JOIN Movies m
                    ON m.titleID = fbor.titleID 
                    GROUP BY m.titleID
                ) tgr
                JOIN (
                    SELECT m.titleID, MAX(frs.averageRating) AS rating
                    FROM FactRatingSnapshot frs 
                    JOIN Movies m
                    ON m.titleID = frs.titleID 
                    GROUP BY m.titleID
                ) tr 
                ON tgr.titleID = tr.titleID
                ORDER BY revenueRank
        )
            SELECT revenueRank * revenueRank + ratingRank * ratingRank - 2 * revenueRank * ratingRank AS deltaSquared
            FROM Ranks
    )
        SELECT 6 * SUM(deltaSquared) AS total, COUNT(*) AS count FROM Deltas
)
    SELECT total / (count * count * count - count) AS spearmann
    FROM N;
`,
      [genre, genre, genre]
    );
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json(
      { error: "Failed to fetch stat query" },
      { status: 500 }
    );
  }
}
