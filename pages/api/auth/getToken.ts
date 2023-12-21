import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie?.split(";");
  if (cookie) {
    const token = cookie[1].replace(" accessToken=", "").replace(/'/g, "");
    if (verify(token).message === "Access Denied") {
      res.status(401).json({ message: verify(token).message });
    } else {
      const email = verify(token).email;
      const checkUser = await User.findOne({ email });
      const accessToken = access(email);
      const expired = new Date(Date.now() + 60 * 1000 * 10);

      res.setHeader("Set-Cookie", [
        `uid=${encodeURI(checkUser.nickname)};Path=/;Expires=${expired.toUTCString()};`,
        `accessToken=${accessToken}; Path=/; Expires=${expired.toUTCString()}; HttpOnly`,
      ]);

      res.status(200).json({ message: "Access" });
    }
  } else res.status(401).json({ message: "Access Denied" });
}
