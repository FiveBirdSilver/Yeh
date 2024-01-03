import { useRouter } from "next/router";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function Custome404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="mx-0 my-auto text-center">
        <ExclamationCircleOutlined className="text-7xl text-mainColor" />
        <h2 className="my-10 text-4xl font-bold">페이지를 찾을 수 없습니다</h2>
        <span>
          입력한 주소가 잘못되었거나,
          <br />
          사용이 일시 중단되어 요청하신 페이지를 찾을 수 없습니다.
          <br />
          입력하신 주소가 정확한지 다시 한 번 확인해 주시길 바랍니다.
        </span>
        <div className="flex justify-center w-full gap-10 my-10">
          <button
            onClick={() => router.push("/main")}
            className="w-24 h-10 font-bold text-white rounded cursor-pointer bg-mainColor"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
