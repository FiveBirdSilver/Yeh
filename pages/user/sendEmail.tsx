import { useRouter } from "next/router";
import { useState } from "react";
import { sendEmail } from "../../lib/apis/auth";

export default function UserFind() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const [sendComplete, setSendComplete] = useState<boolean>(false);

  const handleOnSend = async () => {
    const data = {
      email: email,
    };
    try {
      const res = await sendEmail(data);
      console.log(res);
      // setSendComplete(true);
      // alert(`가입한 이메일 주소로 인증번호가 전송되었습니다.`);
      // router.push("/main");
    } catch (err) {
      console.log(err);
      alert("잠시 후 다시 시도해 주세요.");
    }
  };

  const handleonSendKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleOnSend();
  };

  const handleOnSubmit = async () => {
    const data = {
      code: code,
    };
  };

  return (
    <div className="email-find">
      <div className="email-find__container">
        <span>가입한 이메일 주소를 입력해주세요.</span>
        <div className="email-find__wrapper">
          <input
            type="text"
            name="email"
            placeholder="example@goldenplanet.co.kr"
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={(e) => handleonSendKeyUp(e)}
            disabled={sendComplete}
          />
          <button
            onClick={handleOnSend}
            disabled={sendComplete}
            className={!sendComplete ? "sendComplete__buttton" : "sendComplete__buttton not"}
          >
            인증 메일 보내기
          </button>
        </div>
        {sendComplete && (
          <div className="email-find__wrapper">
            <input
              type="text"
              name="code"
              placeholder="인증코드 6자리를 입력해주세요"
              onChange={(e) => setCode(e.target.value)}
              onKeyUp={(e) => (e.key === "Enter" ? handleOnSubmit() : null)}
            />
            <button onClick={handleOnSubmit} className="sendComplete__buttton">
              인증 확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
