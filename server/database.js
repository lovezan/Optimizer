import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env path relative to this file to avoid cwd issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });
// Quick sanity log (no password) to confirm env is loaded
console.log('DB env:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  hasPassword: Boolean(process.env.DB_PASSWORD),
  name: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_optimizer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    connection.release();
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

export async function saveOptimization(data) {
  try {
    const [result] = await pool.query(
      `INSERT INTO optimizations
       (asin, original_title, original_bullets, original_description,
        optimized_title, optimized_bullets, optimized_description, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.asin,
        data.original_title,
        JSON.stringify(data.original_bullets),
        data.original_description,
        data.optimized_title,
        JSON.stringify(data.optimized_bullets),
        data.optimized_description,
        JSON.stringify(data.keywords)
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error('❌ Save optimization error:', error.message);
    throw error;
  }
}

export async function getOptimizationHistory(asin) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM optimizations
       WHERE asin = ?
       ORDER BY created_at DESC`,
      [asin]
    );

    return rows.map(row => ({
      ...row,
      original_bullets: JSON.parse(row.original_bullets),
      optimized_bullets: JSON.parse(row.optimized_bullets),
      keywords: JSON.parse(row.keywords)
    }));
  } catch (error) {
    console.error('❌ Get history error:', error.message);
    throw error;
  }
}

export async function getAllOptimizations() {
  try {
    const [rows] = await pool.query(
      `SELECT id, asin, optimized_title, created_at
       FROM optimizations
       ORDER BY created_at DESC
       LIMIT 50`
    );
    return rows;
  } catch (error) {
    console.error('❌ Get all optimizations error:', error.message);
    throw error;
  }
}

export default pool;
