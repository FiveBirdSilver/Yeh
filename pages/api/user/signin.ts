import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, password } = req.body;

    dbConnect();

    const checkUser = await User.find({ userId: id });

    if (await bcrypt.compare(password, checkUser[0]?.password)) {
      res.status(200).json({ message: "Access", data: { nickname: checkUser[0]?.nickname, id: checkUser[0]?._id } });
    } else res.status(200).json("Access Denied");
  }
}
