import express from "express";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import checkoutRoutes from "./checkout.routes";
import ticketRoutes from "./ticket.routes";

const router = express.Router();

// Gắn các route vào router
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/tickets", ticketRoutes);

export default router;
