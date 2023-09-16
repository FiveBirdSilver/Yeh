import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { content, writer, postId } = req.body;

    dbConnect();

    const update = {
      content: content,
      writer: writer,
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

    res.status(200).json("OK");
  }
}
