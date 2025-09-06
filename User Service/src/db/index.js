import mongoose from "mongoose";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      // `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
      `${process.env.MONGODB_URI}${process.env.DB_NAME}`
    );

    console.log(
      "MongoDB is connected successfully with host :",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(`Error to connect MongoDB!`, error);
    process.exit();
  }
}

export { connectDB };
