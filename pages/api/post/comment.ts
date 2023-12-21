import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import { verify } from "../../../lib/jwt";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;
  if (verify(token).message === "Access Denied") {
    res.status(401).json(verify(token).message);
  } else {
    if (req.method === "POST") {
      const { postId, content } = req.body;
      const checkUser = await User.find({ email: verify(token).email });

      dbConnect();

      const update = {
        content: content,
        nickname: checkUser[0].nickname,
        writeTime: new Date(),
      };

      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            comments: update,
          },
        }
      );

      res.status(200).json("Access");
    } else if (req.method === "DELETE") {
      const { postId, commentId } = req.body;

      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            comments: {
              _id: commentId,
            },
          },
        }
      );
      res.status(200).json("Access");
    }
  }
}
