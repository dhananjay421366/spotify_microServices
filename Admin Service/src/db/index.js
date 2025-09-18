import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.log(`database url is required`);
}
export const sql = neon(process.env.DATABASE_URL);

async function connectDB() {
  try {
    // Artists table
    await sql`
      CREATE TABLE IF NOT EXISTS artists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        thumbnail VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Albums table
    await sql`
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Songs table
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log(`Error to connect PostgresSQL!`, error);
    process.exit();
  }
}

export { connectDB };
