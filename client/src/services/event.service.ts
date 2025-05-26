import api from "../utils/api";

export interface EventFilter {
  keyword?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  imageUrl: string;
  isPaid: boolean;
  price?: number;
  capacity: number;
  maxTicketsPerPerson: number;
  ticketTypes?: TicketType[];
  tags?: string[];
  published?: boolean;
}

export interface TicketType {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  availableQuantity?: number;
  startSaleDate?: string;
  endSaleDate?: string;
}

export interface TicketData {
  ticketTypeId: string;
  quantity: number;
  attendeeInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }[];
}

// Thêm interface cho dashboard stats
export interface OrganizerDashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  totalRevenue: number;
}

/**
 * Service cho Event
 */
const eventService = {
  /**
   * Lấy danh sách sự kiện với filter
   * @param filter Thông tin filter
   */
  getEvents: async (filter: EventFilter = {}) => {
    const response = await api.get("/events", { params: filter });
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết sự kiện
   * @param id ID của sự kiện
   * @param userId ID của người dùng hiện tại (nếu có) để kiểm tra quyền truy cập
   */
  getEventById: async (id: string, userId?: string) => {
    try {
      // Tạo headers với userId nếu có
      const headers: Record<string, string> = {};
      if (userId) {
        headers["X-User-Id"] = userId;
      }

      const response = await api.get(`/events/${id}`, { headers });
      console.log("API raw response:", response);
      return response.data;
    } catch (error) {
      console.error("Error in event service getEventById:", error);
      throw error;
    }
  },

  /**
   * Tạo sự kiện mới
   * @param data Thông tin sự kiện
   */
  createEvent: async (data: CreateEventData) => {
    const response = await api.post("/events", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin sự kiện
   * @param id ID của sự kiện
   * @param data Thông tin cập nhật
   */
  updateEvent: async (id: string, data: Partial<CreateEventData>) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  /**
   * Xóa sự kiện
   * @param id ID của sự kiện
   */
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  /**
   * Đăng ký tham gia sự kiện
   * @param eventId ID của sự kiện
   * @param ticketData Thông tin vé
   */
  registerEvent: async (eventId: string, ticketData: TicketData) => {
    const response = await api.post(`/events/${eventId}/register`, ticketData);
    return response.data;
  },

  /**
   * Lấy danh sách sự kiện của người dùng hiện tại
   */
  getUserEvents: async () => {
    const response = await api.get("/events/user/events");
    return response.data;
  },

  /**
   * Lấy danh sách sự kiện đã lưu của người dùng
   */
  getSavedEvents: async () => {
    const response = await api.get("/events/user/saved-events");
    return response.data;
  },

  /**
   * Lưu sự kiện
   * @param eventId ID của sự kiện
   */
  saveEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/save`);
    return response.data;
  },

  /**
   * Bỏ lưu sự kiện
   * @param eventId ID của sự kiện
   */
  unsaveEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/save`);
    return response.data;
  },

  /**
   * Kiểm tra người dùng đã lưu sự kiện chưa
   * @param eventId ID của sự kiện
   */
  isEventSaved: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/is-saved`);
    return response.data;
  },

  /**
   * Lấy thống kê cho dashboard của tổ chức
   */
  getOrganizerDashboardStats: async (): Promise<OrganizerDashboardStats> => {
    try {
      const response = await api.get("/events/organizer/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching organizer dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết sự kiện để chỉnh sửa
   * @param eventId ID của sự kiện
   */
  getEventForEdit: async (eventId: string) => {
    try {
      // Lấy thông tin người dùng từ localStorage để truyền vào header
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;

      const headers: Record<string, string> = {};
      if (userId) {
        headers["X-User-Id"] = userId;
      }

      const response = await api.get(`/events/${eventId}`, { headers });
      return response.data;
    } catch (error: unknown) {
      console.error("[event.service] Error fetching event for edit:", error);

      // Type checking cho error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        throw (
          axiosError.response?.data?.message || "Không thể tải dữ liệu sự kiện"
        );
      }

      throw error instanceof Error
        ? error.message
        : "Không thể tải dữ liệu sự kiện";
    }
  },

  // Thêm hàm mới để kiểm tra trạng thái vé của người dùng
  getUserTicketStatus: async (eventId: string) => {
    try {
      const response = await api.get(`/tickets/status/${eventId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("[event.service] Error getting user ticket status:", error);

      // Sử dụng type guard để kiểm tra cấu trúc lỗi
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        throw (
          axiosError.response?.data?.message ||
          "Không thể kiểm tra trạng thái vé"
        );
      }

      // Trường hợp lỗi khác
      throw error instanceof Error
        ? error.message
        : "Không thể kiểm tra trạng thái vé";
    }
  },

  /**
   * Ẩn hoặc hiện một sự kiện
   * @param eventId ID của sự kiện
   * @param isHidden true để ẩn, false để hiện
   * @returns Kết quả từ API
   */
  toggleEventVisibility: async (
    eventId: string,
    isHidden: boolean
  ): Promise<{
    success: boolean;
    message: string;
    event?: Record<string, unknown>;
  }> => {
    try {
      const { data } = await api.patch(`/events/${eventId}/visibility`, {
        isHidden,
      });
      return data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw (
        axiosError.response?.data?.message ||
        "Failed to update event visibility"
      );
    }
  },
};

export default eventService;
