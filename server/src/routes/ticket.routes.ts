import express from "express";
import ticketController from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "express-async-handler";

const router = express.Router();

// @route   GET /api/tickets/my-tickets
// @desc    Get all tickets for the logged-in user
// @access  Private
router.get(
  "/my-tickets",
  authenticate,
  asyncHandler(ticketController.getMyTickets)
);

// Kiểm tra trạng thái vé của người dùng cho sự kiện cụ thể
router.get(
  "/status/:eventId",
  authenticate,
  ticketController.getUserTicketStatus
);

// Thêm các routes khác cho ticket sau này nếu cần
// ví dụ: GET /api/tickets/:ticketId - Get specific ticket details
// ví dụ: PUT /api/tickets/:ticketId/cancel - Cancel a ticket

export default router;
