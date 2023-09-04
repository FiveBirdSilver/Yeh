import axios from "axios";
import { UserType } from "../../interface/user";
axios.defaults.baseURL = "http://localhost:3000";

// 회원가입
const signUp = async (data: UserType) => {
  const result = await axios.post("/api/user", data);
  if (result.status === 200) return result.data;
};

export { signUp };
