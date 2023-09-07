import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db/connet";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, { params }: { params: string }, res: NextApiResponse) {
  console.log(params);
  if (req.method === "GET") {
    // const { id, password } = req.body;
    // const client = await clientPromise;
    // const db = client.db("yeh");
    // const collection = await db.collection("user");
    // const isUser = await collection.findOne({ id });
    // if (await bcrypt.compare(password, isUser?.password)) {
    //   res.status(200).json({ message: "Access", data: { nickname: isUser?.nickname, id: isUser?._id } });
    // } else res.status(200).json("Access Denied");
    // client.close();
  }
}
