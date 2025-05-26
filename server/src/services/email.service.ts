import nodemailer from "nodemailer";
import config from "../config";

/**
 * Cấu hình transporter cho Nodemailer
 */
const createTransporter = async () => {
  // Kiểm tra môi trường
  if (config.nodeEnv === "development" && config.emailService === "ethereal") {
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
      isDevelopment: true,
    };
  } else {
    // Sử dụng cấu hình Gmail thực tế
    const transporter = nodemailer.createTransport({
      service: config.emailService, // 'gmail'
      host: config.emailHost, // smtp.gmail.com
      port: config.emailPort, // 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.emailUser, // Email từ file .env
        pass: config.emailPass, // Password từ file .env (App Password từ Google)
      },
    });

    // Verify the transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection to Gmail verified successfully");
    } catch (error) {
      console.error("SMTP connection verification failed:", error);
    }

    return {
      transporter,
      previewUrl: null,
      testAccount: { user: config.emailFrom || config.emailUser },
      isDevelopment: false,
    };
  }
};

/**
 * Dịch vụ gửi email
 */
const emailService = {
  /**
   * Gửi email đặt lại mật khẩu
   * @param email Email người nhận
   * @param resetToken Token đặt lại mật khẩu
   */
  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const { transporter, previewUrl, testAccount, isDevelopment } =
        await createTransporter();

      // Tạo link đặt lại mật khẩu
      const resetLink = `${config.clientURL}/auth/reset-password?token=${resetToken}`;

      // Nội dung email
      const mailOptions = {
        from: `"EventHub" <${
          isDevelopment ? testAccount.user : config.emailFrom
        }>`,
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
      console.log("Message sent: %s", info.messageId);

      // Kết quả
      const result: {
        success: boolean;
        message: string;
        previewURL?: string;
      } = {
        success: true,
        message: "Email đặt lại mật khẩu đã được gửi",
      };

      // Trong môi trường phát triển với Ethereal, trả về link xem trước email
      if (isDevelopment && previewUrl) {
        const previewURL = previewUrl(info) as string;
        console.log(`Email đặt lại mật khẩu gửi đến ${email}:`);
        console.log(`Link xem email: ${previewURL}`);
        result.previewURL = previewURL;
      } else {
        console.log(`Email đặt lại mật khẩu đã được gửi đến ${email}`);
      }

      return result;
    } catch (error) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
      throw error;
    }
  },
};

export default emailService;
