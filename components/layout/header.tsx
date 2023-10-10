import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useState } from "react";

import logo from "../../public/static/logo.png";
import { keywordState, userState } from "../../store/index";
import { getToken, signOut } from "../../lib/apis/auth";
import { useQuery } from "react-query";

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>("");

  const [user, setUser] = useRecoilState(userState);
  const setKeywordState = useSetRecoilState(keywordState);

  // console.log("Expiration", Expiration);

  const logout = async () => {
    const res = await signOut();
    try {
      if (res.message === "Access") {
        setUser({ nickname: "", id: "", logging: false });
      }
    } catch (e) {
      console.log(e);
      alert("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.");
    }
  };

  useQuery(["token", router], async () => await getToken(), {
    // refetchInterval: 60 * 1000 * 10 - 1000,
    refetchInterval: 10000,
    refetchOnMount: true,
    onSuccess: (data) => {
      console.log(data);
      if (data === "Access Denied") logout();
    },
  });

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
      setKeywordState({ keyword: keyword });
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
    setKeywordState({ keyword: "" });
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
        {user?.logging ? (
          <Dropdown menu={{ items }} placement="bottom" className="user-dropdown">
            <Button className="user__button">{user.nickname}</Button>
          </Dropdown>
        ) : (
          <div>
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
