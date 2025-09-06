import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
  console.log(`database url is required`);
}
export const sql = neon(process.env.DATABASE_URL);

