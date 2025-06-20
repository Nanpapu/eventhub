import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";
import scheduleEventReminders from "./jobs/eventReminders"; // Import cron job scheduler

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    // Schedule cron jobs after successful DB connection
    scheduleEventReminders();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// API Routes
app.use("/api", routes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EventHub API" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
