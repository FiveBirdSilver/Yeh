import { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const postId = req?.query.id;

    const result = await Post.find({ _id: postId });

    res.status(200).json(result);
  }
}
