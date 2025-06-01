import { Request, Response } from "express";
import eventService from "../services/event.service";
import {
  createEventSchema,
  updateEventSchema,
  eventFilterSchema,
} from "../validations/event.validation";

class EventController {
  /**
   * Lấy danh sách sự kiện
   */
  async getEvents(req: Request, res: Response) {
    try {
      // Validate query parameters
      const { error, value } = eventFilterSchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Lấy danh sách sự kiện
      const result = await eventService.getEvents(value);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi lấy danh sách sự kiện",
      });
    }
  }

  /**
   * Lấy chi tiết sự kiện theo ID
   */
  async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Lấy userId từ nhiều nguồn:
      // 1. Header X-User-Id (từ client gửi lên)
      // 2. Token JWT (nếu đã đăng nhập)
      // 3. Query param userId (backward compatibility)
      const userId =
        req.header("X-User-Id") || req.user?.id || (req.query.userId as string);

      console.log("Fetching event with userId:", userId); // Debug log

      const event = await eventService.getEventById(id, userId);

      res.status(200).json(event);
    } catch (error) {
      console.error("Error in getEventById:", error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Event not found",
      });
    }
  }

  /**
   * Tạo sự kiện mới
   */
  async createEvent(req: Request, res: Response) {
    try {
      // Lấy ID của người dùng từ token
      const userId = (req as any).user.id;

      // Validate request body
      const { error, value } = createEventSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Thêm organizer là người dùng hiện tại
      const eventData = {
        ...value,
        organizer: userId,
      };

      // Tạo sự kiện mới
      const newEvent = await eventService.createEvent(eventData);

      return res.status(201).json({
        success: true,
        message: "Tạo sự kiện thành công",
        event: newEvent,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi tạo sự kiện",
      });
    }
  }

  /**
   * Cập nhật thông tin sự kiện
   */
  async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      // Validate request body
      const { error, value } = updateEventSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Kiểm tra sự kiện có tồn tại không
      const event = await eventService.getEventById(id);

      // Kiểm tra người dùng có quyền cập nhật sự kiện không
      if (
        event.organizer.id.toString() !== userId &&
        (req as any).user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền cập nhật sự kiện này",
        });
      }

      // Cập nhật sự kiện
      const updatedEvent = await eventService.updateEvent(id, value);

      return res.status(200).json({
        success: true,
        message: "Cập nhật sự kiện thành công",
        event: updatedEvent,
      });
    } catch (error: any) {
      const statusCode = error.message === "Event not found" ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi cập nhật sự kiện",
      });
    }
  }

  /**
   * Xóa sự kiện
   */
  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      // Kiểm tra sự kiện có tồn tại không
      const event = await eventService.getEventById(id);

      // Kiểm tra người dùng có quyền xóa sự kiện không
      if (
        event.organizer.id.toString() !== userId &&
        (req as any).user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xóa sự kiện này",
        });
      }

      // Xóa sự kiện
      await eventService.deleteEvent(id);

      return res.status(200).json({
        success: true,
        message: "Xóa sự kiện thành công",
      });
    } catch (error: any) {
      const statusCode = error.message === "Event not found" ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi xóa sự kiện",
      });
    }
  }

  /**
   * Lấy sự kiện của người dùng hiện tại
   */
  async getUserEvents(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const events = await eventService.getUserEvents(userId);

      return res.status(200).json({
        success: true,
        events,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error.message || "Đã xảy ra lỗi khi lấy danh sách sự kiện của bạn",
      });
    }
  }

  /**
   * Lấy thống kê sự kiện của người dùng hiện tại
   */
  async getEventStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const stats = await eventService.getEventStats(userId);

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error getting event stats:", error);
      return res.status(500).json({ message: "Failed to get event stats" });
    }
  }

  /**
   * Lấy thống kê tổng quan cho dashboard của tổ chức
   */
  async getOrganizerDashboardStats(req: Request, res: Response) {
    try {
      const organizerId = (req as any).user.id;

      // Lấy tất cả sự kiện của tổ chức
      const events = await eventService.getUserEvents(organizerId);

      // Tính toán các thống kê
      const now = new Date();

      // Để so sánh chính xác theo ngày, bỏ qua giờ phút giây
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingEvents = events.filter((event: any) => {
        const eventDate = new Date(event.date);
        const eventDay = new Date(eventDate);
        eventDay.setHours(0, 0, 0, 0);
        return eventDay > today && event.status !== "cancelled";
      });

      const ongoingEvents = events.filter((event: any) => {
        const eventDate = new Date(event.date);
        const eventDay = new Date(eventDate);
        eventDay.setHours(0, 0, 0, 0);
        return (
          eventDay.getTime() === today.getTime() && event.status !== "cancelled"
        );
      });

      const pastEvents = events.filter((event: any) => {
        const eventDate = new Date(event.date);
        const eventDay = new Date(eventDate);
        eventDay.setHours(0, 0, 0, 0);
        return eventDay < today && event.status !== "cancelled";
      });

      // Tính tổng số người tham gia và doanh thu
      let totalAttendees = 0;
      let totalRevenue = 0;

      events.forEach((event: any) => {
        if (event.attendees) totalAttendees += event.attendees;

        // Tính doanh thu từ ticketTypes
        if (event.ticketTypes && event.ticketTypes.length > 0) {
          event.ticketTypes.forEach((ticketType: any) => {
            const soldQuantity =
              ticketType.quantity - ticketType.availableQuantity;
            totalRevenue += soldQuantity * ticketType.price;
          });
        } else if (event.isPaid && event.price && event.attendees) {
          // Nếu không có loại vé, tính doanh thu từ giá chung
          totalRevenue += event.attendees * event.price;
        }
      });

      const stats = {
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        ongoingEvents: ongoingEvents.length,
        pastEvents: pastEvents.length,
        totalAttendees,
        totalRevenue,
      };

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error getting organizer dashboard stats:", error);
      return res
        .status(500)
        .json({ message: "Failed to get dashboard statistics" });
    }
  }

  /**
   * Cập nhật trạng thái publish của sự kiện
   */
  async updateEventPublishStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { published } = req.body;
      const userId = (req as any).user.id;

      // Kiểm tra dữ liệu đầu vào
      if (published === undefined) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái published là bắt buộc",
        });
      }

      if (typeof published !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Trạng thái published phải là boolean",
        });
      }

      // Kiểm tra sự kiện có tồn tại không
      const event = await eventService.getEventById(id);

      // Kiểm tra người dùng có quyền cập nhật sự kiện không
      if (
        event.organizer.id.toString() !== userId &&
        (req as any).user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền cập nhật sự kiện này",
        });
      }

      // Cập nhật trạng thái published
      const updatedEvent = await eventService.updateEventPublishStatus(
        id,
        published
      );

      return res.status(200).json({
        success: true,
        message: `Sự kiện đã được ${published ? "đăng" : "ẩn"} thành công`,
        event: updatedEvent,
      });
    } catch (error: any) {
      const statusCode = error.message === "Event not found" ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message:
          error.message || "Đã xảy ra lỗi khi cập nhật trạng thái sự kiện",
      });
    }
  }

  /**
   * Lưu sự kiện vào danh sách đã lưu của người dùng
   * @route POST /events/:id/save
   */
  async saveEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      // Lưu sự kiện vào danh sách đã lưu của người dùng
      await eventService.saveEvent(id, userId);

      return res.status(200).json({
        success: true,
        message: "Sự kiện đã được lưu thành công",
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Event not found" ||
        error.message === "Event already saved"
          ? 400
          : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi lưu sự kiện",
      });
    }
  }

  /**
   * Xóa sự kiện khỏi danh sách đã lưu của người dùng
   * @route DELETE /events/:id/save
   */
  async unsaveEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      // Xóa sự kiện khỏi danh sách đã lưu của người dùng
      await eventService.unsaveEvent(id, userId);

      return res.status(200).json({
        success: true,
        message: "Sự kiện đã được xóa khỏi danh sách đã lưu",
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Event not found" ||
        error.message === "Event not saved"
          ? 400
          : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi xóa sự kiện đã lưu",
      });
    }
  }

  /**
   * Kiểm tra xem sự kiện đã được người dùng lưu chưa
   * @route GET /events/:id/is-saved
   */
  async isEventSaved(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      // Kiểm tra xem sự kiện đã được lưu chưa
      const isSaved = await eventService.isEventSaved(id, userId);

      return res.status(200).json({
        success: true,
        isSaved,
      });
    } catch (error: any) {
      const statusCode = error.message === "Event not found" ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi kiểm tra trạng thái lưu",
      });
    }
  }

  /**
   * Lấy danh sách sự kiện đã lưu của người dùng
   * @route GET /user/saved-events
   */
  async getSavedEvents(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const events = await eventService.getSavedEvents(userId);

      return res.status(200).json({
        success: true,
        events,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error.message || "Đã xảy ra lỗi khi lấy danh sách sự kiện đã lưu",
      });
    }
  }

  /**
   * Ẩn hoặc hiện một sự kiện
   * @param req Request với req.params.id (event ID) và req.body.isHidden (boolean)
   * @param res Response
   */
  async toggleEventVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isHidden } = req.body;
      const userId = req.user?.id;

      if (typeof isHidden !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isHidden phải là giá trị boolean",
        });
      }

      const event = await eventService.toggleEventVisibility(
        id,
        userId,
        isHidden
      );

      return res.status(200).json({
        success: true,
        message: isHidden
          ? "Sự kiện đã được ẩn thành công"
          : "Sự kiện đã được hiển thị thành công",
        event,
      });
    } catch (error) {
      console.error("Error in toggleEventVisibility controller:", error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Lỗi server",
      });
    }
  }

  /**
   * Upload ảnh sự kiện
   * @route POST /api/events/upload-image
   * @access Private (Organizer)
   */
  async uploadEventImage(req: Request, res: Response) {
    try {
      // req.file có sẵn từ middleware multer
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được tải lên",
        });
      }

      // @ts-ignore - Cloudinary sẽ thêm path và filename vào req.file
      const imageUrl = req.file.path;

      return res.status(200).json({
        success: true,
        message: "Ảnh sự kiện đã được tải lên thành công",
        data: {
          imageUrl: imageUrl,
        },
      });
    } catch (error: any) {
      console.error("Error uploading event image:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tải ảnh sự kiện",
        error: error.message,
      });
    }
  }
}

export default new EventController();
