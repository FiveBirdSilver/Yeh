import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/user";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { content, writer, postId } = req.body;

    dbConnect();

    const checkPost = await Post.find({ id: postId });

    //   if (await bcrypt.compare(password, checkUser[0]?.password)) {
    //     res.status(200).json({ message: "Access", data: { nickname: checkUser[0]?.nickname, id: checkUser[0]?._id } });
    //   } else res.status(200).json("Access Denied");
    // }
  }
}
