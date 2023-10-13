import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { confirmCode, sendEmail } from "../../lib/apis/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ISendEmail } from "../../lib/interface/auth";

export default function UserFind() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [sendComplete, setSendComplete] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(3);
  const [seconds, setSeconds] = useState<number>(0);

  const formSchema = yup.object({
    email: yup.string().required("").email("이메일 형식이 아닙니다."),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ISendEmail>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      if (sendComplete && seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
        } else {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    // 컴포넌트가 언마운트되면 clearInterval로 타이머를 정리합니다.
    return () => {
      clearInterval(countdown);
    };
  }, [sendComplete, minutes, seconds]);

  const handleOnSend = async (data: ISendEmail) => {
    try {
      const res = await sendEmail(data);
      if (res.message === "Access Denied") {
        alert(`등록된 이메일 주소가 아닙니다.`);
        return;
      } else {
        alert(`가입한 이메일 주소로 인증번호가 전송되었습니다.`);
        setSendComplete(true);
      }
    } catch (err) {
      console.log(err);
      alert("잠시 후 다시 시도해 주세요.");
    }
  };

  const handleOnSubmit = async () => {
    const data = {
      email: email,
      code: code,
    };
    try {
      const res = await confirmCode(data);
      if (res.message === "Access Denied") {
        alert(`인증 번호가 일치하지 않습니다.`);
        return;
      } else {
        console.log("success");
      }
    } catch (err) {
      console.log(err);
      alert("잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="email-find">
      <div className="email-find__container">
        <span>가입한 이메일 주소를 입력해주세요.</span>
        <form onSubmit={handleSubmit(handleOnSend)} className="email-find__wrapper">
          <input
            type="text"
            placeholder="example@gmail.com"
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sendComplete}
          />
          {errors.email && <p className="email-find__error">{errors.email.message}</p>}
          <button
            type="submit"
            disabled={sendComplete}
            className={!sendComplete ? "sendComplete__buttton" : "sendComplete__buttton not"}
          >
            인증 메일 보내기
          </button>
        </form>
        {sendComplete && (
          <div className="email-find__wrapper">
            <input
              type="text"
              name="code"
              placeholder="인증코드 6자리를 입력해주세요"
              onChange={(e) => setCode(e.target.value)}
              onKeyUp={(e) => (e.key === "Enter" ? handleOnSubmit() : null)}
            />
            <p className="sendComplete__count">
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </p>
            <button onClick={handleOnSubmit} className="sendComplete__buttton">
              인증 확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
