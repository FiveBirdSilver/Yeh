import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const dbConnect = async () => mongoose.connect(MONGO_URI!);

export default dbConnect;
