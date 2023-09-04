import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db/connet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await clientPromise;
    const db = client.db("yeh");
    const collection = await db.collection("user");

    await collection.insertOne(data);

    client.close();

    return res.status(200).json("OK");
  }
}
