import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

import dbConnect from "../../../lib/db/connet";
import senderAuth from "../../../auth.json";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;

  dbConnect();
  const checkUser = await User.findOne({ email });

  if (checkUser.authCode === Number(code)) return res.status(200).json({ message: "Access" });
  else return res.status(200).json({ message: "Access Denied" });
}
