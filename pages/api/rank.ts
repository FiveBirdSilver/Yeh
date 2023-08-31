import { MongoClient, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const client = await MongoClient.connect(process.env.MONGODB_URI!);

  // const database = client.db();
  // const userCollection = database.collection("rank");
  // const result = await userCollection.insertOne(req.body);

  // client.close();
  if (req.method === "POST") {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);

    const database = client.db();

    const meetupCollection = database.collection("rank");

    const result = await meetupCollection.insertOne(req.body);

    client.close();

    res.status(201).json({ message: "Meetup Inserted!" });
  }
}
