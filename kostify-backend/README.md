# Kostify Backend

Backend service for the Kostify application, a room management system for boarding houses.

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)

## Setup Instructions

1. Clone the repository

2. Install dependencies
   ```
   npm install
   ```

3. Configure the database
   - Make sure PostgreSQL is running
   - Update the database connection settings in `db.js` if needed:
     ```js
     const pool = new Pool({
       user: 'postgres',
       host: 'localhost',
       database: 'kostify',
       password: 'postgres',
       port: 5432,
     });
     ```

4. Initialize the database
   ```
   npm run init-db
   ```
   This will:
   - Create the `kostify` database if it doesn't exist
   - Create the required tables
   - Seed initial room data

5. Start the server
   ```
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

6. The server will run at `http://localhost:3000`

## API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user

### Room Endpoints
- `GET /rooms` - Get all rooms
- `GET /rooms/:id` - Get a specific room
- `POST /rooms` - Create a new room
- `PUT /rooms/:id` - Update a room
- `DELETE /rooms/:id` - Delete a room
- `PATCH /rooms/:id/book` - Book a room

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'penyewa'))
)
```

### Rooms Table
```sql
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked'))
)
``` 