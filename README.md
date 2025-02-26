# EventHub - Nền tảng Sự kiện

## Tóm tắt cập nhật

### Dark/Light Mode

Toàn bộ dự án đã được cập nhật để hỗ trợ chế độ Dark/Light mode. Các thành phần sau đã được cập nhật:

#### Các trang chính:

- `Home.tsx`: Đã áp dụng biến màu sắc cho dark/light mode
- `EventDetail.tsx`: Đã cập nhật để sử dụng màu sắc theo chế độ hiện tại
- `SearchResults.tsx`: Đã triển khai đầy đủ biến màu sắc
- `CreateEvent.tsx`: Đã áp dụng biến màu sắc cho background và border
- `Checkout.tsx`: Đã triển khai đầy đủ biến màu sắc
- `Login.tsx` & `Register.tsx`: Đã triển khai dark/light mode

#### Các thành phần layout:

- `Header.tsx`: Đã triển khai đầy đủ biến màu sắc
- `Footer.tsx`: Đã triển khai các biến màu phù hợp

#### Components:

- `EventReview.tsx`: Đã cập nhật để hỗ trợ dark/light mode và sửa bugs

### Cải tiến UI/UX

1. **Gộp Reviews và Comments**:

   - Đã gộp thành phần Reviews và Comments thành một giao diện thống nhất
   - Cải thiện trải nghiệm người dùng bằng cách tránh phân chia không cần thiết
   - Phù hợp hơn với bản chất của các đánh giá và bình luận

2. **Sửa lỗi trong EventReview component**:
   - Sửa lỗi sai chính tả trong tên property 'currentUserId'
   - Thêm các props rating và reviewCount để hỗ trợ hiển thị đánh giá tổng quan
   - Thêm xử lý dark/light mode cho tất cả các phần tử UI

## Cấu trúc dự án

```
client/
├── src/
│   ├── components/     # Các thành phần UI có thể tái sử dụng
│   ├── pages/          # Các trang chính của ứng dụng
│   └── utils/          # Các tiện ích và hàm hỗ trợ
```

## Hướng dẫn phát triển

1. **Cài đặt các dependencies**:

   ```
   pnpm install
   ```

2. **Chạy môi trường phát triển**:

   ```
   pnpm dev
   ```

3. **Build cho production**:
   ```
   pnpm build
   ```
