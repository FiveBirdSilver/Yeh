import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import bcrypt from "bcrypt";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const postId = req?.query.id;

    const result = await Post.find({ _id: postId });

    await Post.updateOne(
      { _id: postId },
      {
        view: result ? (result[0].view += 1) : 0,
      }
    );

    res.status(200).json(result);
  }
}
