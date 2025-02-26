# EventHub - Nền tảng Tổ chức và Quản lý Sự kiện

EventHub là một nền tảng toàn diện cho phép người dùng tạo, quản lý và tham gia các sự kiện. Dự án này được xây dựng với NextJS và cung cấp giao diện người dùng hiện đại với hỗ trợ chế độ Dark/Light Mode.

## Cập nhật mới nhất

### Chế độ Dark/Light Mode

Các trang và component quan trọng đã được cập nhật để hỗ trợ chế độ Dark/Light Mode, sử dụng `useColorModeValue` từ Chakra UI:

- **Trang chính:**

  - `Home.tsx`: Đã cập nhật các màu sắc của tất cả thành phần (card, text, button, v.v)

- **Trang xác thực:**

  - `Login.tsx`: Đã cập nhật màu sắc và bố cục
  - `Register.tsx`: Đã cập nhật màu sắc và bố cục

- **Trang sự kiện:**

  - `EventDetail.tsx`: Đã cập nhật UI hoàn toàn với hỗ trợ Dark/Light mode
  - `SearchResults.tsx`: Đã cập nhật bố cục tìm kiếm
  - `CreateEvent.tsx`: Đã cập nhật form tạo sự kiện
  - `Checkout.tsx`: Đã cập nhật giao diện thanh toán

- **Components:**
  - `EventReview.tsx`: Đã cải tiến giao diện nhập đánh giá và hiển thị đánh giá
  - `Header.tsx`: Đã cập nhật navigation bar
  - `Footer.tsx`: Đã cập nhật footer

### Cải thiện UI/UX

- **Hợp nhất Reviews và Comments**: Đã gộp Reviews và Comments thành một giao diện thống nhất để mang lại trải nghiệm người dùng tốt hơn và nhất quán.

- **EventReview Component**:

  - Đã sửa lỗi `currentUserId` không phải `currentUserID`
  - Thêm props `rating` và `reviewCount` để hiển thị số lượng đánh giá
  - Cải thiện giao diện form nhập đánh giá với hiệu ứng và gợi ý theo rating
  - Thêm hiển thị số ký tự và chức năng hiển thị gợi ý chất lượng
  - Thêm hiệu ứng loading khi đang gửi đánh giá

- **EventDetail Component**:
  - Cải thiện hoàn toàn bố cục hiển thị chi tiết sự kiện
  - Thêm layout responsive 2 cột
  - Điều chỉnh màu sắc để hỗ trợ Dark/Light mode
  - Hiển thị chi tiết sự kiện rõ ràng hơn

## Cấu trúc dự án

```
eventhub/
├── client/                # Frontend Next.js application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable components
│       │   ├── events/    # Event-related components
│       │   ├── layout/    # Layout components
│       │   └── ui/        # UI components
│       ├── pages/         # Application pages
│       │   ├── auth/      # Authentication pages
│       │   ├── events/    # Event pages
│       │   └── ...        # Other pages
│       ├── utils/         # Utility functions
│       └── styles/        # Global styles
├── server/                # Backend code (API, etc.)
└── ...
```

## Hướng dẫn phát triển

1. **Cài đặt dependencies:**

   ```bash
   pnpm install
   ```

2. **Chạy môi trường development:**

   ```bash
   pnpm run dev
   ```

3. **Build cho production:**
   ```bash
   pnpm run build
   ```

## Dark/Light Mode

Chế độ Dark/Light Mode được triển khai sử dụng Chakra UI's `useColorModeValue`. Người dùng có thể chuyển đổi giữa Dark và Light thông qua nút ở header và thiết lập sẽ được lưu trên trình duyệt.

```tsx
// Ví dụ: sử dụng useColorModeValue
const bgColor = useColorModeValue("white", "gray.800");
const textColor = useColorModeValue("gray.800", "white");
const borderColor = useColorModeValue("gray.200", "gray.700");
```

## Review & Comments

Component `EventReview` hiện hỗ trợ tốt hơn cho việc hiển thị đánh giá và bình luận, với UI cải tiến và phù hợp với cả Dark/Light mode.

## Demo tính năng

Đăng ký và đăng nhập vào hệ thống, sau đó khám phá các sự kiện, đọc đánh giá chi tiết và tham gia các sự kiện ưa thích. Hưởng thụ trải nghiệm tương tự nhau dù ở chế độ sáng hay tối!

---

Phát triển bởi nhóm EventHub.
