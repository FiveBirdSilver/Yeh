import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import Image from "next/image";

import logo from "../../public/static/logo.png";
import { signUp } from "../../lib/apis/auth";
import { ISignUP } from "../../lib/interface/auth";
import { toastAlert } from "../../components/utils/toastAlert";
import { AxiosError } from "axios";

export default function Signup() {
  const router = useRouter();

  // 회원가입 정보 유효성 검사 및 에러 메시지 출력
  const formSchema = yup.object({
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
  } = useForm<ISignUP>({ mode: "onChange", resolver: yupResolver(formSchema) });

  // 회원가입 정보 제출
  const onSubmit = async (data: ISignUP) => {
    try {
      const response = await signUp(data);
      const msg = response.message;
      if (msg === "OK") router.push("/user/signupComplete");
      else if (msg === "Duplication account") toastAlert({ status: 200, content: "이미 존재하는 계정입니다." });
      else if (msg === "Duplication nickname") toastAlert({ status: 200, content: "이미 사용중인 닉네임입니다." });
      else return;
    } catch (error) {
      const { response } = error as unknown as AxiosError;
      toastAlert({ status: response?.status });
    }
  };

  return (
    <>
      <div className="sign-up">
        <div className="sign-up__title">
          <Image src={logo} alt="yehLogo" onClick={() => router.push("/main")} />
          <span>조직문화의 개선과 소통을 위해 지금 시작해보세요</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up__contents">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            {...register("email")}
            autoComplete="off"
          />
          {errors.email && <p>{errors.email.message}</p>}
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
          <button type="submit" className="sign-up__button">
            가입하기
          </button>
        </form>
      </div>
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {
      path: "signup",
    },
  };
}
