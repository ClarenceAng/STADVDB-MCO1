-- ============================================================================
-- BOX OFFICE MOJO DATASET - MySQL Data Insert
-- ============================================================================

-- Set MySQL session variables
SET AUTOCOMMIT = 0;
START TRANSACTION;

SET GLOBAL max_allowed_packet=1073741824;
SET GLOBAL net_read_timeout=600;
SET GLOBAL net_write_timeout=600;

-- Character set configuration
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Use the Box Office Mojo database
USE `boxofficemojo`;

-- ============================================================================
-- DISABLE FOREIGN KEY AND UNIQUE KEY CHECKS FOR DATA LOADING
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

-- ============================================================================
-- TABLE DATA INSERTS
-- ============================================================================

-- -----------------------------------------------------
-- Insert data for table: boxofficemojo.BoxOfficeMojoIds
-- -----------------------------------------------------
LOAD DATA INFILE '/var/lib/mysql-files/box-office-ids.tsv'
INTO TABLE BoxOfficeMojoIds
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(boxofficemojo_id, imdb_id);

-- -----------------------------------------------------
-- Insert data for table: boxofficemojo.BoxOfficeRevenue
-- -----------------------------------------------------
LOAD DATA INFILE '/var/lib/mysql-files/box-office.csv'
INTO TABLE BoxOfficeRevenue
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(title, boxofficemojo_id, date, gross, gross_to_date, @vdays_released)
SET days_released = NULLIF(@vdays_released, '');

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
