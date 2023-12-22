import { useRouter } from "next/router";
import { ToastOptions, toast } from "react-toastify";

interface ItoastAlert {
  status: number | undefined;
  content?: string;
}
export const toastAlert = (props: ItoastAlert) => {
  const { status, content } = props;

  const option: ToastOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 2000,
  };

  const authOption: ToastOptions = {
    ...option,
    onClose: () => (window.location.href = "/user/signin"),
    onClick: () => (window.location.href = "/user/signin"),
  };

  const errorOption: ToastOptions = {
    ...option,
    onClose: () => (window.location.href = "/forbidden"),
    onClick: () => (window.location.href = "/forbidden"),
  };

  switch (status) {
    case 200: {
      return toast.info(content, option);
    }
    case 401: {
      return toast.error(content ? content : "권한이 없습니다. 로그인 후 이용해주세요.", authOption);
    }
    case 400:
    case 404:
    case 500: {
      return toast.error(content ? content : "서비스에 접속할 수 없습니다.", errorOption);
    }
    default: {
      return toast.error(content ? content : "잠시 후 다시 시도해 주세요.", errorOption);
    }
  }
};
