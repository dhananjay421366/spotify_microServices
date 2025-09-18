import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.log(`database url is required`);
}
export const sql = neon(process.env.DATABASE_URL);

