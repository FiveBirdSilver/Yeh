import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, refresh, verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    console.log(checkUser.password);
    console.log(password);

    if (checkUser === null || !bcrypt.compareSync(password, checkUser.password)) {
      return res.status(200).json({ message: "Access Denied" });
    }

    const accessToken = access(email);
    const refreshToken = refresh(email);
    const expired = new Date(Date.now() + 60 * 1000 * 10);

    // DB에 Refresh Token 저장
    await User.updateOne({ email }, { refreshToken });

    // Access Token은 쿠키에 담아 보내줌
    await res.setHeader("Set-Cookie", [
      `uid=${encodeURI(checkUser.nickname)};Path=/;Expires=${expired.toUTCString()};`,
      `accessToken=${accessToken}; Path=/; Expires=${expired.toUTCString()}; HttpOnly`,
    ]);

    return res.status(200).json({ message: "Access" });
  }

  // 로그아웃
  else if (req.method === "DELETE") {
    const cookie = req.headers.cookie?.split(";");

    if (cookie) {
      const token = cookie[1].replace(" accessToken=", "").replace(/'/g, "");
      const email = verify(token).email;
      const expired = new Date(Date.now() - 1);

      res.setHeader("Set-Cookie", [
        `uid=; Path=/; Expires=${expired.toUTCString()};`,
        `accessToken=; Path=/; Expires=${expired.toUTCString()}; HttpOnly`,
      ]);

      await User.updateOne({ email }, { $unset: { refreshToken: 1 } });

      res.status(200).json({ message: "Access" });
    }
  }
}
