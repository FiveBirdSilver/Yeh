import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db/connet";
import Post from "../../../lib/db/model/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();
  const { keyword, page, limit } = req.query;

  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;

  // 검색 쿼리 조건
  const searchQuery = {
    $or: [{ title: { $regex: keyword || "", $options: "i" } }, { content: { $regex: keyword || "", $options: "i" } }],
  };

  // 페이징 처리를 위해 게시글 개수와 페이지 정보 계산
  const totalPosts = await Post.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalPosts / perPage);

  // 페이지 번호가 범위를 벗어나는 경우 처리
  if (currentPage < 1 || currentPage > totalPages) {
    return res.status(200).json({ message: "noData" });
  }

  // 게시글 조회 및 페이징 처리₩`
  const skip = (currentPage - 1) * perPage;
  const result = await Post.find(searchQuery).sort({ createTime: -1 }).skip(skip).limit(perPage);

  return res.status(200).json({ message: "OK", data: result });
}
