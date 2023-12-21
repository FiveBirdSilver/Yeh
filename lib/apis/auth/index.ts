import axios from "axios";
import { ISignUP, ISignIn, ISendEmail, ICode, IResetPw } from "../../interface/auth";
axios.defaults.baseURL = "http://localhost:3000";

// 회원가입
const signUp = async (data: ISignUP) => {
  const result = await axios.post("/api/auth/signup", data);
  return result.data;
};

// 로그인
const signIn = async (data: ISignIn) => {
  const result = await axios.post("/api/auth/signin", data);
  return result.data;
};

// 로그아웃
const signOut = async () => {
  const result = await axios.get("/api/auth/signout");
  return result.data;
};

// 토큰 재발급
const getToken = async () => {
  const result = await axios.get("/api/auth/getToken");
  return result.data;
};

// 인증용 이메일 전송
const sendEmail = async (data: ISendEmail) => {
  const result = await axios.post("/api/auth/sendEmail", data);
  return result.data;
};

// 인증 확인용 메일
const confirmCode = async (data: ICode) => {
  const result = await axios.post("/api/auth/confirmCode", data);
  return result.data;
};

// 인증 확인용 메일
const resetPw = async (data: IResetPw, params: string) => {
  const result = await axios.post("/api/auth/resetPw", data, {
    headers: {
      Authorization: params,
    },
  });
  return result.data;
};

export { signUp, signIn, signOut, getToken, sendEmail, confirmCode, resetPw };
