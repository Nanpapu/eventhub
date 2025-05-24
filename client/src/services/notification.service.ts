import api from "../utils/api"; // Giả định bạn có một instance axios đã cấu hình tên là 'api'
import { Notification } from "../components/notification/NotificationList"; // Import kiểu Notification

// Interface cho phản hồi từ API lấy danh sách thông báo
interface GetNotificationsResponse {
  notifications: Notification[];
  total: number;
  pages: number;
  currentPage: number;
}

// Interface cho phản hồi từ API lấy số lượng thông báo chưa đọc
interface UnreadCountResponse {
  count: number;
}

/**
 * Lấy danh sách thông báo từ server
 */
export const getNotificationsAPI = async (
  page: number = 1,
  limit: number = 10,
  isRead?: boolean
): Promise<GetNotificationsResponse> => {
  try {
    const params: any = { page, limit };
    if (isRead !== undefined) {
      params.isRead = isRead;
    }
    const response = await api.get<GetNotificationsResponse>("/notifications", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const getUnreadCountAPI = async (): Promise<UnreadCountResponse> => {
  try {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/unread-count"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

/**
 * Đánh dấu một thông báo là đã đọc
 */
export const markNotificationAsReadAPI = async (
  notificationId: string
): Promise<Notification> => {
  try {
    const response = await api.post<Notification>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllNotificationsAsReadAPI = async (): Promise<{
  modifiedCount: number;
}> => {
  try {
    const response = await api.post<{
      modifiedCount: number;
    }>("/notifications/mark-all-read");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Xóa một thông báo
 */
export const deleteNotificationAPI = async (
  notificationId: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      `/notifications/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

const notificationService = {
  getNotificationsAPI,
  getUnreadCountAPI,
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
  deleteNotificationAPI,
};

export default notificationService;
