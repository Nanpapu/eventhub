import { Request, Response } from "express";
import ticketService from "../services/ticket.service";

class TicketController {
  constructor() {
    this.getMyTickets = this.getMyTickets.bind(this); // Bind 'this' context
    this.getUserTicketStatus = this.getUserTicketStatus.bind(this);
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

  // Các hàm controller khác cho ticket có thể được thêm ở đây
  // Ví dụ: getTicketById, cancelTicket, ...
}

export default new TicketController();
