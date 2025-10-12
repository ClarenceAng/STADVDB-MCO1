-- ============================================================================
-- Box Office Mojo DATASET - MySQL Structure Definition
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
DROP SCHEMA IF EXISTS `boxofficemojo` ;
CREATE DATABASE `boxofficemojo`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `boxofficemojo`;

-- ============================================================================
-- DISABLE FOREIGN KEY AND UNIQUE KEY CHECKS FOR STRUCTURE LOADING
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- -----------------------------------------------------
-- TABLE: boxofficemojo.BoxOfficeMojoIds
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS BoxOfficeMojoIds(
  boxofficemojo_id varchar(31) not null,
  imdb_id varchar(31) not null,
  
  PRIMARY KEY (`boxofficemojo_id`)
) 
ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- TABLE: boxofficemojo.BoxOfficeRevenue
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS BoxOfficeRevenue(
  `id` int not null AUTO_INCREMENT,  
  `title` varchar(1023) not null,
  `boxofficemojo_url` varchar(255) not null,
  `date` date not null,
  `gross` decimal(12,2) not null,
  `gross_to_date` decimal(12,2) not null,
  `days_released` int not null,
  `boxofficemojo_id` varchar(31) not null,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`boxofficemojo_id`) REFERENCES BoxOfficeMojoIds (`boxofficemojo_id`)
) 
ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

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