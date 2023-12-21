import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import * as yup from "yup";
import Image from "next/image";

import logo from "../../public/static/logo.png";
import { ISignIn } from "../../lib/interface/auth";
import { signIn } from "../../lib/apis/auth";
import { Alert } from "../../components/utils/alert";

export default function Signiin() {
  const router = useRouter();

  const formSchema = yup.object({
    email: yup.string().required("").email("이메일 형식이 아닙니다."),
    password: yup.string().required(""),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ISignIn>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: ISignIn) => {
    try {
      const response = await signIn(data);
      if (response.message === "Access") {
        router.push("/main");
      } else alert("일치하는 계정정보가 없습니다.");
    } catch (error) {
      console.log(error);
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
        <label htmlFor="email">이메일</label>
        <input id="email" type="email" {...register("email")} placeholder="이메일을 입력해주세요" autoComplete="off" />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="password">비밀번호</label>
        <input id="password" type="password" {...register("password")} placeholder="비밀번호를 입력해주세요" />
        <button type="submit" className="sign-in__button" style={{ marginTop: "50px" }}>
          로그인
        </button>
      </form>
      <div className="sign-in__button_etc">
        <button onClick={() => router.push("/user/sendEmail")}>비밀번호 재설정</button>
        <span>|</span>
        <button onClick={() => router.push("/user/signup")}>간편 회원가입</button>
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
