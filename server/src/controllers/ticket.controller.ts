import { Request, Response } from "express";
import ticketService from "../services/ticket.service";

class TicketController {
  constructor() {
    this.getMyTickets = this.getMyTickets.bind(this);
    this.getUserTicketStatus = this.getUserTicketStatus.bind(this);
    this.getEventAttendees = this.getEventAttendees.bind(this);
    this.checkInTicket = this.checkInTicket.bind(this);
  }

  /**
   * @desc    Get all tickets for the logged-in user
   * @route   GET /api/tickets/my-tickets
   * @access  Private
   */
  async getMyTickets(req: Request, res: Response) {
    console.log("[TicketController] Attempting to get user tickets.");
    const userId = req.user?.id;
    console.log("[TicketController] User ID from req.user:", userId);

    if (!userId) {
      console.error(
        "[TicketController] User not authenticated or user ID not found."
      );
      res.status(401);
      throw new Error("User not authenticated or user ID not found");
    }

    try {
      const ticketsFromService = await ticketService.findUserTickets(userId);
      console.log(
        "[TicketController] Tickets received from service:",
        JSON.stringify(ticketsFromService, null, 2)
      );

      if (ticketsFromService && ticketsFromService.length > 0) {
        console.log(
          `[TicketController] Found ${ticketsFromService.length} tickets. Sending to client.`
        );
        res.json(ticketsFromService);
      } else {
        console.log(
          "[TicketController] No tickets found for this user by service. Sending 404."
        );
        res.status(404).json({ message: "No tickets found for this user" }); // Gửi kèm message cho client dễ debug
        // throw new Error("No tickets found for this user"); // Không nên throw error ở đây nếu muốn client nhận 404
      }
    } catch (error) {
      console.error(
        "[TicketController] Error calling ticketService.findUserTickets:",
        error
      );
      res.status(500).json({ message: "Error fetching tickets from service" });
      // throw error; // Hoặc throw error để asyncHandler xử lý chung
    }
  }

  /**
   * Kiểm tra trạng thái vé của người dùng cho sự kiện cụ thể
   */
  async getUserTicketStatus(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "ID sự kiện không được cung cấp",
        });
      }

      const status = await ticketService.getUserTicketStatus(
        req.user.id,
        eventId
      );

      res.json({
        success: true,
        ...status,
      });
    } catch (error) {
      console.error("Error in getUserTicketStatus:", error);
      res.status(500).json({
        success: false,
        message: "Không thể kiểm tra trạng thái vé. Vui lòng thử lại sau.",
      });
    }
  }

  /**
   * Lấy danh sách người tham dự của một sự kiện
   * @route GET /tickets/event/:eventId/attendees
   */
  async getEventAttendees(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const organizerId = req.user.id;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "ID sự kiện không được cung cấp",
        });
      }

      // Lấy danh sách người tham dự
      const attendees = await ticketService.getEventAttendees(
        eventId,
        organizerId
      );

      return res.status(200).json({
        success: true,
        attendees,
        totalAttendees: attendees.length,
        checkedInCount: attendees.filter((a) => a.checkInStatus).length,
      });
    } catch (error: any) {
      console.error("Error in getEventAttendees:", error);
      const statusCode = error.message.includes("quyền truy cập") ? 403 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Không thể tải danh sách người tham dự",
      });
    }
  }

  /**
   * Check-in một vé
   * @route POST /tickets/:ticketId/check-in
   */
  async checkInTicket(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const { eventId } = req.body;
      const organizerId = req.user.id;

      if (!ticketId || !eventId) {
        return res.status(400).json({
          success: false,
          message: "ID vé và ID sự kiện là bắt buộc",
        });
      }

      // Thực hiện check-in
      const result = await ticketService.checkInTicket(
        ticketId,
        eventId,
        organizerId
      );

      return res.status(200).json({
        success: true,
        message: result.alreadyCheckedIn
          ? "Vé đã được check-in trước đó"
          : "Check-in thành công",
        attendee: result,
      });
    } catch (error: any) {
      console.error("Error in checkInTicket:", error);
      const statusCode = error.message.includes("quyền truy cập") ? 403 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Không thể check-in vé",
      });
    }
  }

  // Các hàm controller khác cho ticket có thể được thêm ở đây
  // Ví dụ: getTicketById, cancelTicket, ...
}

export default new TicketController();
