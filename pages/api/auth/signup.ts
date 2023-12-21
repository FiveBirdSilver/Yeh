import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password, nickname, email } = req.body;

    dbConnect();

    const checkEmail = await User.findOne({ email });
    const checkNickname = await User.findOne({ nickname });

    if (checkEmail) {
      res.status(200).json({ message: "Duplication account" });
      return;
    } else if (checkNickname) {
      res.status(200).json({ message: "Duplication nickname" });
      return;
    }

    const userData = new User({
      email: email,
      nickname: nickname,
      password: await bcrypt.hash(password, 12), // 비밀번호 Hash 암호화
    });

    await User.create(userData);
    res.status(200).json({ message: "OK" });
  }
}
