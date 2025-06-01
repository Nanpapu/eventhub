import { Request, Response } from "express";
import { validationResult } from "express-validator";
import emailService from "../services/email.service";

/**
 * Controller xử lý các yêu cầu từ form liên hệ
 */
const contactController = {
  /**
   * Xử lý gửi email từ form liên hệ
   * @route POST /api/contact
   */
  sendContactEmail: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: "Dữ liệu không hợp lệ",
        });
      }

      const { name, email, category, categoryLabel, subject, message } =
        req.body;

      // Gọi service để gửi email
      const result = await emailService.sendContactEmail(
        name,
        email,
        category,
        categoryLabel || "Không xác định", // Sử dụng giá trị mặc định nếu không có
        subject,
        message
      );

      // Trả về kết quả
      const response: any = {
        success: true,
        message: result.message,
      };

      // Trong môi trường phát triển, trả về link xem trước email nếu có
      if (result.previewURL) {
        response.previewURL = result.previewURL;
      }

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Contact email error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Không thể gửi email. Vui lòng thử lại sau.",
      });
    }
  },
};

export default contactController;
