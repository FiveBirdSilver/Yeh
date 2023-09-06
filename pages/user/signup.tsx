import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import Image from "next/image";

import logo from "../../public/static/logo.png";
import { signUp } from "../../lib/apis/user";
import { SignUpType } from "../../lib/interface/user";
import { AxiosError } from "axios";

export default function Signup() {
  const router = useRouter();

  // 회원가입 정보 유효성 검사 및 에러 메시지 출력
  const formSchema = yup.object({
    id: yup.string().required("아이디는 필수 입력 정보입니다"),
    email: yup.string().required("이메일은 필수 입력 정보입니다 입력해주세요").email("이메일 형식이 아닙니다."),
    password: yup
      .string()
      .required("영문, 숫자, 특수문자 포함 8자리를 입력해주세요.")
      .min(8, "최소 8자 이상 가능합니다")
      .max(16, "최대 20자 까지만 가능합니다")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[,./;'<>?:"~!@#$%^&*()])[a-zA-Z0-9,./;'<>?:"~!@#$%^&*()]{8,20}$/,
        "영문, 숫자, 특수문자 포함 8자리를 입력해주세요."
      ),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다"),
    nickname: yup.string().required("닉네임은 필수 입력 정보입니다"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpType>({ mode: "onChange", resolver: yupResolver(formSchema) });

  // 회원가입 정보 제출
  const onSubmit = async (data: SignUpType) => {
    try {
      const response = await signUp(data);
      if (response === "OK") {
        router.push("/user/signupComplete");
      }
    } catch (error) {
      const { response } = error as unknown as AxiosError;
      if (response?.data === "Duplication") {
        alert("이미 존재하는 계정입니다.");
      } else alert("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.");
    }
  };

  return (
    <div className="sign-up">
      <div className="sign-up__title">
        <Image src={logo} alt="yehLogo" onClick={() => router.push("/main")} />
        <span>조직문화의 개선과 소통을 위해 지금 시작해보세요</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="sign-up__contents">
        <label htmlFor="id">아이디</label>
        <input id="id" type="text" {...register("id")} placeholder="아이디를 입력해주세요" autoComplete="off" />
        {errors.id && <p>{errors.id.message}</p>}
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="비밀번호를 입력해주세요 (8 ~ 20자의 영문, 숫자, 특수문자 조합)"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="비밀번호를 한 번 더 입력해주세요"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          {...register("nickname")}
          placeholder="닉네임을 입력해주세요"
          autoComplete="off"
        />
        {errors.nickname && <p>{errors.nickname.message}</p>}
        <label htmlFor="email">이메일</label>
        <input id="email" type="email" placeholder="이메일을 입력해주세요" {...register("email")} autoComplete="off" />
        {errors.email && <p>{errors.email.message}</p>}
        <button type="submit" className="sign-up__button">
          가입하기
        </button>
      </form>
    </div>
  );
}
export async function getStaticProps() {
  return {
    props: {
      path: "signup",
    },
  };
}
