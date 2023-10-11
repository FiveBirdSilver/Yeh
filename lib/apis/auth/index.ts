import axios from "axios";
import { ISignUP, ISignIn } from "../../interface/auth";
axios.defaults.baseURL = "http://localhost:3000";

// 회원가입
const signUp = async (data: ISignUP) => {
  const result = await axios.post("/api/auth/signup", data);
  if (result.status === 200) return result.data;
};

// 로그인
const signIn = async (data: ISignIn) => {
  const result = await axios.post("/api/auth/signin", data);
  if (result.status === 200) return result.data;
};

// 로그아웃
const signOut = async () => {
  const result = await axios.get("/api/auth/signout");
  if (result.status === 200) return result.data;
};

// 토큰 재발급
const getToken = async () => {
  const result = await axios.get("/api/auth/getToken");
  if (result.status === 200) return result.data;
};

export { signUp, signIn, signOut, getToken };
