"use client";

import React from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

export default function Error({ error, reset }: { error?: AxiosError; reset: () => void }) {
  const router = useRouter();
  
  return (
    <div className="forbidden">
         <div className="forbidden_container">
      <h2>서비스에 접속할 수 없습니다</h2>
      <span>
        일시적인 네트워크 오류로 접속할 수 없습니다.
        <br />
        잠시 후 다시 시도해주세요.
      </span>
      <div className="forbidden_container_btns">
        <button onClick={() => reset()}>다시 시도</button>
        <button onClick={() => router.push("/main")}>홈으로</button>
      </div>
    </div>
    </div>
  );
}
