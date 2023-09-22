import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import fs from "fs/promises";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { postId } = req.body;
    dbConnect();

    const checkingId = await Post.find({ _id: postId });

    if (checkingId[0]?.img.length !== 0) {
      const path = checkingId[0]?.img.map((v: any) => "./public/uploads/" + v.filename);
      path.map((file: any) => fs.unlink(file));
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json("OK");
  }
}
