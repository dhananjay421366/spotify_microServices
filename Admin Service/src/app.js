import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// All configurations
dotenv.config();
const app = express();

// ✅ CORS setup (only allow your frontend)
app.use(
  cors({
    origin: "https://gana11.netlify.app", // your frontend
    credentials: true, // allow cookies / auth headers
  })
);

// ✅ JSON & URL-encoded body parser
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ limit: "16kb", extended: true }));

// ✅ Static file serving (if needed)
app.use(express.static("public"));

// ✅ Cookie parser
app.use(cookieParser());

// ❌ Removed session middleware

// ✅ Import routes
import adminRouter from "./routes/admin.route.js";

// ✅ Use routes
app.use("/api/v1/admin", adminRouter);

export { app };
