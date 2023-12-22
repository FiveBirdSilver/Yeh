import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization!;
  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const { password } = req.body;
    const email = verify(token).email;
    dbConnect();

    await User.updateOne({ email }, { password: await bcrypt.hash(password, 12) });
    return res.status(200).json({ message: "Access" });
  }
}
