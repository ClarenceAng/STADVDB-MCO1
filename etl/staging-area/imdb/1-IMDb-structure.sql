-- ============================================================================
-- IMDb DATASET - MySQL Structure Definition
-- ============================================================================

-- Set MySQL session variables
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- Character set configuration
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database creation and selection
DROP SCHEMA IF EXISTS `imdb` ;
CREATE DATABASE `imdb`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `imdb`;

-- ============================================================================
-- DISABLE FOREIGN KEY AND UNIQUE KEY CHECKS FOR STRUCTURE LOADING
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- -----------------------------------------------------
-- TABLE: imdb.name_basics
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS name_basics (
    nconst VARCHAR(20) NOT NULL,
    primaryName VARCHAR(255),
    birthYear INT NULL,
    deathYear INT NULL,
    primaryProfession VARCHAR(255),
    knownForTitles VARCHAR(255),
    PRIMARY KEY (nconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_akas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_akas (
    titleId VARCHAR(20) NOT NULL,
    ordering INT NOT NULL,
    title VARCHAR(1024) NOT NULL,
    region VARCHAR(10) NULL,
    language VARCHAR(20) NULL,
    types VARCHAR(255) NULL,
    attributes VARCHAR(255) NULL,
    isOriginalTitle TINYINT NOT NULL,
    PRIMARY KEY (titleId, ordering),
    FOREIGN KEY (titleId) REFERENCES title_basics(tconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_basics
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_basics (
    tconst VARCHAR(20) NOT NULL,
    titleType VARCHAR(50),
    primaryTitle VARCHAR(1024),
    originalTitle VARCHAR(1024),
    isAdult TINYINT,
    startYear INT NULL,
    endYear INT NULL,
    runtimeMinutes INT NULL,
    genres VARCHAR(255),
    PRIMARY KEY (tconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_crew
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_crew (
    tconst VARCHAR(20) NOT NULL,
    directors TEXT,
    writers TEXT,
    PRIMARY KEY (tconst),
    FOREIGN KEY (tconst) REFERENCES title_basics(tconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_episode
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_episode (
    tconst VARCHAR(20) NOT NULL,
    parentTconst VARCHAR(20),
    seasonNumber INT,
    episodeNumber INT,
    PRIMARY KEY (tconst),
    FOREIGN KEY (tconst) REFERENCES title_basics(tconst),
    FOREIGN KEY (parentTconst) REFERENCES title_basics(tconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_principals
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_principals (
    tconst VARCHAR(20) NOT NULL,
    ordering INT NOT NULL,
    nconst VARCHAR(20) NOT NULL,
    category VARCHAR(100),
    job VARCHAR(1024),
    characters VARCHAR(1024),
    PRIMARY KEY (tconst, ordering, nconst),
    FOREIGN KEY (tconst) REFERENCES title_basics(tconst),
    FOREIGN KEY (nconst) REFERENCES name_basics(nconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: imdb.title_ratings
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS title_ratings (
    tconst VARCHAR(20) NOT NULL,
    averageRating DECIMAL(3,1),
    numVotes INT,
    PRIMARY KEY (tconst),
    FOREIGN KEY (tconst) REFERENCES title_basics(tconst)
)
ENGINE=InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- ============================================================================
-- RE-ENABLE FOREIGN KEY AND UNIQUE KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;

-- ============================================================================
-- FINALIZE TRANSACTION
-- ============================================================================

COMMIT;

-- Restore MySQL session variables
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;