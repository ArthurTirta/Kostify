const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default postgres database initially
  password: 'postgres',
  port: 5432,
};

async function initializeDatabase() {
  const pool = new Pool(config);
  const client = await pool.connect();

  try {
    // Create kostify database if it doesn't exist
    console.log('Checking if kostify database exists...');
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'kostify'"
    );

    if (dbCheckResult.rowCount === 0) {
      console.log('Creating kostify database...');
      await client.query('CREATE DATABASE kostify');
      console.log('Database created successfully');
    } else {
      console.log('Database already exists');
    }

    // Close the connection to default database
    await client.release();
    await pool.end();

    // Connect to kostify database
    const kostifyPool = new Pool({
      ...config,
      database: 'kostify',
    });
    const kostifyClient = await kostifyPool.connect();

    // Create tables
    console.log('Creating tables...');
    
    // Create users table if not exists
    await kostifyClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'penyewa'))
      )
    `);
    
    // Create rooms table if not exists
    await kostifyClient.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked'))
      )
    `);

    // Check if rooms table is empty and seed initial data if needed
    const roomsCount = await kostifyClient.query('SELECT COUNT(*) FROM rooms');
    if (parseInt(roomsCount.rows[0].count) === 0) {
      console.log('Seeding initial room data...');
      await kostifyClient.query(`
        INSERT INTO rooms (name, price, description, status) VALUES 
        ('Ruangan 1', 500000, 'Kamar nyaman dengan fasilitas lengkap', 'available'),
        ('Ruangan 2', 600000, 'Kamar luas dengan pemandangan indah', 'booked'),
        ('Ruangan 3', 450000, 'Kamar ekonomis dengan fasilitas standar', 'available')
      `);
      console.log('Initial room data seeded successfully');
    }

    console.log('Database initialization completed');
    await kostifyClient.release();
    await kostifyPool.end();

  } catch (err) {
    console.error('Error initializing database:', err);
    await client.release();
    await pool.end();
    process.exit(1);
  }
}

initializeDatabase(); 