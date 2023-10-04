import axios from "axios";
import { SignUpType, SignInType } from "../../interface/auth";
axios.defaults.baseURL = "http://localhost:3000";

// 회원가입
const signUp = async (data: SignUpType) => {
  const result = await axios.post("/api/auth/signup", data);
  if (result.status === 200) return result.data;
};

// 로그인
const signIn = async (data: SignInType) => {
  const result = await axios.post("/api/auth/signin", data);
  if (result.status === 200) return result.data;
};

export { signUp, signIn };
