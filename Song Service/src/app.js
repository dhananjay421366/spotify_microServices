import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// All configurations
dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://gana11.netlify.app"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Remove express-session (not needed with JWT)

// import routes
import songRouter from "./routes/song.route.js";
app.use("/api/v1/song", songRouter);

export { app };
