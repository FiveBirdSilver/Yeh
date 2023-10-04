import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import axios from "axios";

import logo from "../../public/static/logo.png";
import { userState } from "../../store/index";
import { LoggingType, SignInType } from "../../lib/interface/auth";
import { signIn } from "../../lib/apis/auth";

export default function Signiin() {
  const router = useRouter();
  const setLogging = useSetRecoilState<LoggingType>(userState);

  const formSchema = yup.object({
    id: yup.string().required(""),
    password: yup.string().required(""),
  });

  const { register, handleSubmit } = useForm<SignInType>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: SignInType) => {
    try {
      const response = await signIn(data);
      if (response.message === "Access") {
        setLogging({ nickname: response.data.nickname, id: response.data.id, logging: true });
        router.push("/main");
      } else if (response.message === "Access Denied") {
        alert("일치하는 계정정보가 없습니다.");
      }
    } catch (error) {
      alert("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.");
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in__title">
        <Image
          src={logo}
          alt="yehLogo"
          onClick={() => router.push("/main", undefined, { shallow: true })}
          style={{ cursor: "pointer" }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="sign-in__contents">
        <label htmlFor="id">아이디</label>
        <input id="id" type="text" {...register("id")} placeholder="아이디를 입력해주세요" autoComplete="off" />
        <label htmlFor="password">비밀번호</label>
        <input id="password" type="password" {...register("password")} placeholder="비밀번호를 입력해주세요" />
        <button type="submit" className="sign-in__button" style={{ marginTop: "50px" }}>
          로그인
        </button>
      </form>
      <div className="sign-in__button_etc">
        <button onClick={() => router.push({ pathname: "/user/userFind", query: { type: "id" } })}>아이디 찾기</button>
        <span>|</span>
        <button
          onClick={() =>
            router.push({
              pathname: "/user/userFind",
              query: { type: "password" },
            })
          }
        >
          비밀번호 찾기
        </button>
        <span>|</span>
        <button onClick={() => router.push("/user/signup")}>회원가입</button>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      path: "signin",
    },
  };
}
