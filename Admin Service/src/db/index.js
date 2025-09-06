import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
  console.log(`database url is required`);
}
export const sql = neon(process.env.DATABASE_URL);
async function connectDB() {
  try {
    await sql`  CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
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
