import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();

  const result = await Post.find();

  // const client = await clientPromise;
  // const db = client.db("yeh");
  // const result = await db.collection("post").find({}).toArray();

  return res.status(200).json(result);
}
