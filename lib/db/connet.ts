import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const client = new MongoClient(URI!);
const clientPromise = client.connect();

export default clientPromise;
