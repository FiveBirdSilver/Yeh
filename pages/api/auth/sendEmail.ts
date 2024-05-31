import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  dbConnect();
  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.status(200).json({ message: "Access Denied" });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "tpdms0401@gmail.com",
      pass: process.env.NEXT_PUBLIC_PASSWORD,
    },
  });

  const authCode = Math.floor(Math.random() * 1000000); //랜덤 번호 생성
  await User.updateOne({ email }, { authCode }); // DB에 코드 업데이트

  const deleteCode = async () => {
    await User.updateOne({ email }, { $unset: { authCode: 1 } });
  };

  setTimeout(deleteCode, 60 * 1000 * 3); // 코드 유효시간 3분 후 삭제

  const mailData = {
    to: email,
    subject: `[YEH] 이메일 인증`,
    from: process.env.AUTH_USER,
    html: `<div>
    <h4><b>인증 코드</b> 안내입니다</h4>
    <span>안녕하세요.<br/>
    비밀번호 재설정을 위한 인증 코드를  발급하였습니다.
    아래의 인증코드를 입력하여 주십시오.</span>
    </br></br></br></br></br></br>
    <h4>${authCode}</h4>
    <span>* 인증번호의 유효시간은 3분입니다.</span></div>
    `,
  };

  await transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return res.status(400);
    } else {
      return res.status(200).json({ message: "Access" });
    }
  });
}
