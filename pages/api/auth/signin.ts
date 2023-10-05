import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, refresh } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, password } = req.body;

    dbConnect();

    const checkUser = await User.find({ userId: id });
    if (checkUser.length === 0 || !bcrypt.compareSync(password, checkUser[0]?.password)) {
      res.status(200).json({ message: "Access Denied" });
    }

    const accessToken = access(id);
    const refreshToken = refresh(id);

    // DB에 Refresh Token 저장
    await User.updateOne({ userId: id }, { refreshToken });

    // Access Token은 쿠키에 담아 보내줌
    res.setHeader(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; Expires=${new Date(Date.now() + 60 * 1000 * 10).toUTCString()}; HttpOnly`
    );

    res.status(200).json({ message: "Access", data: { nickname: checkUser[0]?.nickname, id: checkUser[0]?._id } });
  }
}
