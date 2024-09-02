import { app } from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const PORT = process.env.PORT;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const server = async () => {
  if (!MONGODB_CONNECTION_STRING) {
    throw new Error("MONGODB_CONNECTION_STRING not defined");
  }
  try {
    console.log("connecting to mongodb...");
    await mongoose.connect(MONGODB_CONNECTION_STRING as string);
    console.log("connected to mongodb :)");
  } catch (error) {
    console.log("There is an error in connecting to mongoDb");
    console.error(error);
  }
  app.listen(PORT, () => {
    console.log(`V1 Server running on port ${PORT} running in dev mode`);
  });
};

server();
