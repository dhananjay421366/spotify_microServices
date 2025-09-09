import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
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

// ✅ Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET || "Archana Dadasaheb Nimbalkar",
    resave: false,
    saveUninitialized: false, // better security (don’t save empty sessions)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// ✅ Import routes
import adminRouter from "./routes/admin.route.js";

// ✅ Use routes
app.use("/api/v1/admin", adminRouter);

export { app };
