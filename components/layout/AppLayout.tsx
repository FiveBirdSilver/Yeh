import { PropsWithChildren, useEffect } from "react";
import Aside from "./aside";
import Header from "./header";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();

  const pathRoute = () => {
    const tmpArr = router.pathname.split("/");
    if ((tmpArr.length === 2 && tmpArr[1] === "main") || (tmpArr.length === 3 && tmpArr[2] === "read"))
      return <Aside />;
  };

  return (
    <>
      <Header />
      <div className="section">
        <title>YEH</title>
        <ToastContainer limit={1} style={{ fontSize: 12 }} />
        {children}
        {pathRoute()}
      </div>
    </>
  );
};
export default AppLayout;
