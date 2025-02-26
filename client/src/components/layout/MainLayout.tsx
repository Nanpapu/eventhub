import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout chính cho toàn bộ ứng dụng
 * Bao gồm Header, nội dung chính (Outlet) và Footer
 */
export default function MainLayout() {
  return (
    <Flex
      direction="column"
      minH="100vh" // Đảm bảo layout chiếm toàn bộ chiều cao màn hình
    >
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
