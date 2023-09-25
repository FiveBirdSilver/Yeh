import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();
  const { keyword } = req.body;

  const result = await Post.find({
    $or: [
      { title: { $regex: keyword !== undefined ? keyword : "", $options: "i" } },
      { content: { $regex: keyword !== undefined ? keyword : "", $options: "i" } },
    ],
  });

  result.sort((a, b) => b.createTime.getTime() - a.createTime.getTime());
  return res.status(200).json(result);
}
