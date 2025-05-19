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

const userService = {
  getMyTickets,
};

export default userService;
