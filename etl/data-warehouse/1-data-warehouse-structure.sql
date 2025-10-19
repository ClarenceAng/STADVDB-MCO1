-- ============================================================================
-- DATA WAREHOUSE - MySQL Structure Definition
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
DROP SCHEMA IF EXISTS `warehouse`;
CREATE DATABASE `warehouse`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `warehouse`;

-- ============================================================================
-- DISABLE FOREIGN KEY AND UNIQUE KEY CHECKS FOR STRUCTURE LOADING
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- Drop tables to allow re-creation
DROP TABLE IF EXISTS FactBoxOfficeRevenue;
DROP TABLE IF EXISTS FactRatingSnapshot;
DROP TABLE IF EXISTS DimEpisode;
DROP TABLE IF EXISTS DimCrew;
DROP TABLE IF EXISTS BridgeTitlePerson;
DROP TABLE IF EXISTS DimTitle;
DROP TABLE IF EXISTS DimPerson;
DROP TABLE IF EXISTS DimDate;

-- ===========================================
-- Dimension Tables
-- ===========================================

-- -----------------------------------------------------
-- TABLE: warehouse.DimPerson
-- -----------------------------------------------------
CREATE TABLE DimPerson (
    personID INT AUTO_INCREMENT PRIMARY KEY,
    nconst VARCHAR(20) NOT NULL,
    primaryName VARCHAR(255),
    profession1 VARCHAR(255),
    profession2 VARCHAR(255),
    profession3 VARCHAR(255),
    dateCreated DATE,
    dateModified DATE
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.DimTitle
-- -----------------------------------------------------
CREATE TABLE DimTitle (
    titleID INT AUTO_INCREMENT PRIMARY KEY,
    tconst VARCHAR(20) NOT NULL,
    titleType VARCHAR(255),
    primaryTitle VARCHAR(511),
    originalTitle VARCHAR(511),
    isAdult BOOLEAN,
    startYear INT,
    endYear INT,
    genre1 VARCHAR(20),
    genre2 VARCHAR(20),
    genre3 VARCHAR(20),
    dateCreated DATE,
    dateModified DATE
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.BridgeTitlePerson
-- -----------------------------------------------------
CREATE TABLE BridgeTitlePerson (
    titleID INT NOT NULL,
    personID INT NOT NULL,
    categoryName VARCHAR(255),
    PRIMARY KEY (titleID, personID, categoryName),
    FOREIGN KEY (titleID) REFERENCES DimTitle(titleID),
    FOREIGN KEY (personID) REFERENCES DimPerson(personID)
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.DimCrew
-- -----------------------------------------------------
CREATE TABLE DimCrew (
    titleID INT NOT NULL,
    personID INT NOT NULL,
    position ENUM('director', 'writer'),
    dateCreated DATE,
    dateModified DATE,
    PRIMARY KEY (titleID, personID, position),
    FOREIGN KEY (titleID) REFERENCES DimTitle(titleID),
    FOREIGN KEY (personID) REFERENCES DimPerson(personID)
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.DimEpisode
-- -----------------------------------------------------
CREATE TABLE DimEpisode (
    episodeID INT AUTO_INCREMENT PRIMARY KEY,
    childEpisode INT,
    parentSeries INT,
    seasonNumber INT,
    episodeNumber INT,
    dateCreated DATE,
    dateModified DATE,
    FOREIGN KEY (childEpisode) REFERENCES DimTitle(titleID),
    FOREIGN KEY (parentSeries) REFERENCES DimTitle(titleID)
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.DimDate
-- -----------------------------------------------------
CREATE TABLE DimDate (
    dateID INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    decade INT,
    year INT,
    quarter INT,
    month INT,
    day INT,
    weekOfYear INT,
    isWeekend BOOLEAN
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- ===========================================
-- Fact Tables
-- ===========================================

-- -----------------------------------------------------
-- TABLE: warehouse.FactRatingSnapshot
-- -----------------------------------------------------
CREATE TABLE FactRatingSnapshot (
    ratingSnapshotID INT AUTO_INCREMENT PRIMARY KEY,
    titleID INT NOT NULL,
    snapshotDateID INT NOT NULL,
    averageRating DECIMAL(4,2),
    numVotes INT,
    dateCreated DATE,
    dateModified DATE,
    FOREIGN KEY (titleID) REFERENCES DimTitle(titleID),
    FOREIGN KEY (snapshotDateID) REFERENCES DimDate(dateID)
)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: warehouse.FactBoxOfficeRevenue
-- -----------------------------------------------------
CREATE TABLE FactBoxOfficeRevenue (
    boxOfficeRevenueSnapshotID INT AUTO_INCREMENT PRIMARY KEY,
    titleID INT NOT NULL,
    snapshotDateID INT NOT NULL,
    revenueRecordDateID INT NOT NULL,
    grossRevenue DECIMAL(12,2),
    grossRevenueToDate DECIMAL(12,2),
    daysSinceRelease INT,
    dateCreated DATE,
    dateModified DATE,
    FOREIGN KEY (titleID) REFERENCES DimTitle(titleID),
    FOREIGN KEY (snapshotDateID) REFERENCES DimDate(dateID),
    FOREIGN KEY (revenueRecordDateID) REFERENCES DimDate(dateID)
)
ENGINE = InnoDB 
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