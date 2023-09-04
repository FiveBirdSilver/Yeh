import { PropsWithChildren, useEffect } from "react";
import Aside from "./aside";
import Header from "./header";
import { useRouter } from "next/router";

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
        {pathRoute()}
        {children}
      </div>
      {/* <AppFooter /> */}
    </>
  );
};
export default AppLayout;
