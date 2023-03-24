import axios from "axios";

const setToken = async (props) => {
  // const cookie = props.cookie;
  // const setCookie = props.setCookie;
  console.log("*******시작*****************");

  const reset = props.reset;
  const router = props.router;

  const response = await axios({
    method: "get",
    url: "https://www.devyeh.com/api/user/token/refresh",
  });

  console.log("***********끝*************");
  if (response.data.success) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.data.access_token}`;
    return new Promise((resolve, reject) => {
      resolve("userLogin");
    });
  } else {
    alert("세션이 만료되었습니다. 다시 로그인 후 시도해 주세요");
    router.push("/user/signin");
    reset();
    return new Promise((resolve, reject) => {
      resolve("userLogout");
    });
  }
};

export default setToken;
