import express from "express";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import checkoutRoutes from "./checkout.routes";

const router = express.Router();

// Gắn các route vào router
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/checkout", checkoutRoutes);

export default router;
