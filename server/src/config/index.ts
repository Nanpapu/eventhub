import dotenv from "dotenv";

// Tải biến môi trường từ file .env
dotenv.config();

// Hiển thị CLIENT_URL để debug
console.log("CLIENT_URL from .env:", process.env.CLIENT_URL);

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB
  mongoURI:
    process.env.MONGODB_URI ||
    "mongodb+srv://21521059:Lam%4020032001@data.v6vriop.mongodb.net/eventhub",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Client
  clientURL: process.env.CLIENT_URL || "http://localhost:3000",

  // Email
  emailService: process.env.EMAIL_SERVICE || "ethereal",
  emailHost: process.env.EMAIL_HOST || "smtp.ethereal.email",
  emailPort: parseInt(process.env.EMAIL_PORT || "587", 10),
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "noreply@eventhub.com",
};

export default config;
