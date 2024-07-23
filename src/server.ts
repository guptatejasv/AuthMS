import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes";
import connectDB from "./config/auth.db";
// import mongoose from "mongoose";

dotenv.config();
connectDB();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
