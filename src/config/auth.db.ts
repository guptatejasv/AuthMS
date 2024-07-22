import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/AuthMS_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  } catch (error) {
    console.log("There is something wrong with Database connection");
  }
};

export default connectDB;
