import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import senderAuth from "../../../auth.json";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.status(200).json({ message: "Access Denied" });
  }

  const authNum = Math.floor(Math.random() * 1000000); //랜덤 번호

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: senderAuth,
  });

  const mailData = {
    to: email,
    subject: `[YEH] 인증 확인`,
    from: process.env.AUTH_USER,
    html: `
    <h1>인증 코드</h1>
    <div>${authNum}</div>
    </br>
    `,
  };

  await transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(400);
    } else {
      return res.status(200).json({ message: "Access" });
    }
  });
}
