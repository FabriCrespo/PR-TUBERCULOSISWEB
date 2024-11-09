-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tuberculosisproyect
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE SCHEMA IF NOT EXISTS `tuberculosisproyect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `tuberculosisproyect`;
--
-- Table structure for table `criterioingreso`
--

DROP TABLE IF EXISTS `criterioingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criterioingreso` (
  `idCriterioIngreso` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(30) NOT NULL COMMENT 'ExtraPulmonar\\nClinico\\nBactereologico\\nOtro (ninguno)',
  `subtipo` varchar(100) DEFAULT NULL,
  `estadoIngreso` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idCriterioIngreso`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criterioingreso`
--

LOCK TABLES `criterioingreso` WRITE;
/*!40000 ALTER TABLE `criterioingreso` DISABLE KEYS */;
INSERT INTO `criterioingreso` VALUES (1,'Pulmonar','Diagnóstico bacteriológico','Nuevo','Diagnóstico bacteriológico para casos nuevos',1,'2024-10-24 06:35:23',NULL),(2,'Pulmonar','Diagnóstico bacteriológico','Recaída','Diagnóstico bacteriológico para casos de recaída',1,'2024-10-24 06:35:23',NULL),(3,'Pulmonar','Diagnóstico bacteriológico','Pérdida en el seguimiento','Diagnóstico bacteriológico en casos perdidos en seguimiento',1,'2024-10-24 06:35:23',NULL),(4,'Pulmonar','Diagnóstico bacteriológico','Fracaso','Diagnóstico bacteriológico para casos de fracaso',1,'2024-10-24 06:35:23',NULL),(5,'Pulmonar','Diagnóstico clínico','Nuevo','Diagnóstico clínico para casos nuevos',1,'2024-10-24 06:35:23',NULL),(6,'Pulmonar','Diagnóstico clínico','Recaída','Diagnóstico clínico para casos de recaída',1,'2024-10-24 06:35:23',NULL),(7,'Pulmonar','Diagnóstico clínico','Pérdida en el seguimiento','Diagnóstico clínico en casos perdidos en seguimiento',1,'2024-10-24 06:35:23',NULL),(8,'Pulmonar','Diagnóstico clínico','Fracaso','Diagnóstico clínico para casos de fracaso',1,'2024-10-24 06:35:23',NULL),(9,'Extrapulmonar','Solicitar tipo extrapulmonar','Nuevo','Diagnóstico extrapulmonar para casos nuevos',1,'2024-10-24 06:35:23',NULL),(10,'Extrapulmonar','Solicitar tipo extrapulmonar','Recaída','Diagnóstico extrapulmonar para casos de recaída',1,'2024-10-24 06:35:23',NULL),(11,'Extrapulmonar','Solicitar tipo extrapulmonar','Pérdida en el seguimiento','Diagnóstico extrapulmonar en casos perdidos en seguimiento',1,'2024-10-24 06:35:23',NULL),(12,'Extrapulmonar','Solicitar tipo extrapulmonar','Fracaso','Diagnóstico extrapulmonar para casos de fracaso',1,'2024-10-24 06:35:23',NULL);
/*!40000 ALTER TABLE `criterioingreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establecimientosalud`
--

DROP TABLE IF EXISTS `establecimientosalud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establecimientosalud` (
  `idEstablecimientoSalud` int NOT NULL AUTO_INCREMENT,
  `nombreEstablecimiento` varchar(60) DEFAULT NULL,
  `clasificacion` varchar(30) DEFAULT NULL COMMENT 'Valores: Publico (PUB)',
  `telefono` varchar(15) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  `idRedSalud` int NOT NULL,
  PRIMARY KEY (`idEstablecimientoSalud`),
  KEY `fk_EstablecimientoSalud_RedSalud1_idx` (`idRedSalud`),
  CONSTRAINT `fk_EstablecimientoSalud_RedSalud1` FOREIGN KEY (`idRedSalud`) REFERENCES `redsalud` (`idRedSalud`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimientosalud`
--

LOCK TABLES `establecimientosalud` WRITE;
/*!40000 ALTER TABLE `establecimientosalud` DISABLE KEYS */;
INSERT INTO `establecimientosalud` VALUES (1,'Hospital Del Norte','secundario','65894578',1,'2024-10-28 23:28:27',NULL,4),(2,'Los Olivos','primario','78459804',1,'2024-10-28 23:28:53',NULL,12);
/*!40000 ALTER TABLE `establecimientosalud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `familiarreferencia`
--

DROP TABLE IF EXISTS `familiarreferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familiarreferencia` (
  `idFamiliarReferencia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `apellido` varchar(120) NOT NULL,
  `numCelular` varchar(15) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  `Persona_idPersona` int NOT NULL,
  PRIMARY KEY (`idFamiliarReferencia`),
  KEY `fk_FamiliarReferencia_Persona1_idx` (`Persona_idPersona`),
  CONSTRAINT `fk_FamiliarReferencia_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `familiarreferencia`
--

LOCK TABLES `familiarreferencia` WRITE;
/*!40000 ALTER TABLE `familiarreferencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `familiarreferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `idPersona` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(60) NOT NULL,
  `primerApellido` varchar(60) NOT NULL,
  `segundoApellido` varchar(60) DEFAULT NULL,
  `numeroCelular` varchar(15) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `CI` varchar(12) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  `EstablecimientoSalud_idEstablecimientoSalud` int DEFAULT '1',
  `idCriterioIngreso` int DEFAULT NULL,
  PRIMARY KEY (`idPersona`),
  KEY `fk_Persona_EstablecimientoSalud1_idx` (`EstablecimientoSalud_idEstablecimientoSalud`),
  KEY `fk_CriterioIngreso` (`idCriterioIngreso`),
  CONSTRAINT `fk_CriterioIngreso` FOREIGN KEY (`idCriterioIngreso`) REFERENCES `criterioingreso` (`idCriterioIngreso`),
  CONSTRAINT `fk_Persona_EstablecimientoSalud1` FOREIGN KEY (`EstablecimientoSalud_idEstablecimientoSalud`) REFERENCES `establecimientosalud` (`idEstablecimientoSalud`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'joshua','Martinez','Rivera','65987804','2024-10-30','Masculino','Av. Villaquien','7849089755',1,'2024-10-28 23:51:19',NULL,2,12),(2,'Nicole','Escalera','Paz','68597845',NULL,NULL,NULL,'102458798',1,'2024-10-28 23:58:36',NULL,2,NULL),(3,'Alejandro','Paz','','79806590','2005-03-05','Masculino','Av. Villaquien','89869807',1,'2024-10-30 02:24:01',NULL,1,11),(4,'Karla','Saavedra','','72270404','1985-03-27','Femenino','Av. Papa Paulo','5281220',1,'2024-10-30 02:30:28',NULL,2,9),(5,'Mateo','Crespa','','79860833','2024-10-30','Masculino','A. America 089','16986508',0,'2024-10-30 02:33:52',NULL,2,9);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona_has_transferencia`
--

DROP TABLE IF EXISTS `persona_has_transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona_has_transferencia` (
  `Persona_idPersona` int NOT NULL,
  `Transferencia_idTransferencia` int NOT NULL,
  PRIMARY KEY (`Persona_idPersona`,`Transferencia_idTransferencia`),
  KEY `fk_Persona_has_Transferencia_Transferencia1_idx` (`Transferencia_idTransferencia`),
  KEY `fk_Persona_has_Transferencia_Persona1_idx` (`Persona_idPersona`),
  CONSTRAINT `fk_Persona_has_Transferencia_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`),
  CONSTRAINT `fk_Persona_has_Transferencia_Transferencia1` FOREIGN KEY (`Transferencia_idTransferencia`) REFERENCES `transferencia` (`idTransferencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona_has_transferencia`
--

LOCK TABLES `persona_has_transferencia` WRITE;
/*!40000 ALTER TABLE `persona_has_transferencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona_has_transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalsalud`
--

DROP TABLE IF EXISTS `personalsalud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalsalud` (
  `persona_idPersona` int NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `contrasenia` varchar(30) NOT NULL,
  `rol` varchar(45) NOT NULL,
  PRIMARY KEY (`persona_idPersona`),
  KEY `fk_personalsalud_persona1_idx` (`persona_idPersona`),
  CONSTRAINT `fk_personalsalud_persona1` FOREIGN KEY (`persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalsalud`
--

LOCK TABLES `personalsalud` WRITE;
/*!40000 ALTER TABLE `personalsalud` DISABLE KEYS */;
INSERT INTO `personalsalud` VALUES (1,'josmar','784905875','Medico'),(2,'nicesc','102458798','Medico');
/*!40000 ALTER TABLE `personalsalud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `redsalud`
--

DROP TABLE IF EXISTS `redsalud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redsalud` (
  `idRedSalud` int NOT NULL AUTO_INCREMENT,
  `nombreRedSalud` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  `idSede` int NOT NULL,
  PRIMARY KEY (`idRedSalud`),
  KEY `fk_RedSalud_Sede1_idx` (`idSede`),
  CONSTRAINT `fk_RedSalud_Sede1` FOREIGN KEY (`idSede`) REFERENCES `sede` (`idSede`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redsalud`
--

LOCK TABLES `redsalud` WRITE;
/*!40000 ALTER TABLE `redsalud` DISABLE KEYS */;
INSERT INTO `redsalud` VALUES (1,'Cercado',1,'2024-10-29 03:26:01',NULL,1),(2,'Punata',1,'2024-10-29 03:26:01',NULL,1),(3,'Villa Tunari',1,'2024-10-29 03:26:01',NULL,1),(4,'Ivirgarzama',1,'2024-10-29 03:26:01',NULL,1),(5,'Quillacollo',1,'2024-10-29 03:26:01',NULL,1),(6,'Sacaba',1,'2024-10-29 03:26:01',NULL,1),(7,'Capinota',1,'2024-10-29 03:26:01',NULL,1),(8,'Totora',1,'2024-10-29 03:26:01',NULL,1),(9,'Aiquile',1,'2024-10-29 03:26:01',NULL,1),(10,'Mizque',1,'2024-10-29 03:26:01',NULL,1),(11,'Independencia',1,'2024-10-29 03:26:01',NULL,1),(12,'Tapacari',1,'2024-10-29 03:26:01',NULL,1),(13,'Tarata',1,'2024-10-29 03:26:01',NULL,1),(14,'Indígena',1,'2024-10-29 03:26:01',NULL,1),(15,NULL,1,'2024-10-29 03:26:01',NULL,1);
/*!40000 ALTER TABLE `redsalud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sede`
--

DROP TABLE IF EXISTS `sede`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sede` (
  `idSede` int NOT NULL AUTO_INCREMENT,
  `nombreSede` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idSede`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sede`
--

LOCK TABLES `sede` WRITE;
/*!40000 ALTER TABLE `sede` DISABLE KEYS */;
INSERT INTO `sede` VALUES (1,'Cochabamba',1,'2024-10-29 03:24:12',NULL),(2,'Santa Cruz',1,'2024-10-29 03:24:12',NULL),(3,'La Paz',1,'2024-10-29 03:24:12',NULL),(4,'Tarija',1,'2024-10-29 03:24:12',NULL),(5,'Oruro',1,'2024-10-29 03:24:12',NULL),(6,'Potosi',1,'2024-10-29 03:24:12',NULL),(7,'Beni',1,'2024-10-29 03:24:12',NULL),(8,'Pando',1,'2024-10-29 03:24:12',NULL),(9,'Chuquisaca',1,'2024-10-29 03:24:12',NULL);
/*!40000 ALTER TABLE `sede` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento`
--

DROP TABLE IF EXISTS `seguimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento` (
  `idSeguimiento` int NOT NULL AUTO_INCREMENT,
  `video` varchar(100) NOT NULL,
  `fechaEnvio` datetime NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `Persona_idPersona` int NOT NULL,
  `EstablecimientoSalud_idEstablecimientoSalud` int NOT NULL,
  PRIMARY KEY (`idSeguimiento`),
  KEY `fk_Seguimiento_Persona1_idx` (`Persona_idPersona`),
  KEY `fk_Seguimiento_EstablecimientoSalud1_idx` (`EstablecimientoSalud_idEstablecimientoSalud`),
  CONSTRAINT `fk_Seguimiento_EstablecimientoSalud1` FOREIGN KEY (`EstablecimientoSalud_idEstablecimientoSalud`) REFERENCES `establecimientosalud` (`idEstablecimientoSalud`),
  CONSTRAINT `fk_Seguimiento_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento`
--

LOCK TABLES `seguimiento` WRITE;
/*!40000 ALTER TABLE `seguimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transferencia`
--

DROP TABLE IF EXISTS `transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transferencia` (
  `idTransferencia` int NOT NULL AUTO_INCREMENT,
  `idEstablecimientoSaludOrigen` int NOT NULL,
  `idEstablecimientoSaludDestino` int NOT NULL,
  `imagenReferencia` varchar(200) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idTransferencia`),
  KEY `fk_Transferencia_EstablecimientoSalud1_idx` (`idEstablecimientoSaludOrigen`),
  KEY `fk_Transferencia_EstablecimientoSalud2_idx` (`idEstablecimientoSaludDestino`),
  CONSTRAINT `fk_Transferencia_EstablecimientoSalud1` FOREIGN KEY (`idEstablecimientoSaludOrigen`) REFERENCES `establecimientosalud` (`idEstablecimientoSalud`),
  CONSTRAINT `fk_Transferencia_EstablecimientoSalud2` FOREIGN KEY (`idEstablecimientoSaludDestino`) REFERENCES `establecimientosalud` (`idEstablecimientoSalud`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transferencia`
--

LOCK TABLES `transferencia` WRITE;
/*!40000 ALTER TABLE `transferencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento`
--

DROP TABLE IF EXISTS `tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento` (
  `idTratamiento` int NOT NULL AUTO_INCREMENT,
  `medicamento` varchar(45) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFinalizacion` datetime DEFAULT NULL,
  `cantDosis` int NOT NULL,
  `intervaloTiempo` int NOT NULL,
  `Persona_idPersona` int NOT NULL,
  PRIMARY KEY (`idTratamiento`),
  KEY `fk_Tratamiento_Persona1_idx` (`Persona_idPersona`),
  CONSTRAINT `fk_Tratamiento_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento`
--

LOCK TABLES `tratamiento` WRITE;
/*!40000 ALTER TABLE `tratamiento` DISABLE KEYS */;
INSERT INTO `tratamiento` VALUES (1,'Ibuprofeno','2024-10-28 00:00:00','2024-12-26 00:00:00',500,8,1),(2,'paracetamol','2024-10-31 00:00:00','2025-01-24 00:00:00',400,6,2),(3,'Aspirina','2025-02-12 00:00:00','2032-10-30 00:00:00',1,8,2);
/*!40000 ALTER TABLE `tratamiento` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-30 15:28:48
