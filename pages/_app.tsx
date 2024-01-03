import dynamic from "next/dynamic";
import { RecoilRoot } from "recoil";
import { useGrid } from "../components/utils/responsive";
import { BsFillSunFill, BsFillMoonFill, BsArrowBarUp } from "react-icons/bs";
import { QueryCache, QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import "../asset/styles/main.scss";
import Error from "./error";

const AppLayout = dynamic(() => import("../components/layout/AppLayout"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const { reset } = useQueryErrorResetBoundary();
  const router = useRouter();

  // const [theme, setTheme] = useState(false);
  // const { isDesktop } = useGrid();
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

  const queryClient = new QueryClient();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => <Error reset={resetErrorBoundary} error={error} />}
    >
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>{PageRouter()}</RecoilRoot>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
export default MyApp;
