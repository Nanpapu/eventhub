import express from "express";
import ticketController from "../controllers/ticket.controller";
import { authenticate, isOrganizer } from "../middlewares/auth.middleware";
import asyncHandler from "express-async-handler";

const router = express.Router();

/**
 * @route   GET /tickets/my-tickets
 * @desc    Get user's tickets
 * @access  Private
 */
router.get("/my-tickets", authenticate, ticketController.getMyTickets);

// Kiểm tra trạng thái vé của người dùng cho sự kiện cụ thể
router.get(
  "/status/:eventId",
  authenticate,
  ticketController.getUserTicketStatus
);

/**
 * @route   GET /tickets/event/:eventId/attendees
 * @desc    Lấy danh sách người tham dự của một sự kiện
 * @access  Private (Organizer only)
 */
router.get(
  "/event/:eventId/attendees",
  authenticate,
  isOrganizer,
  ticketController.getEventAttendees
);

/**
 * @route   POST /tickets/:ticketId/check-in
 * @desc    Check-in vé cho người tham dự
 * @access  Private (Organizer only)
 */
router.post(
  "/:ticketId/check-in",
  authenticate,
  isOrganizer,
  ticketController.checkInTicket
);

// Thêm các routes khác cho ticket sau này nếu cần
// ví dụ: GET /api/tickets/:ticketId - Get specific ticket details
// ví dụ: PUT /api/tickets/:ticketId/cancel - Cancel a ticket

export default router;
