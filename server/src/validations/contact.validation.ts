import { body } from "express-validator";

/**
 * Validation cho yêu cầu gửi email liên hệ
 */
export const validateContactEmail = [
  body("name")
    .notEmpty()
    .withMessage("Vui lòng nhập tên của bạn")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên phải có từ 2-100 ký tự"),

  body("email")
    .notEmpty()
    .withMessage("Vui lòng nhập địa chỉ email")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("category").notEmpty().withMessage("Vui lòng chọn loại vấn đề").trim(),

  body("subject")
    .notEmpty()
    .withMessage("Vui lòng nhập tiêu đề")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Tiêu đề phải có từ 2-200 ký tự"),

  body("message")
    .notEmpty()
    .withMessage("Vui lòng nhập nội dung tin nhắn")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Nội dung phải có từ 10-5000 ký tự"),
];
