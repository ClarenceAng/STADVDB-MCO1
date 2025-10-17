-- ============================================================================
-- IMDb DATASET - MySQL Inspection and Diagnosis File
-- ============================================================================

-- Use the IMDb database
USE `imdb`;

SELECT * FROM name_basics;
SELECT * FROM title_akas;
SELECT * FROM title_basics;
SELECT * FROM title_crew;
SELECT * FROM title_episode;
SELECT * FROM title_principals;
SELECT * FROM title_ratings;

DESCRIBE name_basics;
DESCRIBE title_akas;
DESCRIBE title_basics;
DESCRIBE title_crew;
DESCRIBE title_episode;
DESCRIBE title_principals;
DESCRIBE title_ratings;

-- ============================================================================
-- TABLE INSPECTION
-- ============================================================================

-- -----------------------------------------------------
-- TABLE: imdb.name_basics
-- -----------------------------------------------------

-- Check the number of rows in name_basics
SELECT COUNT(*) FROM name_basics;

-- Check if character representation is correct. This shows that it was necessary to use UTF-8 encoding over latin1.
SELECT nconst, primaryName FROM name_basics WHERE CONVERT(primaryName USING latin1) <> primaryName;

-- TODO: Description
SELECT 
    SUM(CASE WHEN primaryName IS NULL OR primaryName='\\N' THEN 1 ELSE 0 END) AS missing_name,
    SUM(CASE WHEN birthYear IS NULL OR birthYear='\\N' THEN 1 ELSE 0 END) AS missing_birthYear,
    SUM(CASE WHEN deathYear IS NULL OR deathYear='\\N' THEN 1 ELSE 0 END) AS missing_deathYear,
    SUM(CASE WHEN primaryProfession IS NULL OR primaryProfession='\\N' THEN 1 ELSE 0 END) AS missing_profession, 
    SUM(CASE WHEN knownForTitles IS NULL OR knownForTitles='\\N' THEN 1 ELSE 0 END) AS missing_titles
FROM name_basics;

-- TODO: Description
SELECT * FROM name_basics WHERE primaryName IS NULL OR primaryName='\\N';

-- TODO: Description
SELECT * FROM name_basics WHERE birthYear NOT REGEXP '^[0-9]{4}$' AND birthYear IS NOT NULL;

SELECT COUNT(*) FROM name_basics WHERE birthYear IS NOT NULL OR birthYear <> '\\N';

-- -----------------------------------------------------
-- TABLE: imdb.title_basics
-- -----------------------------------------------------

-- TODO: Description
SELECT COUNT(*) FROM title_basics;

-- TODO: Description
SELECT COUNT(*) FROM title_basics WHERE CONVERT(primaryTitle USING latin1) <> primaryTitle;

-- TODO: Description
SELECT COUNT(*) FROM title_basics WHERE CONVERT(originalTitle USING latin1) <> originalTitle;

-- TODO: Description
SELECT tconst, primaryTitle FROM title_basics WHERE CONVERT(primaryTitle USING latin1) <> primaryTitle;

-- TODO: Description
SELECT tconst, originalTitle FROM title_basics WHERE CONVERT(originalTitle USING latin1) <> originalTitle;

-- TODO: Description
SELECT 
    SUM(CASE WHEN titleType IS NULL THEN 1 ELSE 0 END) AS missing_titleType,
    SUM(CASE WHEN primaryTitle IS NULL THEN 1 ELSE 0 END) AS missing_primaryTitle,
    SUM(CASE WHEN originalTitle IS NULL THEN 1 ELSE 0 END) AS missing_originalTitle,
    SUM(CASE WHEN isAdult IS NULL THEN 1 ELSE 0 END) AS missing_isAdult,
    SUM(CASE WHEN startYear IS NULL OR startYear='\\N' THEN 1 ELSE 0 END) AS missing_startYear,
    SUM(CASE WHEN endYear IS NULL OR endYear='\\N' THEN 1 ELSE 0 END) AS missing_endYear,
    SUM(CASE WHEN runtimeMinutes IS NULL OR runtimeMinutes='\\N' THEN 1 ELSE 0 END) AS missing_runtimeMinutes,
    SUM(CASE WHEN genres IS NULL OR genres='\\N' THEN 1 ELSE 0 END) AS missing_genres
FROM title_basics;

-- TODO: Description
SELECT * FROM title_basics WHERE startYear IS NULL LIMIT 20;

-- TODO: Description
SELECT SUM(CASE WHEN isAdult = 1 THEN 1 else 0 END) AS numIsAdult FROM title_basics;

-- TODO: Description
SELECT COUNT(*) FROM title_basics WHERE genres LIKE "%Adult%" OR genres LIKE "%adult%";

-- TODO: Description
SELECT * FROM title_basics 
WHERE 	(isAdult = 1 AND genres NOT LIKE "%Adult%") 
OR 		(isAdult = 0 AND genres LIKE "Adult%") LIMIT 40;

-- TODO: Description
SELECT primaryTitle from title_basics WHERE primaryTitle LIKE "%Nigger%";