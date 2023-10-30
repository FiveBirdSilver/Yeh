import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IResetPw } from "../../lib/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPw } from "../../lib/apis/auth";

export default function RestPW(props: { cookies: string }) {
  const router = useRouter();
  const cookie = props.cookies;

  // 회원가입 정보 유효성 검사 및 에러 메시지 출력
  const formSchema = yup.object({
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
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IResetPw>({ mode: "onChange", resolver: yupResolver(formSchema) });

  const onSubmit = async (data: IResetPw) => {
    try {
      const res = await resetPw(data, cookie);
      if (res === "Access Denied") {
        alert("유효시간이 지났습니다. 다시 시도해주세요.");
        router.push("/user/sendEmail");
      } else {
        alert("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");
        router.push("/user/signin");
      }
    } catch (err) {
      console.log(err);
      alert("잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <form className="resetPw" onSubmit={handleSubmit(onSubmit)}>
      <div className="resetPw__container">
        <label htmlFor="password">새 비밀번호</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="비밀번호를 입력해주세요 (8 ~ 20자의 영문, 숫자, 특수문자 조합)"
        />
        {errors.password && <p className="reset-error">{errors.password.message}</p>}
      </div>
      <div className="resetPw__container">
        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="비밀번호를 한 번 더 입력해주세요"
        />
        {errors.confirmPassword && <p className="reset-error">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" className="myinfo_btns">
        수정
      </button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.cookies?.accessToken || "";
  return {
    props: {
      cookies: cookies,
    },
  };
};
