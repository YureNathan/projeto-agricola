CREATE DATABASE  IF NOT EXISTS `fluxo_caixa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fluxo_caixa`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: fluxo_caixa
-- ------------------------------------------------------
-- Server version	8.0.44

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

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `empresa_id` bigint NOT NULL,
  `nome` varchar(100) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `atualizado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `arquivada_em` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categorias_empresa_nome_tipo` (`empresa_id`,`nome`,`tipo`),
  KEY `idx_categorias_empresa` (`empresa_id`),
  KEY `idx_categorias_empresa_tipo` (`empresa_id`,`tipo`),
  CONSTRAINT `fk_categorias_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `chk_categorias_tipo` CHECK ((`tipo` in (_utf8mb4'RECEITA',_utf8mb4'DESPESA')))
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,1,'Saidas','DESPESA',1,'2026-08-21 23:37:04.750324','2026-08-25 22:55:51.001577',NULL),(2,1,'Entradas','RECEITA',1,'2026-08-21 23:39:02.134478','2026-08-25 22:55:44.200582',NULL),(3,1,'Insumos','DESPESA',1,'2026-08-25 23:30:22.706414','2026-08-25 23:30:22.706414',NULL),(4,1,'Outras receitas','RECEITA',1,'2026-08-26 20:05:58.685243','2026-08-26 20:05:58.685243',NULL),(5,2,'Outras receitas','RECEITA',1,'2026-08-26 20:05:58.685243','2026-08-26 20:05:58.685243',NULL),(7,1,'Combustível','DESPESA',1,'2026-08-26 20:05:58.695090','2026-08-26 20:05:58.695090',NULL),(8,2,'Combustível','DESPESA',1,'2026-08-26 20:05:58.695090','2026-08-26 20:05:58.695090',NULL),(10,1,'Manutenção','DESPESA',1,'2026-08-26 20:05:58.697699','2026-08-26 20:05:58.697699',NULL),(11,2,'Manutenção','DESPESA',1,'2026-08-26 20:05:58.697699','2026-08-26 20:05:58.697699',NULL),(13,1,'Outras despesas','DESPESA',1,'2026-08-26 20:05:58.699510','2026-08-26 20:05:58.699510',NULL),(14,2,'Outras despesas','DESPESA',1,'2026-08-26 20:05:58.699510','2026-08-26 20:05:58.699510',NULL),(16,1,'Venda da produção','RECEITA',1,'2026-08-26 20:05:58.701458','2026-08-26 20:05:58.701458',NULL),(17,2,'Venda da produção','RECEITA',1,'2026-08-26 20:05:58.701458','2026-08-26 20:05:58.701458',NULL),(19,2,'Insumos','DESPESA',1,'2026-08-26 20:05:58.703408','2026-08-26 20:05:58.703408',NULL),(22,1,'Sementes','DESPESA',1,'2026-08-26 20:05:58.712992','2026-08-26 20:05:58.712992',NULL),(23,2,'Sementes','DESPESA',1,'2026-08-26 20:05:58.712992','2026-08-26 20:05:58.712992',NULL),(25,1,'Fertilizantes','DESPESA',1,'2026-08-26 20:05:58.714299','2026-08-26 20:05:58.714299',NULL),(26,2,'Fertilizantes','DESPESA',1,'2026-08-26 20:05:58.714299','2026-08-26 20:05:58.714299',NULL),(28,1,'Defensivos','DESPESA',1,'2026-08-26 20:05:58.715938','2026-08-26 20:05:58.715938',NULL),(29,2,'Defensivos','DESPESA',1,'2026-08-26 20:05:58.715938','2026-08-26 20:05:58.715938',NULL),(31,1,'Máquinas','DESPESA',1,'2026-08-26 20:05:58.717724','2026-08-26 20:05:58.717724',NULL),(32,2,'Máquinas','DESPESA',1,'2026-08-26 20:05:58.717724','2026-08-26 20:05:58.717724',NULL),(47,3,'Sementes','DESPESA',1,'2026-08-30 19:53:25.690048','2026-08-30 19:53:25.690048',NULL),(48,3,'Combustível','DESPESA',1,'2026-08-30 19:56:35.472479','2026-08-30 19:56:35.472479',NULL),(49,3,'Venda de produto','RECEITA',1,'2026-08-30 21:27:23.374235','2026-08-30 21:27:23.374235',NULL),(50,4,'Outras receitas','RECEITA',1,'2026-08-31 00:43:38.280692','2026-08-31 00:43:38.280692',NULL),(51,4,'Combustível','DESPESA',1,'2026-08-31 00:43:38.286652','2026-08-31 00:43:38.286652',NULL),(52,4,'Manutenção','DESPESA',1,'2026-08-31 00:43:38.290625','2026-08-31 00:43:38.290625',NULL),(53,4,'Outras despesas','DESPESA',1,'2026-08-31 00:43:38.295593','2026-08-31 00:43:38.295593',NULL),(54,4,'Venda da produção','RECEITA',1,'2026-08-31 00:43:38.298571','2026-08-31 00:43:38.298571',NULL),(55,4,'Insumos','DESPESA',1,'2026-08-31 00:43:38.302546','2026-08-31 00:43:38.302546',NULL),(56,4,'Sementes','DESPESA',1,'2026-08-31 00:43:38.307515','2026-08-31 00:43:38.307515',NULL),(57,4,'Fertilizantes','DESPESA',1,'2026-08-31 00:43:38.312478','2026-08-31 00:43:38.312478',NULL),(58,4,'Defensivos','DESPESA',1,'2026-08-31 00:43:38.315457','2026-08-31 00:43:38.315457',NULL),(59,4,'Máquinas','DESPESA',1,'2026-08-31 00:43:38.319433','2026-08-31 00:43:38.319433',NULL);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contas_financeiras`
--

DROP TABLE IF EXISTS `contas_financeiras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contas_financeiras` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `empresa_id` bigint NOT NULL,
  `categoria_id` bigint NOT NULL,
  `descricao` varchar(150) NOT NULL,
  `favorecido` varchar(150) DEFAULT NULL,
  `numero_documento` varchar(80) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `valor_total` decimal(19,2) NOT NULL,
  `valor_liquidado` decimal(19,2) NOT NULL DEFAULT '0.00',
  `data_emissao` date NOT NULL,
  `data_vencimento` date NOT NULL,
  `data_liquidacao` date DEFAULT NULL,
  `situacao` varchar(30) NOT NULL DEFAULT 'PENDENTE',
  `lembrete_ativo` tinyint(1) NOT NULL DEFAULT '1',
  `antecedencia_lembrete_dias` int NOT NULL DEFAULT '2',
  `observacao` varchar(500) DEFAULT NULL,
  `versao` bigint NOT NULL DEFAULT '0',
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `atualizado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_contas_financeiras_empresa` (`empresa_id`),
  KEY `idx_contas_empresa_tipo_vencimento` (`empresa_id`,`tipo`,`data_vencimento`),
  KEY `idx_contas_empresa_situacao_vencimento` (`empresa_id`,`situacao`,`data_vencimento`),
  KEY `idx_contas_empresa_lembrete_vencimento` (`empresa_id`,`lembrete_ativo`,`situacao`,`data_vencimento`),
  KEY `idx_contas_financeiras_categoria` (`categoria_id`),
  CONSTRAINT `fk_contas_financeiras_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `fk_contas_financeiras_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `chk_contas_financeiras_lembrete` CHECK ((`antecedencia_lembrete_dias` between 0 and 365)),
  CONSTRAINT `chk_contas_financeiras_situacao` CHECK ((`situacao` in (_utf8mb4'PENDENTE',_utf8mb4'PARCIAL',_utf8mb4'QUITADA',_utf8mb4'CANCELADA'))),
  CONSTRAINT `chk_contas_financeiras_tipo` CHECK ((`tipo` in (_utf8mb4'PAGAR',_utf8mb4'RECEBER'))),
  CONSTRAINT `chk_contas_financeiras_valor_liquidado` CHECK (((`valor_liquidado` >= 0) and (`valor_liquidado` <= `valor_total`))),
  CONSTRAINT `chk_contas_financeiras_valor_total` CHECK ((`valor_total` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contas_financeiras`
--

LOCK TABLES `contas_financeiras` WRITE;
/*!40000 ALTER TABLE `contas_financeiras` DISABLE KEYS */;
/*!40000 ALTER TABLE `contas_financeiras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `agricultura_ativa` tinyint(1) NOT NULL DEFAULT '1',
  `pecuaria_ativa` tinyint(1) NOT NULL DEFAULT '0',
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `atualizado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresas_documento` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (1,'Empresa Teste','DOCTESTE001',1,1,0,'2026-08-21 22:54:37.171658','2026-08-21 22:54:37.171658'),(2,'Fazenda de Teste',NULL,1,1,0,'2026-08-26 05:12:00.767863','2026-08-26 05:12:00.767863'),(3,'Propriedade Teste',NULL,1,1,0,'2026-08-26 21:05:25.733675','2026-08-26 21:05:25.730696'),(4,'Fazenda Teste',NULL,1,1,0,'2026-08-31 00:43:38.223078','2026-08-31 00:43:38.223078');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','criar tabelas iniciais','SQL','V1__criar_tabelas_iniciais.sql',-242973760,'fluxo_caixa_app','2026-08-20 21:33:35',431,1),(2,'2','criar categorias','SQL','V2__criar_categorias.sql',-747140545,'fluxo_caixa_app','2026-08-21 20:13:27',461,1),(3,'3','criar usuarios','SQL','V3__criar_usuarios.sql',2141368752,'fluxo_caixa_app','2026-08-26 01:31:08',184,1),(4,'4','adicionar atividades empresa','SQL','V4__adicionar_atividades_empresa.sql',1415583847,'fluxo_caixa_app','2026-08-26 19:49:57',170,1),(5,'5','criar categorias iniciais','SQL','V5__criar_categorias_iniciais.sql',-1161018780,'fluxo_caixa_app','2026-08-26 20:05:58',66,1),(6,'6','adicionar data arquivamento categoria','SQL','V6__adicionar_data_arquivamento_categoria.sql',2026069993,'fluxo_caixa_app','2026-08-27 15:32:35',100,1),(7,'7','criar contas financeiras','SQL','V7__criar_contas_financeiras.sql',1937946309,'fluxo_caixa_app','2026-08-28 02:24:10',756,1),(8,'8','permitir liquidacao sem movimentacao','SQL','V8__permitir_liquidacao_sem_movimentacao.sql',-1724193308,'fluxo_caixa_app','2026-08-31 01:05:11',482,1),(9,'9','criar recuperacao senha','SQL','V9__criar_recuperacao_senha.sql',696684196,'fluxo_caixa_app','2026-09-01 01:38:58',224,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liquidacoes_contas`
--

DROP TABLE IF EXISTS `liquidacoes_contas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `liquidacoes_contas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `conta_financeira_id` bigint NOT NULL,
  `movimentacao_id` bigint DEFAULT NULL,
  `valor` decimal(19,2) NOT NULL,
  `data_liquidacao` date NOT NULL,
  `observacao` varchar(500) DEFAULT NULL,
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_liquidacoes_movimentacao` (`movimentacao_id`),
  KEY `idx_liquidacoes_conta` (`conta_financeira_id`),
  KEY `idx_liquidacoes_data` (`data_liquidacao`),
  CONSTRAINT `fk_liquidacoes_conta` FOREIGN KEY (`conta_financeira_id`) REFERENCES `contas_financeiras` (`id`),
  CONSTRAINT `fk_liquidacoes_movimentacao` FOREIGN KEY (`movimentacao_id`) REFERENCES `movimentacoes` (`id`),
  CONSTRAINT `chk_liquidacoes_contas_valor` CHECK ((`valor` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liquidacoes_contas`
--

LOCK TABLES `liquidacoes_contas` WRITE;
/*!40000 ALTER TABLE `liquidacoes_contas` DISABLE KEYS */;
/*!40000 ALTER TABLE `liquidacoes_contas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacoes`
--

DROP TABLE IF EXISTS `movimentacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacoes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `empresa_id` bigint NOT NULL,
  `categoria_id` bigint DEFAULT NULL,
  `descricao` varchar(150) NOT NULL,
  `valor` decimal(19,2) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `data_movimentacao` date NOT NULL,
  `observacao` varchar(500) DEFAULT NULL,
  `versao` bigint NOT NULL DEFAULT '0',
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `atualizado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_movimentacoes_empresa_data` (`empresa_id`,`data_movimentacao`),
  KEY `idx_movimentacoes_empresa_tipo` (`empresa_id`,`tipo`),
  KEY `idx_movimentacoes_categoria` (`categoria_id`),
  CONSTRAINT `fk_movimentacoes_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `fk_movimentacoes_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `chk_movimentacoes_tipo` CHECK ((`tipo` in (_utf8mb4'RECEITA',_utf8mb4'DESPESA'))),
  CONSTRAINT `chk_movimentacoes_valor` CHECK ((`valor` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacoes`
--

LOCK TABLES `movimentacoes` WRITE;
/*!40000 ALTER TABLE `movimentacoes` DISABLE KEYS */;
INSERT INTO `movimentacoes` VALUES (5,1,2,'Venda Arroz',55555.00,'RECEITA','2026-08-25',NULL,0,'2026-08-25 22:55:11.561606','2026-08-25 22:55:11.561606'),(18,3,47,'Comprar sementes',500.00,'DESPESA','2026-08-30',NULL,1,'2026-08-30 19:53:55.017228','2026-08-30 19:54:45.811346'),(19,3,48,'Gasolina Trator',150.00,'DESPESA','2026-08-30',NULL,0,'2026-08-30 20:02:34.594141','2026-08-30 20:02:34.594141');
/*!40000 ALTER TABLE `movimentacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperacao_senha`
--

DROP TABLE IF EXISTS `recuperacao_senha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recuperacao_senha` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expira_em` timestamp(6) NOT NULL,
  `utilizado_em` timestamp(6) NULL DEFAULT NULL,
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_recuperacao_senha_token_hash` (`token_hash`),
  KEY `idx_recuperacao_senha_usuario` (`usuario_id`),
  KEY `idx_recuperacao_senha_expira_em` (`expira_em`),
  CONSTRAINT `fk_recuperacao_senha_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacao_senha`
--

LOCK TABLES `recuperacao_senha` WRITE;
/*!40000 ALTER TABLE `recuperacao_senha` DISABLE KEYS */;
INSERT INTO `recuperacao_senha` VALUES (1,2,'82153a9790ec94786670670c279cfef71784f652ecea0d319cdd5c8483e0eb4b','2026-09-01 06:09:19.846911','2026-09-01 05:43:33.413319','2026-09-01 02:39:20.006216');
/*!40000 ALTER TABLE `recuperacao_senha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `empresa_id` bigint NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `papel` varchar(30) NOT NULL DEFAULT 'PROPRIETARIO',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `email_verificado` tinyint(1) NOT NULL DEFAULT '0',
  `tentativas_login` int NOT NULL DEFAULT '0',
  `bloqueado_ate` timestamp(6) NULL DEFAULT NULL,
  `ultimo_login_em` timestamp(6) NULL DEFAULT NULL,
  `versao` bigint NOT NULL DEFAULT '0',
  `criado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `atualizado_em` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuarios_email` (`email`),
  KEY `idx_usuarios_empresa` (`empresa_id`),
  KEY `idx_usuarios_empresa_ativo` (`empresa_id`,`ativo`),
  CONSTRAINT `fk_usuarios_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `chk_usuarios_papel` CHECK ((`papel` in (_utf8mb4'PROPRIETARIO',_utf8mb4'ADMINISTRADOR',_utf8mb4'FUNCIONARIO'))),
  CONSTRAINT `chk_usuarios_tentativas_login` CHECK ((`tentativas_login` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,2,'Produtor de Teste','produtor.teste@agrogestao.local','(00) 00000-0000','{bcrypt}$2a$10$0kCZ4ovuFY99XCEEMuQGFOnFXiCHM9R7MECwwxE0yrKxm1R6oerM6','PROPRIETARIO',1,0,0,NULL,NULL,0,'2026-08-26 05:12:00.952864','2026-08-26 05:12:00.952864'),(2,3,'Tadeu Almeida Rodriguez','tadeu.ar@aluno.ifsc.edu.br','+5548988149915','{bcrypt}$2a$10$L0Cmo0meIvpCDj9VPtLRqexgSkMcOgUyXsTURthxAcQtMSGXIvo1u','PROPRIETARIO',1,0,0,NULL,NULL,1,'2026-08-26 21:05:25.969096','2026-09-01 05:43:33.708340'),(3,4,'Tadeu Teste','tadeu.teste@email.com','48999999999','{bcrypt}$2a$10$pYT0lVkPE.m78/3.phISV.OkPQVZw7U.0Qe4WUECC8ekJWzKee/SK','PROPRIETARIO',1,0,0,NULL,NULL,0,'2026-08-31 00:43:38.471413','2026-08-31 00:43:38.471413');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-01  0:23:34
