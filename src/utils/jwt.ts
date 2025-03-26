import jwt, { JwtPayload } from "jsonwebtoken";

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: "180d",
  }); // 30d = 30 días
  return token;
};
