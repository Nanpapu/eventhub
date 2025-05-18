import nodemailer from "nodemailer";
import config from "../config";

/**
 * Cấu hình transporter cho Nodemailer
 * Trong môi trường phát triển, chúng ta sử dụng Ethereal để giả lập email
 * Trong môi trường production, nên thay thế bằng dịch vụ SMTP thực tế
 */
const createTransporter = async () => {
  // Tạo tài khoản test với Ethereal (chỉ cho môi trường phát triển)
  const testAccount = await nodemailer.createTestAccount();

  // Tạo transporter với Ethereal
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return {
    transporter,
    previewUrl: nodemailer.getTestMessageUrl,
    testAccount,
  };
};

/**
 * Dịch vụ gửi email
 */
const emailService = {
  /**
   * Gửi email đặt lại mật khẩu
   * @param email Email người nhận
   * @param resetToken Token đặt lại mật khẩu
   * @param resetLink Link đặt lại mật khẩu đầy đủ
   */
  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const { transporter, previewUrl, testAccount } =
        await createTransporter();

      // Tạo link đặt lại mật khẩu
      // Thay CLIENT_URL bằng URL thực tế của client từ config
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const resetLink = `${clientUrl}/auth/reset-password?token=${resetToken}`;

      // Nội dung email
      const mailOptions = {
        from: `"EventHub" <${testAccount.user}>`,
        to: email,
        subject: "Đặt lại mật khẩu của bạn",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #008080; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">EventHub</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Đặt lại mật khẩu của bạn</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #008080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc sao chép liên kết này vào trình duyệt của bạn:</p>
              <p style="word-break: break-all;">${resetLink}</p>
              <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không bị thay đổi.</p>
              <hr style="margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </div>
        `,
      };

      // Gửi email
      const info = await transporter.sendMail(mailOptions);

      // Tạo URL xem trước email (chỉ dùng trong môi trường phát triển với Ethereal)
      const previewURL = previewUrl(info) as string;

      console.log(`Email đặt lại mật khẩu gửi đến ${email}:`);
      console.log(`Link xem email: ${previewURL}`);

      return {
        success: true,
        message: "Email đặt lại mật khẩu đã được gửi",
        previewURL, // Chỉ trả về trong môi trường phát triển
      };
    } catch (error) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
      throw error;
    }
  },
};

export default emailService;
