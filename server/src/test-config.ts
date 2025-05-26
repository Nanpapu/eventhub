import config from "./config";
import nodemailer from "nodemailer";

async function testEmailConfig() {
  console.log("===== ENVIRONMENT CONFIG =====");
  console.log("NODE_ENV:", config.nodeEnv);
  console.log("CLIENT_URL:", config.clientURL);
  console.log("EMAIL_SERVICE:", config.emailService);
  console.log("EMAIL_HOST:", config.emailHost);
  console.log("EMAIL_PORT:", config.emailPort);
  console.log("EMAIL_USER:", config.emailUser);
  console.log("EMAIL_PASS:", config.emailPass ? "******" : "Not set"); // Không hiện mật khẩu thật
  console.log("EMAIL_FROM:", config.emailFrom);
  console.log("=====");

  // Thử kết nối tới SMTP server
  try {
    console.log("Testing SMTP connection...");
    const transporter = nodemailer.createTransport({
      service: config.emailService,
      host: config.emailHost,
      port: config.emailPort,
      secure: false,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    // Verify connection
    const verify = await transporter.verify();
    console.log("SMTP Connection Status:", verify ? "SUCCESS" : "FAILED");
    console.log("SMTP connection verified successfully!");
  } catch (error) {
    console.error("SMTP Connection Error:", error);
  }
}

// Chạy kiểm tra
testEmailConfig();

export default { test: "config" };
