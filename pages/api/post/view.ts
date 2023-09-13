import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();

  const result = await Post.find();
  result.sort((a, b) => b.createTime.getTime() - a.createTime.getTime());

  return res.status(200).json(result);
}
