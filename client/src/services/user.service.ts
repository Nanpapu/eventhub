import axios from "axios";

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

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Lấy danh sách vé của người dùng đã đăng nhập
 */
const getMyTickets = async (): Promise<Ticket[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated. No token found.");
  }

  try {
    const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // API được kỳ vọng trả về trực tiếp một mảng các Ticket objects đã được transform
    return response.data as Ticket[];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Nếu API trả về lỗi có cấu trúc
      throw new Error(
        error.response.data?.message ||
          "Failed to fetch user tickets from server."
      );
    }
    // Các lỗi khác (network error, etc.)
    throw new Error(
      "An unexpected error occurred while fetching user tickets."
    );
  }
};

const userService = {
  getMyTickets,
};

export default userService;
