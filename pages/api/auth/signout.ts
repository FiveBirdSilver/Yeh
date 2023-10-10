import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.cookie?.split("=")[1] || "";
  const id = verify(token).id;
  if (id) {
    dbConnect();
    res.setHeader("Set-Cookie", `accessToken=; Path=/; Expires=${new Date(Date.now() - 1).toUTCString()}; HttpOnly`);

    await User.updateOne({ userId: id }, { $unset: { refreshToken: 1 } });
  }

  res.status(200).json({ message: "Access" });
}
