import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
// 메인화면 전체 게시글 조회
const getPostAll = async () => {
  const result = await axios.get("/api/post");
  if (result.status === 200) return result.data;
};

export { getPostAll };
