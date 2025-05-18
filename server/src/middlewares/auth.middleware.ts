import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/User";

// Mở rộng interface Request để bổ sung user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware kiểm tra người dùng đã xác thực chưa
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    // Lấy token từ header
    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // Tìm user từ id trong token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy người dùng với token này",
      });
    }

    // Gán user vào request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

/**
 * Middleware kiểm tra người dùng có quyền admin không
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập, yêu cầu quyền admin",
    });
  }
};
