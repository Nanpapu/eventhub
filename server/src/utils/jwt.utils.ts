import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Lấy JWT secret từ biến môi trường
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Tạo JWT token với payload
 * @param payload Dữ liệu để mã hóa vào token
 * @returns JWT token
 */
export const generateToken = (payload: Record<string, any>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Xác thực và giải mã JWT token
 * @param token JWT token cần xác thực
 * @returns Payload đã giải mã hoặc null nếu token không hợp lệ
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
