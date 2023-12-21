import axios from "axios";
import { IComments, IDeleteComments, IDeletePost, ILikes } from "../../interface/post";

axios.defaults.baseURL = "http://localhost:3000";

// 메인화면 전체 게시글 조회
const viewPosts = async (keyword: string, page?: number) => {
  const limit = 20;

  const result = await axios.get(`/api/post/view?keyword=${keyword}&page=${page}&limit=${limit}`);
  if (result.status === 200 && result.data.message === "OK") return result.data.data;
  else return null;
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
const writePost = async (data: FormData, params: string) => {
  const result = await axios.post("/api/post/write", data, {
    headers: {
      Authorization: params,
      "Content-Type": "multipart/form-data",
    },
  });
  if (result.status === 200) return result.data;
};

// 게시글 수정
const updatePost = async (data: FormData, params: string) => {
  const result = await axios.post("/api/post/update", data, {
    headers: {
      Authorization: params,
      "Content-Type": "multipart/form-data",
    },
  });
  if (result.status === 200) return result.data;
};

// 게시글 삭제
const dropPost = async (data: IDeletePost, params: string) => {
  const result = await axios.delete("/api/post/delete", {
    data,
    headers: {
      Authorization: params,
    },
  });
  if (result.status === 200) return result.data;
};

// 댓글 작성
const writeComments = async (data: IComments, params: string) => {
  const result = await axios.post("/api/post/comment", data, {
    headers: {
      Authorization: params,
    },
  });
  if (result.status === 200) return result.data;
};

// 댓글 삭제
const dropComments = async (data: IDeleteComments, params: string) => {
  const result = await axios.delete("/api/post/comment", {
    data,
    headers: {
      Authorization: params,
    },
  });
  if (result.status === 200) return result.data;
};

// 좋아요
const increaseLikes = async (data: ILikes, params: string) => {
  const result = await axios.post("/api/post/like", data, {
    headers: {
      Authorization: params,
    },
  });
  if (result.status === 200) return result.data;
};

export { viewPosts, writePost, updatePost, dropPost, detailPost, writeComments, dropComments, increaseLikes };
