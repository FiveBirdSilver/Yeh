import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db/connet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("yeh");
  const result = await db.collection("post").find({}).toArray();

  return res.status(200).json(result);
}