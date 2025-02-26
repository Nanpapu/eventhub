import { Box, useColorModeValue } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Component Layout chính cho ứng dụng
 * Bao gồm Header, nội dung chính và Footer
 * Hỗ trợ dark/light mode thông qua useColorModeValue
 */
const Layout = ({ children }: LayoutProps) => {
  // Sử dụng useColorModeValue để áp dụng màu sắc khác nhau cho light/dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg={bgColor}
      color={textColor}
    >
      <Header />
      <Box flex="1" as="main" py={8} px={4}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
