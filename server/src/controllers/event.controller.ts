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
      console.log(`Fetching event with ID: ${id}`);

      const event = await eventService.getEventById(id);
      console.log("Event found:", event);

      // Trả về dữ liệu trực tiếp, không bọc trong object
      return res.status(200).json(event);
    } catch (error: any) {
      console.error("Error in getEventById:", error);
      return res.status(error.message === "Event not found" ? 404 : 500).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi lấy chi tiết sự kiện",
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

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi khi lấy thống kê sự kiện",
      });
    }
  }

  /**
   * Cập nhật trạng thái published của sự kiện
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
}

export default new EventController();
