import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { urlencoded } from "express";

// All configurations
dotenv.config();
const app = express();

app.use(cors({ origin:"http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ limit: "16kb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());


// import routs here

import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);

export { app };

