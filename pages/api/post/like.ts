import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import { verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;
  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const { id, postId } = req.body;

    dbConnect();

    const checkingId = await Post.find({ _id: postId });

    const isLike = checkingId && checkingId[0]?.likes.includes(id);

    if (!isLike) {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            likes: id,
          },
        }
      );
    } else {
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: id,
          },
        }
      );
    }
    res.status(200).json("Access");
  }
}
