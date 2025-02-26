# Dark/Light Mode Implementation for EventHub

## Tổng quan

EventHub sử dụng Chakra UI để triển khai chức năng Dark/Light mode, giúp người dùng có thể dễ dàng chuyển đổi giữa hai chế độ giao diện phù hợp với nhu cầu và điều kiện môi trường.

## Kiến trúc

### 1. Theme Configuration

- File `utils/theme.ts` chứa toàn bộ cấu hình theme cho ứng dụng
- Cấu hình gốc của chế độ màu:
  ```typescript
  const config: ThemeConfig = {
    initialColorMode: "light", // Chế độ mặc định khi người dùng lần đầu truy cập
    useSystemColorMode: false, // Không sử dụng chế độ màu của hệ thống
  };
  ```
- Semantic tokens: Định nghĩa các giá trị màu sắc theo ngữ cảnh, cho phép thay đổi theo chế độ màu
  ```typescript
  const semanticTokens = {
    colors: {
      "bg.primary": {
        default: "white",
        _dark: "gray.800",
      },
      // ... các tokens khác
    },
  };
  ```
- Component styles: Tùy chỉnh style cho các component theo chế độ màu
  ```typescript
  const components = {
    Button: {
      // ... Các styles dành riêng cho Button
    },
    // ... Các components khác
  };
  ```

### 2. ColorModeToggle Component

- Component `common/ColorModeToggle.tsx` là nút chuyển đổi giữa chế độ sáng/tối
- Sử dụng hook `useColorMode` để lấy và thay đổi chế độ màu
- Sử dụng hook `useColorModeValue` để định nghĩa các giá trị khác nhau cho mỗi chế độ màu

### 3. Responsive Layout

- Các components layout (Layout.tsx, MainLayout.tsx) đều đã được cấu hình để hỗ trợ dark/light mode
- Sử dụng `useColorModeValue` để thay đổi màu nền, màu chữ, và các thuộc tính khác

## Cách sử dụng

### 1. Trong component

Để thêm hỗ trợ dark/light mode vào component của bạn, hãy làm theo các bước sau:

1. Import các hooks cần thiết:

   ```typescript
   import { useColorMode, useColorModeValue } from "@chakra-ui/react";
   ```

2. Sử dụng `useColorModeValue` để định nghĩa các giá trị tùy thuộc vào chế độ màu:

   ```typescript
   const bgColor = useColorModeValue("white", "gray.800");
   const textColor = useColorModeValue("gray.800", "white");
   ```

3. Áp dụng các giá trị này vào các thuộc tính phù hợp:

   ```tsx
   <Box bg={bgColor} color={textColor}>
     Content here
   </Box>
   ```

4. Nếu cần biết chế độ màu hiện tại, sử dụng `useColorMode`:
   ```typescript
   const { colorMode, toggleColorMode } = useColorMode();
   const isDark = colorMode === "dark";
   ```

### 2. Thêm nút chuyển đổi

Để thêm nút chuyển đổi chế độ màu vào UI, chỉ cần import và sử dụng component `ColorModeToggle`:

```tsx
import ColorModeToggle from "../components/common/ColorModeToggle";

const MyComponent = () => {
  return (
    <div>
      <ColorModeToggle />
      {/* Nội dung khác */}
    </div>
  );
};
```

### 3. Semantic Tokens

Khi cần định nghĩa các styles tùy chỉnh, ưu tiên sử dụng semantic tokens từ theme:

```tsx
<Box bg="bg.primary" color="text.primary">
  <Heading color="text.primary">Tiêu đề</Heading>
  <Text color="text.secondary">Nội dung phụ</Text>
</Box>
```

## Best Practices

1. **Sử dụng semantic tokens**: Thay vì hardcode màu sắc, hãy sử dụng các token đã định nghĩa trong theme
2. **Consistency**: Đảm bảo tính nhất quán trong việc áp dụng dark/light mode trong toàn bộ ứng dụng
3. **Testing**: Kiểm tra UI trong cả hai chế độ màu để đảm bảo tính dễ đọc và tương phản
4. **Accessibility**: Đảm bảo đủ độ tương phản cho text và các thành phần tương tác

## Thư mục Notification

EventHub sử dụng thư mục `components/notification` cho các thành phần thông báo. Thư mục `components/notifications` không được sử dụng và đã được xóa để tránh nhầm lẫn.
