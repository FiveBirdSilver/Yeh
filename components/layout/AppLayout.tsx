import { PropsWithChildren } from "react";
import Rank from "../../pages/post/rank";
import Header from "./header";

const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <>
      <Header />
      <div className="section">
        <Rank />
        {children}
      </div>
      {/* <AppFooter /> */}
    </>
  );
};
export default AppLayout;
