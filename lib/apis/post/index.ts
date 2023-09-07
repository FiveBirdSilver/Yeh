import axios from "axios";
import { Post } from "../../interface/post";
axios.defaults.baseURL = "http://localhost:3000";

// 메인화면 전체 게시글 조회
const viewPosts = async () => {
  const result = await axios.get("/api/post/view");
  if (result.status === 200) return result.data;
};

// 게시글 작성
const writePost = async (data: FormData) => {
  const result = await axios.post("/api/post/write", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (result.status === 200) return result.data;
};

// 상세 게시글 조회
const detailPost = async (params: string) => {
  const result = await axios.get("/api/post/read", { params: params });
  if (result.status === 200) return result.data;
};

export { viewPosts, writePost, detailPost };
