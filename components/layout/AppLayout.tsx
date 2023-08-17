import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { PropsWithChildren, useState } from "react";

import logo from "../../asset/images/logo.png";
import logoSmall from "../../asset/images/header_logo.png";
import { keywordState, userState } from "../../store/index";
import { useGrid } from "../utils/responsive";

const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>("");

  const [user, setUser] = useRecoilState(userState);
  const setKeywordState = useSetRecoilState(keywordState);

  const { isMobile, isDesktop } = useGrid();

  const logout = () => {
    setUser("");
    // removecookie("refresh_token");
  };

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
      setKeywordState(keyword);
    } else alert("검색어를 입력해주세요.");
  };

  const handleOnKeyDown = async (e: { code: string }) => {
    if (e.code === "Enter") {
      handleOnSubmit();
    }
  };

  // 로고 버튼 클릭 핸들러
  const handleOnInit = () => {
    router.push("/main", undefined, { shallow: true });
    setKeywordState(null);
    setKeyword("");
  };

  const DesktopUser = (
    <div className="header_signBtn">
      {user?.loggin ? (
        <Dropdown menu={{ items }} placement="bottom" className="header_more">
          <Button className="header_user">{user.name}</Button>
        </Dropdown>
      ) : (
        <div>
          <button onClick={() => router.push("/user/signin")} className="header_signin">
            로그인
          </button>
          <span style={{ color: "#2b3089" }}> | </span>
          <button onClick={() => router.push("/user/signup")} className="header_signin">
            회원가입
          </button>
        </div>
      )}
      <button onClick={() => router.push("/post/new")} className="header_write">
        글쓰기
      </button>
    </div>
  );

  return (
    <>
      <div className="header">
        <div className="header_wrap">
          <Image
            src={isMobile ? logoSmall : logo}
            alt="yehLogo"
            className={isMobile ? "heaeder_logo_small" : "heaeder_logo"}
            onClick={() => handleOnInit()}
          />
          <div className="header_search">
            <button onClick={() => handleOnSubmit()} className="font">
              <SearchOutlined
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
        {isDesktop && DesktopUser}
      </div>
      {children}
      {/* <AppFooter /> */}
    </>
  );
};
export default AppLayout;
