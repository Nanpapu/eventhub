import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component này tự động cuộn trang lên đầu khi người dùng điều hướng đến trang mới
 * Không hiển thị gì, chỉ thực hiện hành vi cuộn
 */
export default function ScrollToTop() {
  // Lấy thông tin đường dẫn hiện tại
  const { pathname } = useLocation();

  useEffect(() => {
    // Danh sách các đường dẫn không muốn tự động cuộn lên đầu
    // Ví dụ: trang kết quả tìm kiếm, có thể muốn giữ vị trí cuộn khi quay lại
    const excludePaths: string[] = [
      // '/search', // Bỏ comment nếu muốn loại trừ trang tìm kiếm
      // '/events', // Bỏ comment nếu muốn loại trừ trang danh sách sự kiện
    ];

    // Chỉ cuộn lên đầu nếu không phải trong danh sách loại trừ
    if (!excludePaths.some((path) => pathname.startsWith(path))) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Tạo hiệu ứng cuộn mượt
      });
    }
  }, [pathname]); // Theo dõi thay đổi của pathname

  return null; // Component này không hiển thị gì
}
