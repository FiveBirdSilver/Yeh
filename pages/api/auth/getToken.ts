import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.cookie?.split("=")[1] || "";
  if (verify(token).message === "Access Denied") {
    res.status(200).json({ message: verify(token).message, nickname: null });
  } else {
    const email = verify(token).email;
    const checkUser = await User.findOne({ email });
    const accessToken = access(email);

    res.setHeader(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; Expires=${new Date(Date.now() + 60 * 1000 * 10).toUTCString()}; HttpOnly`
    );
    res.status(200).json({ message: "Access", nickname: checkUser.nickname });
  }
}
