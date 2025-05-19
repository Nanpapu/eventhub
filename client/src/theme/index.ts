import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Cấu hình màu sắc mặc định (ví dụ, có thể bạn đã có phần này)
const config: ThemeConfig = {
  initialColorMode: "light", // Hoặc 'dark', 'system'
  useSystemColorMode: false,
};

// Các màu sắc tùy chỉnh của bạn (ví dụ, có thể bạn đã có)
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

// Font chữ
const fonts = {
  heading: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
  body: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
};

// Tạo theme
const theme = extendTheme({
  config,
  colors, // Giữ lại nếu bạn có định nghĩa màu riêng
  fonts, // Áp dụng font mới
  // Bạn có thể có các tùy chỉnh khác ở đây như components, styles, etc.
  // Ví dụ:
  // styles: {
  //   global: (props: any) => ({
  //     'body': {
  //       bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
  //     },
  //   }),
  // },
});

export default theme;
