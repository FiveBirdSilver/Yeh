import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import { verify } from "../../../lib/jwt";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;
  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const { postId } = req.body;
    const checkUser = await User.find({ userId: verify(token).id });

    dbConnect();

    const checkingId = await Post.find({ _id: postId });

    const isLike = checkingId && checkingId[0]?.likes.includes(checkUser[0].nickname);

    if (!isLike) {
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            likes: checkUser[0].nickname,
          },
        }
      );
    } else {
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: checkUser[0].nickname,
          },
        }
      );
    }
    res.status(200).json("Access");
  }
}
