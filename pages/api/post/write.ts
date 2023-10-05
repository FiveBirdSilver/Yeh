import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import jwt from "jsonwebtoken";

import formidable from "formidable";
import fs from "fs/promises";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";
import { verify } from "../../../lib/jwt";

export const config = {
  api: {
    bodyParser: false, //next에서는 기본으로 bodyParser가 작동되므로 false로 해준다.
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;

  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const options: formidable.Options = {};
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

    dbConnect();

    const images = (props: any) => {
      const result = props?.map((v: any) => ({
        filename: v.newFilename,
        path: v.filepath,
        type: v.mimetype,
      }));
      return result;
    };

    const postData = new Post({
      img: data.files.image ? images(data.files.image) : [],
      userId: data.fields.id && data.fields.id[0],
      writer: {
        id: data.fields.id && data.fields.id[0],
        nickname: data.fields.writer && data.fields.writer[0],
      },
      title: data.fields.title && data.fields.title[0],
      content: data.fields.content && data.fields.content[0],
      createTime: new Date(),
      view: 0,
      likes: [],
      comments: [],
    });

    await Post.create(postData);

    res.status(200).json("Access");
  }
}
