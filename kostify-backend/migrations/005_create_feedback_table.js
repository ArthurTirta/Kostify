const { Pool } = require('pg');
const pool = require('../db');

async function createFeedbackTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        user_name VARCHAR(100) NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Feedback table created successfully');
  } catch (error) {
    console.error('Error creating feedback table:', error);
  }
}

createFeedbackTable(); 