import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.cookie?.split("=")[1] || "";
  const email = verify(token).email;
  const expired = new Date(Date.now() - 1);

  if (email) {
    dbConnect();
    res.setHeader("Set-Cookie", [
      `uid=; Path=/; Expires=${expired.toUTCString()};`,
      `accessToken=; Path=/; Expires=${expired.toUTCString()}; HttpOnly`,
    ]);

    await User.updateOne({ email }, { $unset: { refreshToken: 1 } });
  }

  res.status(200).json({ message: "Access" });
}
