-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.1.13-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Datenbank Struktur für dataintegration
DROP DATABASE IF EXISTS `dataintegration`;
CREATE DATABASE IF NOT EXISTS `dataintegration` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `dataintegration`;


-- Exportiere Struktur von Tabelle dataintegration.exemplar
DROP TABLE IF EXISTS `exemplar`;
CREATE TABLE IF NOT EXISTS `exemplar` (
  `barcode` int(11) unsigned NOT NULL,
  `titel` varchar(10) DEFAULT NULL,
  `standort` varchar(20) NOT NULL,
  `signatur` text,
  PRIMARY KEY (`barcode`),
  KEY `FK_exemplar_titel` (`titel`),
  KEY `FK_exemplar_standort` (`standort`),
  CONSTRAINT `FK_exemplar_standort` FOREIGN KEY (`standort`) REFERENCES `standort` (`sigel`),
  CONSTRAINT `FK_exemplar_titel` FOREIGN KEY (`titel`) REFERENCES `titel` (`PPN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle dataintegration.standort
DROP TABLE IF EXISTS `standort`;
CREATE TABLE IF NOT EXISTS `standort` (
  `sigel` varchar(20) NOT NULL,
  PRIMARY KEY (`sigel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle dataintegration.subjects
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `notation` text,
  `source` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle dataintegration.titel
DROP TABLE IF EXISTS `titel`;
CREATE TABLE IF NOT EXISTS `titel` (
  `PPN` varchar(10) NOT NULL,
  `Titel` text,
  `Autor` text,
  `ISBN` text,
  `Verlag` text,
  `Jahr` year(4) DEFAULT NULL,
  `Auflage` text,
  PRIMARY KEY (`PPN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle dataintegration.zuordnung
DROP TABLE IF EXISTS `zuordnung`;
CREATE TABLE IF NOT EXISTS `zuordnung` (
  `subject` int(10) unsigned DEFAULT NULL,
  `titel` varchar(10) DEFAULT NULL,
  KEY `FK__subjects` (`subject`),
  KEY `FK__titel` (`titel`),
  CONSTRAINT `FK__subjects` FOREIGN KEY (`subject`) REFERENCES `subjects` (`ID`),
  CONSTRAINT `FK__titel` FOREIGN KEY (`titel`) REFERENCES `titel` (`PPN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
