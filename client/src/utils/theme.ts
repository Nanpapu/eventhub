import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Cấu hình chế độ màu
const config: ThemeConfig = {
  initialColorMode: "light", // Chế độ mặc định khi người dùng lần đầu truy cập
  useSystemColorMode: false, // Không sử dụng chế độ màu của hệ thống
};

// Các biến theme tùy chỉnh
const colors = {
  brand: {
    50: "#E6F6FF",
    100: "#B3E0FF",
    200: "#80CBFF",
    300: "#4DB6FF",
    400: "#1AA1FF",
    500: "#0088E6", // Main brand color
    600: "#006BB3",
    700: "#004F80",
    800: "#00324D",
    900: "#00161A",
  },
};

// Tùy chỉnh component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "md",
    },
    variants: {
      solid: (props: { colorMode: string }) => ({
        bg: props.colorMode === "dark" ? "brand.500" : "brand.500",
        color: "white",
        _hover: {
          bg: props.colorMode === "dark" ? "brand.400" : "brand.600",
        },
      }),
      outline: (props: { colorMode: string }) => ({
        borderColor: props.colorMode === "dark" ? "brand.500" : "brand.500",
        color: props.colorMode === "dark" ? "brand.500" : "brand.500",
        _hover: {
          bg: props.colorMode === "dark" ? "brand.500" : "brand.50",
          color: props.colorMode === "dark" ? "white" : "brand.500",
        },
      }),
    },
  },
};

// Tạo theme từ các cấu hình
const theme = extendTheme({
  config,
  colors,
  components,
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
});

export default theme;
