import emailService from "./services/email.service";
import dotenv from "dotenv";

// Load biến môi trường
dotenv.config();

async function testSendEmail() {
  try {
    const testEmail = "test@example.com"; // Thay bằng email của bạn để test
    const fakeToken = "test-reset-token-12345";

    console.log(`Sending test password reset email to: ${testEmail}`);

    const result = await emailService.sendPasswordResetEmail(
      testEmail,
      fakeToken
    );

    console.log("Email result:", result);
    if (result.previewURL) {
      console.log("Preview URL:", result.previewURL);
    }

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

// Chạy test
testSendEmail();
