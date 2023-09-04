import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import axios from "axios";

import logo from "../../public/logo.png";
import { userState } from "../../store/index";

interface UserType {
  username: string;
  password: string;
}

export default function Signiin() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

  const formSchema = yup.object({
    username: yup.string().required(""),
    password: yup.string().required(""),
  });

  const { register, handleSubmit } = useForm<UserType>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: UserType) => {
    const formData = new FormData();
    // formData.append("username", data.username);
    // formData.append("password", data.password);

    // try {
    //   const res = await login(formData);
    //   if (res.data.success === true) {
    //     const response = res.data.data;
    //     const accessToken = response.access_token;
    //     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    //     setUser({
    //       name: response.nickname,
    //       loggin: true,
    //       emailAuth: response.emailVerified,
    //     });
    //     setPage(1);
    //     router.push("/main");
    //   } else {
    //     alert(res.data.error.message);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   alert("잠시 후 다시 시도해주세요.");
    // }
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
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          type="text"
          {...register("username")}
          placeholder="아이디를 입력해주세요"
          autoComplete="off"
        />
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
