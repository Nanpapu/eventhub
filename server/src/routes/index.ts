import express from "express";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import checkoutRoutes from "./checkout.routes";
import ticketRoutes from "./ticket.routes";
import notificationRoutes from "./notification.routes";
import userRoutes from "./user.routes";
import contactRoutes from "./contact.routes";

const router = express.Router();

// Gắn các route vào router
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/tickets", ticketRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);

export default router;
