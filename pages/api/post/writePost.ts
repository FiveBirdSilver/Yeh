import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import { createRouter, expressWrapper } from "next-connect";
import multer from "multer";

const upload = multer();

export const config = {
  api: {
    bodyParser: false, //next에서는 기본으로 bodyParser가 작동되므로 false로 해준다.
  },
};

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const client = await clientPromise;

    const db = client.db("yeh");
    const collection = await db.collection("post");

    upload.single("image")(req, res, async (err) => {
      const fileBuffer = req?.file.buffer;
      const contentType = req?.file.mimetype;
      const { title, content, writer } = req.body;

      await collection.insertOne({
        image: {
          data: fileBuffer,
          contentType: contentType,
        },
        writer: writer,
        title: title,
        content: content,
        createTime: new Date(),
        view: 0,
        likes: 0,
        comments: 0,
      });

      client.close();

      res.status(200).json("OK");
    });

    // await collection.insertOne({
    //   writer: writer,
    //   title: title,
    //   content: content,
    //   image: image,
    //   createTime: new Date(),
    //   view: 0,
    //   likes: 0,
    //   comments: 0,
    // });
  }
}
