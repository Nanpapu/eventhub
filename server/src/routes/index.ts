import express from "express";
import authRoutes from "./auth.routes";

const router = express.Router();

// Gắn các route vào router
router.use("/auth", authRoutes);

export default router;
