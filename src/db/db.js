import mongoose from "mongoose";

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection success");
  } catch (err) {
    console.log("Database connection error:", err);
  }
}

export default connectDb;
