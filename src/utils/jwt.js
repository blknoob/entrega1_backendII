import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token inválido:", error.message);
    return null;
  }
};
