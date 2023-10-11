import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;

// access Token 발급
const access = (id: string) => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: "10m",
    algorithm: "HS256",
  });
};

// refresh Token 발급
const refresh = (id: string) => {
  return jwt.sign({ id: id }, secret, {
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
      id: decoded.id,
      message: "Access",
    };
  } catch (error: any) {
    return {
      message: "Access Denied",
    };
  }
};

export { access, refresh, verify };
