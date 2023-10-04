import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;

// access Token 발급
const access = (id: string) => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: "1h", // 유효기간
  });
};

// refresh Token 발급
const refresh = (id: string) => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: "14d", // 유효기간
  });
};

export { access, refresh };
