import { useRouter } from "next/router";
import { BsCheck2Circle } from "react-icons/bs";

export default function SignupComplete() {
  const router = useRouter();
  return (
    <>
      <div className="sign-complete">
        <div className="sign-complete__container">
          <BsCheck2Circle className="icon" />
          <h1>회원가입이 완료 되었습니다.</h1>
          <span>
            YEH의 회원이 되신 것을 환영합니다. <br />
            모든 기능 사용을 위해 로그인 후 이용해주세요.
          </span>
          <button onClick={() => router.push("/user/signin")}>로그인</button>
        </div>
      </div>
    </>
  );
}
