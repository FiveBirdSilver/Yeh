"use client";

import React from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function Error({ error, reset }: { error?: AxiosError; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center h-full">
      <div className="mx-0 my-auto text-center">
        <ExclamationCircleOutlined className="text-7xl text-mainColor" />
        <h2 className="my-10 text-4xl font-bold">서비스에 접속할 수 없습니다</h2>
        <span>
          일시적인 네트워크 오류로 접속할 수 없습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </span>
        <div className="flex justify-center w-full gap-10 my-10">
          <button
            onClick={() => reset()}
            className="w-24 h-10 font-bold border rounded cursor-pointer border-mainColor text-mainColor"
          >
            다시 시도
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-24 h-10 font-bold text-white rounded cursor-pointer bg-mainColor"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
