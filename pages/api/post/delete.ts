import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import { verify } from "../../../lib/jwt";
import fs from "fs/promises";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;
  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const { postId } = req.body;
    dbConnect();

    const checkingId = await Post.find({ _id: postId });

    if (checkingId[0]?.img.length !== 0) {
      const path = checkingId[0]?.img.map((v: any) => "/uploads/" + v.filename);
      path.map((file: any) => fs.unlink(file));
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json("Access");
  }
}
