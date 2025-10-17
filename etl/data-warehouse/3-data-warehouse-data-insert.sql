-- ============================================================================
-- IMDb DATASET - MySQL Data Insert
-- ============================================================================

-- Set MySQL session variables
SET AUTOCOMMIT = 0;
START TRANSACTION;

SET GLOBAL net_read_timeout = 28800;
SET GLOBAL net_write_timeout = 28800;
SET GLOBAL max_allowed_packet = 1073741824;
SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;
SET SESSION cte_max_recursion_depth = 5000;
SET GLOBAL connect_timeout=28800;
SET GLOBAL interactive_timeout=28800;
SET GLOBAL wait_timeout=28800;
SET GLOBAL bulk_insert_buffer_size = 2*1024*1024*1024;
SET GLOBAL innodb_buffer_pool_size = 8*1024*1024*1024;
SET GLOBAL mysqlx_read_timeout = 1800;

-- Character set configuration
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Use the warehouse database
USE `warehouse`;

-- ============================================================================
-- TABLE DATA INSERTS
-- ============================================================================

-- -----------------------------------------------------
-- Insert data for table: warehouse.DimPerson
-- -----------------------------------------------------
INSERT INTO DimPerson (
	nconst, 
    primaryName, 
    profession1, 
    profession2, 
    profession3, 
    dateCreated
)
SELECT 
    nconst,
    primaryName,
    SUBSTRING_INDEX(SUBSTRING_INDEX(primaryProfession, ',', 1), ',', -1) AS profession1,
		IF(
            LENGTH(primaryProfession) - LENGTH(REPLACE(primaryProfession, ',', '')) >= 1,
            SUBSTRING_INDEX(SUBSTRING_INDEX(primaryProfession, ',', 2), ',', -1),
            NULL
		) AS profession2,
		IF(
            LENGTH(primaryProfession) - LENGTH(REPLACE(primaryProfession, ',', '')) >= 2,
            SUBSTRING_INDEX(SUBSTRING_INDEX(primaryProfession, ',', 3), ',', -1),
            NULL
		) AS profession3,
    CURDATE()
FROM imdb.name_basics
WHERE 
    nconst IS NOT NULL
    AND primaryName IS NOT NULL
    OR primaryProfession IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.DimTitle
-- -----------------------------------------------------
INSERT INTO DimTitle (
    tconst, 
    titleType, 
    primaryTitle, 
    originalTitle, 
    isAdult, 
    startYear, 
    endYear,
    runtimeMinutes, 
    genre1, 
    genre2, 
    genre3, 
    dateCreated
)
SELECT 
    tconst,
    titleType,
    primaryTitle,
    originalTitle,
    CASE WHEN isAdult = '1' THEN TRUE ELSE FALSE END AS isAdult,
    NULLIF(startYear, NULL),
    NULLIF(endYear, NULL),
    NULLIF(runtimeMinutes, NULL),
		SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', 1), ',', -1) AS genre1,
		IF(
            LENGTH(genres) - LENGTH(REPLACE(genres, ',', '')) >= 1,
            SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', 2), ',', -1),
            NULL
		) AS genre2,
		IF(
            LENGTH(genres) - LENGTH(REPLACE(genres, ',', '')) >= 2,
            SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', 3), ',', -1),
            NULL
		) AS genre3,
    CURDATE()
FROM imdb.title_basics
WHERE tconst IS NOT NULL
    AND primaryTitle IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.BridgeTitlePerson
-- -----------------------------------------------------
INSERT IGNORE INTO BridgeTitlePerson (
    titleID, 
    personID, 
    categoryName
)
SELECT DISTINCT
    t.titleID,
    p.personID,
    tp.category AS categoryName
FROM imdb.title_principals tp
JOIN DimTitle t ON t.tconst = tp.tconst
JOIN DimPerson p ON p.nconst = tp.nconst
WHERE tp.category IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.DimCrew
-- -----------------------------------------------------
INSERT INTO DimCrew (
    titleID, 
    personID, 
    position, 
    dateCreated
)
SELECT 
    t.titleID,
    p.personID,
    'director' AS position,
    CURDATE()
FROM (
    WITH RECURSIVE director_cte AS (
        SELECT 
            tconst,
            SUBSTRING_INDEX(directors, ',', 1) AS nconst,
            SUBSTRING(directors, LENGTH(SUBSTRING_INDEX(directors, ',', 1)) + 2) AS remainder
        FROM imdb.title_crew 
        WHERE directors IS NOT NULL
        
        UNION ALL
        
        SELECT 
            tconst,
            SUBSTRING_INDEX(remainder, ',', 1),
            SUBSTRING(remainder, LENGTH(SUBSTRING_INDEX(remainder, ',', 1)) + 2)
        FROM director_cte
        WHERE remainder != ''
    )
    SELECT * FROM director_cte
) AS c
JOIN DimTitle t ON t.tconst = c.tconst
JOIN DimPerson p ON p.nconst = c.nconst
WHERE c.nconst IS NOT NULL;

INSERT INTO DimCrew (
	titleID, 
    personID, 
    position, 
    dateCreated
)
SELECT 
    t.titleID,
    p.personID,
    'writer' AS position,
    CURDATE()
FROM (
    WITH RECURSIVE writer_cte AS (
        SELECT 
            tconst,
            SUBSTRING_INDEX(writers, ',', 1) AS nconst,
            SUBSTRING(writers, LENGTH(SUBSTRING_INDEX(writers, ',', 1)) + 2) AS remainder
        FROM imdb.title_crew 
        WHERE writers IS NOT NULL
        
        UNION ALL
        
        SELECT 
            tconst,
            SUBSTRING_INDEX(remainder, ',', 1),
            SUBSTRING(remainder, LENGTH(SUBSTRING_INDEX(remainder, ',', 1)) + 2)
        FROM writer_cte
        WHERE remainder != ''
    )
    SELECT * FROM writer_cte
) AS c
JOIN DimTitle t ON t.tconst = c.tconst
JOIN DimPerson p ON p.nconst = c.nconst
WHERE c.nconst IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.DimEpisode
-- -----------------------------------------------------
INSERT INTO DimEpisode (
    childEpisode, 
    parentSeries, 
    seasonNumber, 
    episodeNumber, 
    dateCreated
)
SELECT 
    t_child.titleID AS childEpisode,
    t_parent.titleID AS parentSeries,
    NULLIF(te.seasonNumber, NULL),
    NULLIF(te.episodeNumber, NULL),
    CURDATE()
FROM imdb.title_episode te
JOIN DimTitle t_child ON t_child.tconst = te.tconst
JOIN DimTitle t_parent ON t_parent.tconst = te.parentTconst
WHERE te.tconst IS NOT NULL AND te.parentTconst IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.DimDate
-- -----------------------------------------------------
INSERT IGNORE INTO DimDate (
    date, 
    year, 
    quarter, 
    month, 
    day, 
    weekOfYear, 
    isWeekend
)
SELECT DISTINCT
    date AS date,
    YEAR(date) AS year,
    QUARTER(date) as quarter,
    MONTH(date) AS month,
    DAY(date) AS day,
    WEEKOFYEAR(date) AS weekOfYear,
    CASE 
        WHEN DAYOFWEEK(date) IN (1, 7) THEN 1 
        ELSE 0 
    END AS isWeekend
FROM boxofficemojo.BoxOfficeRevenue;

INSERT IGNORE INTO DimDate (
    date, 
    year, 
    quarter, 
    month, 
    day, 
    weekOfYear, 
    isWeekend
)
SELECT DISTINCT
    CURDATE() AS date,
    YEAR(CURDATE()) AS year,
    QUARTER(CURDATE()) as quarter,
    MONTH(CURDATE()) AS month,
    DAY(CURDATE()) AS day,
    WEEKOFYEAR(CURDATE()) AS weekOfYear,
    CASE 
        WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN 1 
        ELSE 0 
    END AS isWeekend;
  
INSERT IGNORE INTO DimDate (
    date, 
    year, 
    quarter, 
    month, 
    day, 
    weekOfYear, 
    isWeekend
)
SELECT DISTINCT
    CURDATE() + 1 AS date,
    YEAR(CURDATE() + 1) AS year,
    QUARTER(CURDATE() + 1) as quarter,
    MONTH(CURDATE() + 1) AS month,
    DAY(CURDATE() + 1) AS day,
    WEEKOFYEAR(CURDATE() + 1) AS weekOfYear,
    CASE 
        WHEN DAYOFWEEK(CURDATE() + 1) IN (1, 7) THEN 1 
        ELSE 0 
    END AS isWeekend;

-- -----------------------------------------------------
-- Insert data for table: warehouse.FactRatingSnapshot
-- -----------------------------------------------------
INSERT INTO FactRatingSnapshot (
    titleID, 
    snapshotDateID, 
    averageRating, 
    numVotes, 
    dateCreated
)
SELECT 
    t.titleID,
    d.dateID,
    r.averageRating,
    r.numVotes,
    CURDATE()
FROM imdb.title_ratings r
JOIN DimTitle t ON t.tconst = r.tconst
JOIN DimDate d ON d.date = CURDATE()
WHERE r.averageRating IS NOT NULL
  AND r.numVotes IS NOT NULL;

-- -----------------------------------------------------
-- Insert data for table: warehouse.FactBoxOfficeRevenue
-- -----------------------------------------------------
INSERT INTO FactBoxOfficeRevenue (
    titleID,
    snapshotDateID,
    revenueRecordDateID,
    grossRevenue,
    grossRevenueToDate,
    daysSinceRelease,
    dateCreated
)
SELECT 
    dt.titleID,
    (SELECT dateID FROM DimDate WHERE date = CURRENT_DATE()) AS snapshotDateID,
    dd.dateID AS revenueRecordDateID,
    bor.gross AS grossRevenue,
    bor.gross_to_date AS grossRevenueToDate,
    bor.days_released AS daysSinceRelease,
    CURDATE() AS dateCreated
FROM boxofficemojo.BoxOfficeRevenue AS bor
JOIN boxofficemojo.BoxOfficeMojoIds AS bomi
    ON bor.boxofficemojo_id = bomi.boxofficemojo_id
JOIN DimTitle AS dt
    ON dt.tconst = bomi.imdb_id
JOIN DimDate AS dd
    ON dd.date = bor.date
WHERE dt.tconst IS NOT NULL
  AND bor.gross IS NOT NULL;

-- ============================================================================
-- FINALIZE TRANSACTION
-- ============================================================================

COMMIT;

-- Restore MySQL session variables
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;