import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/user";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, password, nickname, email } = req.body;

    dbConnect();

    const checkExisting = await User.findOne({ id });

    if (checkExisting) {
      res.status(422).json("Duplication");
      return;
    }

    const userData = new User({
      email: email,
      userId: id,
      nickname: nickname,
      password: await bcrypt.hash(password, 12), // 비밀번호 Hash 암호화
    });

    await User.create(userData);
    res.status(200).json("OK");
  }
}
