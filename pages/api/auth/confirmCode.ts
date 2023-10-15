import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, refresh } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;

  dbConnect();
  const checkUser = await User.findOne({ email });

  if (checkUser.authCode === Number(code)) {
    const accessToken = access(email);
    const refreshToken = refresh(email);

    await User.updateOne({ email }, { refreshToken });
    res.setHeader(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; Expires=${new Date(Date.now() + 60 * 1000 * 3).toUTCString()}; HttpOnly`
    );
    return res.status(200).json({ message: "Access" });
  } else return res.status(200).json({ message: "Access Denied" });
}
