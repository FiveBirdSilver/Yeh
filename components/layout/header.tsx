import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Dropdown, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";

import logo from "../../public/static/logo.png";
import { keywordState } from "../../store/index";
import { getToken, signOut } from "../../lib/apis/auth";
import { useQuery } from "react-query";
import { IConfirm } from "../../lib/interface/auth";
import { AxiosError } from "axios";
import { toastAlert } from "../utils/toastAlert";

export default function Header() {
  const router = useRouter();
  const uid = Cookies.get("uid") as string;
  const setKeywordState = useSetRecoilState<string>(keywordState);

  const [keyword, setKeyword] = useState<string>("");
  const [user, setUser] = useState<string | null>("");

  useEffect(() => {
    setUser(uid);
  }, [uid]);

  // 로그 아웃
  const logout = async () => {
    try {
      const response = await signOut();
      if (response.message === "Access") setUser(null);
    } catch (error) {
      const { response } = error as unknown as AxiosError;
      toastAlert({ status: response?.status });
    }
  };

  // 토큰 재발급 함수
  // useQuery<IConfirm>(
  //   ["token"],
  //   async () => {
  //     const token = await getToken();
  //     return token;
  //   },
  //   {
  //     enabled: uid !== undefined,
  //     staleTime: 600000, // 10분에 한 번씩 요청
  //     useErrorBoundary: true,
  //     retry: 0,
  //   }
  // );

  const items = [
    {
      key: "1",
      label: <a onClick={() => logout()}>로그아웃</a>,
    },
  ];

  const handleOnSubmit = () => {
    if (keyword !== "") {
      router.push("/main", undefined, { shallow: true });
      setKeywordState(keyword);
    }
  };

  const handleOnKeyDown = async (e: { code: string }) => {
    if (e.code === "Enter") {
      handleOnSubmit();
    }
  };

  // 로고 버튼 클릭 핸들러
  const handleOnInit = () => {
    router.push("/main", undefined, { shallow: true });
    setKeywordState("");
    setKeyword("");
  };

  return (
    <div className="header">
      <div className="header-wrap">
        <Image src={logo} alt="yehLogo" className="header-logo" onClick={() => handleOnInit()} />
        <div className="header-search">
          <button onClick={() => handleOnSubmit()} className="font">
            <SearchOutlined
              className="header-search__icon"
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            />
          </button>
          <input
            placeholder="관심있는 내용을 검색해보세요"
            className="header_input"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => handleOnKeyDown(e)}
            value={keyword || ""}
          />
        </div>
      </div>
      <div className="header__buttons">
        {user ? (
          <Dropdown menu={{ items }} placement="bottom" className="user-dropdown">
            <Button className="user__button">{user}</Button>
          </Dropdown>
        ) : (
          <div className="flex gap-3 pr-2">
            <button onClick={() => router.push("/user/signin")} className="notuser__buttons">
              로그인
            </button>
            <span style={{ color: "#2b3089" }}> | </span>
            <button onClick={() => router.push("/user/signup")} className="notuser__buttons">
              회원가입
            </button>
          </div>
        )}
        <button
          onClick={() => (user ? router.push("/post/write") : router.push("/user/signin"))}
          className="write__button"
        >
          글쓰기
        </button>
      </div>
    </div>
  );
}
