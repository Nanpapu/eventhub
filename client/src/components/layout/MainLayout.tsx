import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../common/ScrollToTop";

/**
 * Layout chính cho toàn bộ ứng dụng
 * Bao gồm Header, nội dung chính (Outlet) và Footer
 * Hỗ trợ dark/light mode thông qua useColorModeValue
 */
export default function MainLayout() {
  // Sử dụng useColorModeValue để áp dụng màu sắc khác nhau cho light/dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex
      direction="column"
      minH="100vh" // Đảm bảo layout chiếm toàn bộ chiều cao màn hình
      bg={bgColor}
      color={textColor}
    >
      {/* Component cuộn lên đầu trang khi chuyển trang */}
      <ScrollToTop />

      {/* Header cố định ở trên cùng */}
      <Header />

      {/* Nội dung chính của trang */}
      <Box flex="1">
        <Outlet />
      </Box>

      {/* Footer luôn ở dưới cùng */}
      <Footer />
    </Flex>
  );
}
