import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";

import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false, //next에서는 기본으로 bodyParser가 작동되므로 false로 해준다.
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const options: formidable.Options = {};

    // const imgStoragePath = async (req: NextApiRequest) => {
    //   return new Promise<string>((resolve, rejects) => {
    //     const form = formidable(options);

    //     form.parse(req, (err, fields, files) => {
    //       if (err) {
    //         rejects(err);
    //       }
    //       // console.log(fields);
    //       resolve("./public/uploads/" + fields?.id);
    //     });
    //   });
    // };
    // const primaryPath = await imgStoragePath(req);
    const imgStoragePath = "./public/uploads";

    try {
      await fs.readdir(imgStoragePath);
    } catch {
      await fs.mkdir(imgStoragePath);
    }

    const readFile = (req: NextApiRequest) => {
      options.uploadDir = imgStoragePath;
      options.keepExtensions = true;

      options.filename = (name, ext, path, form) => {
        return Date.now().toString() + "_" + path.originalFilename;
      };

      return new Promise<{
        fields: formidable.Fields;
        files: formidable.Files;
      }>((resolve, rejects) => {
        const form = formidable(options);

        form.parse(req, (err, fields, files) => {
          if (err) {
            rejects(err);
          }
          resolve({ fields, files });
        });
      });
    };
    const data = await readFile(req);

    const client = await clientPromise;
    const db = client.db("yeh");
    const collection = await db.collection("post");

    await collection.insertOne({
      image: data.files.image,
      userId: data.fields.id && data.fields.id[0],
      writer: data.fields.writer && data.fields.writer[0],
      title: data.fields.title && data.fields.title[0],
      content: data.fields.content && data.fields.content[0],
      createTime: new Date(),
      view: 0,
      likes: 0,
      comments: 0,
    });
    client.close();

    res.status(200).json("OK");
  }
}
