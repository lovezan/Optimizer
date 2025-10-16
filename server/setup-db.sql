CREATE DATABASE IF NOT EXISTS amazon_optimizer
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE amazon_optimizer;

CREATE TABLE IF NOT EXISTS optimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(20) NOT NULL,
  original_title TEXT,
  original_bullets TEXT,
  original_description TEXT,
  optimized_title TEXT,
  optimized_bullets TEXT,
  optimized_description TEXT,
  keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_asin (asin),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
