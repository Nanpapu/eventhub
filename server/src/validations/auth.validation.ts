import { body } from "express-validator";

/**
 * Validation rules cho đăng ký
 */
export const registerValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("name").notEmpty().withMessage("Tên không được để trống").trim(),

  body("role")
    .optional()
    .isIn(["user", "organizer"])
    .withMessage("Vai trò không hợp lệ"),

  // Nếu role là "organizer", kiểm tra các trường bắt buộc
  body("organizationName")
    .if(body("role").equals("organizer"))
    .notEmpty()
    .withMessage("Tên tổ chức là bắt buộc")
    .trim(),

  body("organizationType")
    .if(body("role").equals("organizer"))
    .notEmpty()
    .withMessage("Loại tổ chức là bắt buộc")
    .trim(),

  body("phone")
    .if(body("role").equals("organizer"))
    .notEmpty()
    .withMessage("Số điện thoại là bắt buộc")
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại không hợp lệ")
    .trim(),

  body("description").optional().trim(),
];

/**
 * Validation rules cho đăng nhập
 */
export const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

/**
 * Validation rules cho quên mật khẩu
 */
export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
];

/**
 * Validation rules cho đặt lại mật khẩu
 */
export const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Token đặt lại mật khẩu không được để trống"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
];

/**
 * Validation rules cho đổi mật khẩu
 */
export const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại không được để trống"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
];

/**
 * Validation rules cho cập nhật profile
 */
export const updateProfileValidation = [
  body("name").optional().trim(),

  body("avatar").optional().trim(),

  body("bio").optional().trim(),
];
