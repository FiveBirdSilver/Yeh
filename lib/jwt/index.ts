import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;

// access Token 발급
const access = (email: string) => {
  return jwt.sign({ email }, secret, {
    expiresIn: "10m",
    algorithm: "HS256",
  });
};

// refresh Token 발급
const refresh = (email: string) => {
  return jwt.sign({ email }, secret, {
    expiresIn: "14d",
    algorithm: "HS256",
  });
};

// access Token 검증
const verify = (token: string) => {
  let decoded: any = null;
  try {
    decoded = jwt.verify(token, secret);
    return {
      email: decoded.email,
      message: "Access",
    };
  } catch (error: any) {
    return {
      message: "Access Denied",
    };
  }
};

export { access, refresh, verify };
