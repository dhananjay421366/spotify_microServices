import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import { redisClient } from "./middleware/Redis.js";
dotenv.config({
  path: "./.env",
});

// set up the redis
redisClient
  .connect()
  .then(() => console.log(`connected to redis successfully !`))
  .catch((err) => console.log(`Error to connect radis ${err}`));
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is listen on PORT ${process.env.PORT} `);
    });
  })
  .catch((err) => {
    console.log("Error to connecting PostgresSQL", err);
  });
