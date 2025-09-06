import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

// All configurations
dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ limit: "16kb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

// Middleware for session
app.use(
  session({
    secret: process.env.JWT_SECRET || "Archana Dadasaheb Nimbalkar",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      // maxAge: 24 * 60 * 60 * 1000, 1 day
      maxAge: 60 * 60 * 1000, // ⬅️ 1 hour in ms
    },
  })
);

// import routs here

import songRouter from "./routes/song.route.js";

app.use("/api/v1/song", songRouter);

export { app };
