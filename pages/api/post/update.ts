import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export const config = {
  api: {
    bodyParser: false, //next에서는 기본으로 bodyParser가 작동되므로 false로 해준다.
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
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

    const deleteFile = async (req: string) => {
      const path = imgStoragePath + "/" + req;
      await fs.unlink(path);
    };

    const data = await readFile(req);
    const images = (props: any) => {
      const result = props?.map((v: any) => ({
        filename: v.newFilename,
        path: v.filepath,
        type: v.mimetype,
      }));
      return result;
    };

    dbConnect();

    const id = data?.fields?.postId![0];
    const title = data?.fields?.title![0];
    const content = data?.fields?.content![0];
    const image = data.fields.image;

    const checkingId = await Post.find({ _id: id });
    const existingImg = checkingId[0].img.filter((v: any) => image?.includes(v._id.toString()));
    const deleteImg = checkingId[0].img.filter((v: any) => !image?.includes(v._id.toString()));

    let uploadImg = [];
    if (data.files.newImage) uploadImg = [...images(data.files.newImage), ...existingImg];
    else uploadImg = existingImg;

    await Post.updateOne({ _id: id }, { title: title, content: content, img: uploadImg });
    await deleteImg.map((v: any) => deleteFile(v.filename));

    res.status(200).json("OK");
  }
}
