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
  // Bổ sung màu cho event types
  event: {
    conference: "#805AD5",
    workshop: "#3182CE",
    meetup: "#38A169",
    concert: "#E53E3E",
    exhibition: "#DD6B20",
    other: "#718096",
  },
};

// Semantic tokens giúp quản lý màu sắc theo ngữ cảnh
const semanticTokens = {
  colors: {
    // Màu nền cho trang
    "bg.primary": {
      default: "white",
      _dark: "gray.800",
    },
    "bg.secondary": {
      default: "gray.50",
      _dark: "gray.700",
    },
    "bg.tertiary": {
      default: "gray.100",
      _dark: "gray.600",
    },
    // Màu nền cho card/component
    "card.bg": {
      default: "white",
      _dark: "gray.800",
    },
    "card.border": {
      default: "gray.200",
      _dark: "gray.700",
    },
    // Màu cho text
    "text.primary": {
      default: "gray.800",
      _dark: "white",
    },
    "text.secondary": {
      default: "gray.600",
      _dark: "gray.300",
    },
    "text.tertiary": {
      default: "gray.500",
      _dark: "gray.400",
    },
    // Màu hover cho các thành phần
    "hover.bg": {
      default: "gray.100",
      _dark: "gray.700",
    },
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
      ghost: (props: { colorMode: string }) => ({
        color: props.colorMode === "dark" ? "gray.300" : "gray.600",
        _hover: {
          bg: props.colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200",
        },
      }),
    },
  },
  Card: {
    baseStyle: (props: { colorMode: string }) => ({
      container: {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        borderColor: props.colorMode === "dark" ? "gray.700" : "gray.200",
      },
    }),
  },
  Link: {
    baseStyle: (props: { colorMode: string }) => ({
      color: props.colorMode === "dark" ? "teal.300" : "teal.600",
      _hover: {
        textDecoration: "none",
        color: props.colorMode === "dark" ? "teal.200" : "teal.700",
      },
    }),
  },
  Heading: {
    baseStyle: (props: { colorMode: string }) => ({
      color: props.colorMode === "dark" ? "white" : "gray.800",
    }),
  },
  Input: {
    variants: {
      outline: (props: { colorMode: string }) => ({
        field: {
          borderColor: props.colorMode === "dark" ? "gray.600" : "gray.300",
          _hover: {
            borderColor: props.colorMode === "dark" ? "gray.500" : "gray.400",
          },
          _focus: {
            borderColor: props.colorMode === "dark" ? "teal.300" : "teal.500",
            boxShadow:
              props.colorMode === "dark"
                ? "0 0 0 1px #4FD1C5"
                : "0 0 0 1px #319795",
          },
        },
      }),
    },
  },
};

// Tạo theme từ các cấu hình
const theme = extendTheme({
  config,
  colors,
  semanticTokens,
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
