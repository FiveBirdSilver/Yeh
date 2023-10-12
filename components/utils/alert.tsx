import { message } from "antd";

export const Alert = (type: string, content?: string) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: content,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "잠시 후 다시 시도해주세요",
    });
  };

  const switchAlert = () => {
    if (type === "success") return success;
    else if (type === "warning") return warning;
    else if (type === "error") return error;
  };

  return (
    <>
      {contextHolder}
      {switchAlert()}
    </>
  );
};
