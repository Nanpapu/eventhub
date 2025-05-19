import { Request, Response } from "express";
import ticketService from "../services/ticket.service";

class TicketController {
  constructor() {
    this.getMyTickets = this.getMyTickets.bind(this); // Bind 'this' context
  }

  /**
   * @desc    Get all tickets for the logged-in user
   * @route   GET /api/tickets/my-tickets
   * @access  Private
   */
  async getMyTickets(req: Request, res: Response) {
    const userId = req.user?.id; // req.user sẽ có sẵn do module augmentation

    if (!userId) {
      res.status(401);
      throw new Error("User not authenticated or user ID not found");
    }

    const tickets = await ticketService.findUserTickets(userId);

    if (tickets) {
      res.json(tickets);
    } else {
      res.status(404);
      throw new Error("No tickets found for this user");
    }
  }

  // Các hàm controller khác cho ticket có thể được thêm ở đây
  // Ví dụ: getTicketById, cancelTicket, ...
}

export default new TicketController();
