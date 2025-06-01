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
    // Hiển thị thông tin cấu hình để debug (che giấu mật khẩu)
    console.log("Email configuration:");
    console.log("- Service:", config.emailService);
    console.log("- Host:", config.emailHost);
    console.log("- Port:", config.emailPort);
    console.log("- User:", config.emailUser);
    console.log("- From:", config.emailFrom);
    console.log("- Password exists:", config.emailPass ? "Yes" : "No");

    // Cấu hình transporter cho Gmail - phiên bản đơn giản hơn
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    // Verify the transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection to Gmail verified successfully");
    } catch (error: any) {
      console.error("SMTP connection verification failed:", error);
      throw new Error(`SMTP connection failed: ${error.message}`);
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
      console.log(`Generated reset link: ${resetLink}`);

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

      console.log(`Attempting to send email to: ${email}`);

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
    } catch (error: any) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);

      // Bổ sung thông tin lỗi chi tiết hơn để debug
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error stack:", error.stack);
      } else {
        errorMessage = String(error);
      }

      throw new Error(`Không thể gửi email: ${errorMessage}`);
    }
  },

  /**
   * Gửi email liên hệ từ form Contact Us
   * @param name Tên người gửi
   * @param email Email người gửi
   * @param category Loại vấn đề
   * @param categoryLabel Label của loại vấn đề
   * @param subject Tiêu đề tin nhắn
   * @param message Nội dung tin nhắn
   */
  async sendContactEmail(
    name: string,
    email: string,
    category: string,
    categoryLabel: string,
    subject: string,
    message: string
  ) {
    try {
      const { transporter, previewUrl, testAccount, isDevelopment } =
        await createTransporter();

      // Nội dung email
      const mailOptions = {
        from: `"${name} via EventHub" <${
          isDevelopment ? testAccount.user : config.emailFrom
        }>`,
        to: config.contactEmail || config.emailFrom || config.emailUser,
        replyTo: email, // Để người nhận có thể trả lời trực tiếp đến người gửi
        subject: `Liên hệ từ website: ${subject} (${categoryLabel})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #008080; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">EventHub - Tin nhắn Liên hệ</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Bạn có tin nhắn mới từ website</h2>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Họ tên:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Loại vấn đề:</strong> ${categoryLabel}</p>
                <p><strong>Tiêu đề:</strong> ${subject}</p>
                <div>
                  <strong>Nội dung:</strong>
                  <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              
              <p>Vui lòng phản hồi với người gửi sớm nhất có thể.</p>
              <hr style="margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">Email này được gửi từ form liên hệ trên website EventHub.</p>
            </div>
          </div>
        `,
        // Thêm phiên bản text để tăng tỷ lệ gửi thành công và tránh spam
        text: `EventHub - Tin nhắn Liên hệ\n\nHọ tên: ${name}\nEmail: ${email}\nLoại vấn đề: ${categoryLabel}\nTiêu đề: ${subject}\n\nNội dung:\n${message}\n\n---\nEmail này được gửi từ form liên hệ trên website EventHub.`,
      };

      console.log(`Attempting to send contact email from: ${email}`);

      // Gửi email
      const info = await transporter.sendMail(mailOptions);
      console.log("Contact message sent: %s", info.messageId);

      // Gửi email xác nhận lại cho người gửi
      const confirmationMailOptions = {
        from: `"EventHub" <${
          isDevelopment ? testAccount.user : config.emailFrom
        }>`,
        to: email,
        subject: `Xác nhận tin nhắn của bạn: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #008080; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">EventHub</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Cảm ơn bạn đã liên hệ với chúng tôi</h2>
              <p>Xin chào ${name},</p>
              <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.</p>
              <p>Dưới đây là bản sao tin nhắn của bạn:</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Loại vấn đề:</strong> ${categoryLabel}</p>
                <p><strong>Tiêu đề:</strong> ${subject}</p>
                <div>
                  <strong>Nội dung:</strong>
                  <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              
              <p>Vui lòng không trả lời email này. Đội ngũ của chúng tôi sẽ liên hệ với bạn qua email ${email} trong thời gian sớm nhất.</p>
              <hr style="margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">Đây là email tự động xác nhận tin nhắn của bạn đã được gửi thành công.</p>
            </div>
          </div>
        `,
        text: `Cảm ơn bạn đã liên hệ với chúng tôi\n\nXin chào ${name},\n\nChúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.\n\nDưới đây là bản sao tin nhắn của bạn:\n\nLoại vấn đề: ${categoryLabel}\nTiêu đề: ${subject}\n\nNội dung:\n${message}\n\nVui lòng không trả lời email này. Đội ngũ của chúng tôi sẽ liên hệ với bạn qua email ${email} trong thời gian sớm nhất.\n\n---\nĐây là email tự động xác nhận tin nhắn của bạn đã được gửi thành công.`,
      };

      // Gửi email xác nhận
      await transporter.sendMail(confirmationMailOptions);
      console.log(`Confirmation email sent to: ${email}`);

      // Kết quả
      const result: {
        success: boolean;
        message: string;
        previewURL?: string;
      } = {
        success: true,
        message: "Tin nhắn của bạn đã được gửi thành công",
      };

      // Trong môi trường phát triển với Ethereal, trả về link xem trước email
      if (isDevelopment && previewUrl) {
        const previewURL = previewUrl(info) as string;
        console.log(`Email liên hệ từ ${email}:`);
        console.log(`Link xem email: ${previewURL}`);
        result.previewURL = previewURL;
      } else {
        console.log(`Email liên hệ đã được gửi thành công từ ${email}`);
      }

      return result;
    } catch (error: any) {
      console.error("Lỗi khi gửi email liên hệ:", error);

      // Bổ sung thông tin lỗi chi tiết hơn để debug
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error stack:", error.stack);
      } else {
        errorMessage = String(error);
      }

      throw new Error(`Không thể gửi email liên hệ: ${errorMessage}`);
    }
  },
};

export default emailService;
