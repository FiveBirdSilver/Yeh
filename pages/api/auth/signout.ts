import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  dbConnect();

  res.setHeader("Set-Cookie", `accessToken=; Path=/; Expires=${new Date(Date.now() - 1).toUTCString()}; HttpOnly`);

  const checkUser = await User.find({ userId: id });
  // if (refreshToken) {
  //   await User.deleteOne()
  //   res.status(200).json({ message: "Access" });
  // }
}
