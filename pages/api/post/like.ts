import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, postId } = req.body;

    dbConnect();

    await Post.updateOne(
      { _id: postId },
      {
        $push: {
          likes: username,
        },
      }
    );

    res.status(200).json("OK");
  }
}
