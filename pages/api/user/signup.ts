import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/user";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method === "POST") {
  //   const { id, password, nickname, email } = req.body;
  //   const client = await clientPromise;

  //   const db = client.db("yeh");
  //   const collection = await db.collection("user");

  //   const checkExisting = await collection.findOne({ id });

  //   if (checkExisting) {
  //     client.close();
  //     res.status(422).json("Duplication");
  //     return;
  //   }

  //   await collection.insertOne({
  //     email: email,
  //     id: id,
  //     nickname: nickname,
  //     password: await bcrypt.hash(password, 12), // 비밀번호 Hash 암호화
  //   });

  //   res.status(200).json("OK");
  //   client.close();

  if (req.method === "POST") {
    const { id, password, nickname, email } = req.body;

    dbConnect();

    const user = new User({
      email: email,
      userId: id,
      nickname: nickname,
      password: await bcrypt.hash(password, 12), // 비밀번호 Hash 암호화
    });

    await User.create(user);
    res.status(200).json("OK");
  }
}
