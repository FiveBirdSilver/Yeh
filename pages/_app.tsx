import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import RecoilNexus from "recoil-nexus";
import { RecoilRoot } from "recoil";
import { useGrid } from "../components/utils/responsive";
import { BsFillSunFill, BsFillMoonFill, BsArrowBarUp } from "react-icons/bs";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";

import "react-toastify/dist/ReactToastify.css";
import "../asset/styles/main.scss";
import "tailwindcss/tailwind.css";
import { AxiosError } from "axios";
import { toastAlert } from "../components/utils/toastAlert";
import { useRouter } from "next/router";

const AppLayout = dynamic(() => import("../components/layout/appLayout"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  // const [theme, setTheme] = useState(false);
  // const { isDesktop } = useGrid();
  const router = useRouter();
  // const handleThemeToggle = () => {
  //   setTheme((prev) => !prev);
  // };

  // const handleOnTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  function PageRouter() {
    const pages = pageProps.path;
    switch (pages) {
      case "signin":
      case "signup":
      case "forbidden":
        return <Component {...pageProps} />;
      default:
        return (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        );
    }
  }

  // const SideBtn = (
  //   <div className="side_btns_container">
  //     <button onClick={() => handleOnTop()} className="side_btns">
  //       <BsArrowBarUp className="side_btns_icons" />
  //     </button>
  //     <button onClick={() => handleThemeToggle()} className="side_btns">
  //       {!theme ? <BsFillMoonFill className="side_btns_icons" /> : <BsFillSunFill className="side_btns_icons" />}
  //     </button>
  //   </div>
  // );

  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       onError: (error) => {
  //         if (error instanceof AxiosError) {
  //           toastAlert({ status: error?.status });
  //         }
  //       },
  //       retry: 0, // 0으로 설정해도 기본적으로 3번 재시도
  //       // suspense: true,
  //     },
  //   },
  // });
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => toastAlert({ status: 400 }),
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>YEH</title>
      </Head>
      <RecoilRoot>
        <RecoilNexus />
        {PageRouter()}
        <ToastContainer limit={1} style={{ fontSize: 12 }} />
        {/* {isDesktop && SideBtn} */}
      </RecoilRoot>
    </QueryClientProvider>
  );
}
export default MyApp;
