import { body } from "express-validator";

/**
 * Validation rules cho đăng ký
 */
export const registerValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("firstName").notEmpty().withMessage("Tên không được để trống").trim(),

  body("lastName").notEmpty().withMessage("Họ không được để trống").trim(),
];

/**
 * Validation rules cho đăng nhập
 */
export const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];
