import axios from "axios";
import api from "../utils/api";

// Interface cho dữ liệu vé (đồng bộ với dữ liệu trả về từ API và MyTickets.tsx)
export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  startTime: string;
  location: string;
  address?: string;
  image: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: "upcoming" | "past" | "canceled" | "used";
  ticketStatusOriginal?: "reserved" | "paid" | "cancelled" | "used";
  eventCategory?: string;
  // eventOrganizer?: any; // Bỏ qua eventOrganizer nếu client chưa dùng
}

// Interface cho thống kê người dùng
export interface UserStats {
  createdEvents: number;
  savedEvents: number;
  tickets: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Lấy danh sách vé của người dùng đã đăng nhập
 */
const getMyTickets = async (): Promise<Ticket[]> => {
  const token = localStorage.getItem("token");
  console.log("[Client user.service] Token from localStorage:", token);
  if (!token) {
    console.error(
      "[Client user.service] User not authenticated. No token found."
    );
    throw new Error("User not authenticated. No token found.");
  }

  try {
    console.log(
      `[Client user.service] Fetching tickets from ${API_URL}/tickets/my-tickets`
    );
    const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[Client user.service] Response from API:", response);
    console.log("[Client user.service] Response data from API:", response.data);
    // API được kỳ vọng trả về trực tiếp một mảng các Ticket objects đã được transform
    return response.data as Ticket[];
  } catch (error) {
    console.error("[Client user.service] Error fetching user tickets:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "[Client user.service] Axios error response:",
        error.response
      );
      throw new Error(
        error.response.data?.message ||
          "Failed to fetch user tickets from server."
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching user tickets."
    );
  }
};

/**
 * Lấy thống kê người dùng đã đăng nhập
 */
const getUserStats = async (): Promise<UserStats> => {
  const token = localStorage.getItem("token");
  console.log(
    "[Client user.service] Getting user stats. Token:",
    token ? "exists" : "not found"
  );

  if (!token) {
    throw new Error("Người dùng chưa đăng nhập");
  }

  try {
    const response = await axios.get(`${API_URL}/users/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[Client user.service] User stats response:", response.data);

    return response.data.stats as UserStats;
  } catch (error) {
    console.error("[Client user.service] Error fetching user stats:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message ||
          "Không thể lấy thông tin thống kê người dùng"
      );
    }
    throw new Error("Lỗi không xác định khi lấy thống kê người dùng");
  }
};

/**
 * Upload avatar
 * @param file File ảnh avatar
 * @returns Promise chứa response từ API
 */
const uploadAvatar = async (file: File): Promise<any> => {
  // Tạo FormData để gửi file
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

const userService = {
  getMyTickets,
  getUserStats,
  uploadAvatar,
};

export default userService;
