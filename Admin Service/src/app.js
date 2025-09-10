import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// All configurations
dotenv.config();
const app = express();

// ✅ CORS fix (no space + allow local + prod)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gana11.netlify.app",
    ],
    credentials: true,
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
