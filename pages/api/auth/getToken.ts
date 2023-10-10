import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import User from "../../../lib/db/model/auth";
import { access, verify } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.cookie?.split("=")[1] || "";
  if (verify(token).message === "Access Denied") {
    res.status(200).json(verify(token).message);
  } else {
    const id = verify(token).id;
    const accessToken = access(id);

    res.setHeader(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; Expires=${new Date(Date.now() + 60 * 1000 * 10).toUTCString()}; HttpOnly`
    );
    res.status(200).json({ message: "Access" });
  }
}
