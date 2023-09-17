import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, postId } = req.body;

    dbConnect();

    const checkingId = await Post.find({ _id: postId });

    const isLike = checkingId && checkingId[0]?.likes.includes(username);

    if (!isLike) {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            likes: username,
          },
        }
      );
    } else {
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: username,
          },
        }
      );
    }
    res.status(200).json("OK");
  }
}
