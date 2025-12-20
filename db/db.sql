
CREATE DATABASE IF NOT EXISTS todoDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Criação do usuário
CREATE USER IF NOT EXISTS 'nextjs'@'%' IDENTIFIED BY '1234567';

-- Permissões
GRANT ALL PRIVILEGES ON todoDB.* TO 'nextjs'@'%';
FLUSH PRIVILEGES;

USE todoDB;

-- Tabela de usuários
CREATE TABLE users (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Enum de status das tarefas
CREATE TABLE tasks (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
