import axios from "axios";
import { IComments, IDeleteComments, IDeletePost, IKeyword, ILikes } from "../../interface/post";
axios.defaults.baseURL = "http://localhost:3000";

// 메인화면 전체 게시글 조회
const viewPosts = async (data: any) => {
  const result = await axios.post("/api/post/view", data);
  if (result.status === 200) return result.data;
};

// 상세 게시글 조회
const detailPost = async (params: string) => {
  const result = await axios.get("/api/post/read", {
    params: {
      id: params,
    },
  });
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

// 게시글 수정
const updatePost = async (data: FormData) => {
  const result = await axios.post("/api/post/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (result.status === 200) return result.data;
};

// 게시글 삭제
const dropPost = async (data: IDeletePost) => {
  const result = await axios.delete("/api/post/delete", { data });
  if (result.status === 200) return result.data;
};

// 댓글 작성
const writeComments = async (data: IComments) => {
  const result = await axios.post("/api/post/comment", data);
  if (result.status === 200) return result.data;
};

// 댓글 삭제
const dropComments = async (data: IDeleteComments) => {
  const result = await axios.delete("/api/post/comment", { data });
  if (result.status === 200) return result.data;
};

// 좋아요
const increaseLikes = async (data: ILikes) => {
  const result = await axios.post("/api/post/like", data);
  if (result.status === 200) return result.data;
};

export { viewPosts, writePost, updatePost, dropPost, detailPost, writeComments, dropComments, increaseLikes };
