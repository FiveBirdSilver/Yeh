import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Dropdown, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSetRecoilState } from "recoil";
import { useState } from "react";

import logo from "../../public/static/logo.png";
import { keywordState } from "../../store/index";
import { getToken, signOut } from "../../lib/apis/auth";
import { useQuery } from "react-query";
import { IConfirm } from "../../lib/interface/auth";
import { Alert } from "../utils/alert";

export default function Header() {
  const router = useRouter();
  const uid = Cookies.get("uid") as string;

  const [keyword, setKeyword] = useState<string>("");
  const setKeywordState = useSetRecoilState(keywordState);

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.log(err);
      alert("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.");
    }
  };

  useQuery<IConfirm>(
    ["token", uid],
    async () => {
      const token = await getToken();
      return token;
    },
    {
      staleTime: 600000, // 10분에 한 번씩 요청
      onSuccess: (res) => {
        if (res?.message === "Access Denied") {
          router.push("/user/signin");
          alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
          logout();
        }
      },
      onError: (err) => {
        console.log(err);
        Alert("잠시 후 다시 시도해주세요.");
      },
    }
  );

  const items = [
    {
      key: "1",
      label: <a onClick={() => router.push("/user/myPost")}>마이페이지</a>,
    },
    {
      key: "2",
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
        {uid ? (
          <Dropdown menu={{ items }} placement="bottom" className="user-dropdown">
            <Button className="user__button">{uid}</Button>
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
        <button onClick={() => router.push("/post/write")} className="write__button">
          글쓰기
        </button>
      </div>
    </div>
  );
}
