import axios from "axios";
import { Post } from "../../interface/post";
axios.defaults.baseURL = "http://localhost:3000";

// 메인화면 전체 게시글 조회
const viewPosts = async () => {
  const result = await axios.get("/api/post/viewPosts");
  if (result.status === 200) return result.data;
};

// 게시글 작성
const writePost = async (data: FormData) => {
  for (let value of data.values()) {
    console.log(value);
  }
  const result = await axios.post("/api/post/writePost", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(result);
  if (result.status === 200) return result.data;
};

export { viewPosts, writePost };
