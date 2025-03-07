# EventHub - Tài liệu dự án

Chào mừng bạn đến với tài liệu dự án EventHub. Đây là bộ tài liệu toàn diện cho việc phát triển nền tảng quản lý sự kiện EventHub.

## Giới thiệu

EventHub là một nền tảng quản lý sự kiện toàn diện, cho phép người dùng tìm kiếm, đặt vé và tổ chức các sự kiện. Dự án được chia thành hai phần chính: Frontend (client) và Backend (server).

## Nội dung tài liệu

Tài liệu được tổ chức thành các file sau:

1. [**Tổng quan**](./00-OVERVIEW.md) - Giới thiệu tổng quan về dự án và cấu trúc tài liệu

2. [**Cấu trúc dự án**](./01-PROJECT_STRUCTURE.md) - Mô tả chi tiết cấu trúc thư mục và tổ chức code

3. [**Components và tính năng UI**](./02-COMPONENTS.md) - Phân tích chi tiết các components và UI

4. [**Tính năng chính**](./03-FEATURES.md) - Mô tả các tính năng chính của ứng dụng

5. [**Mô hình Database**](./04-DATABASE.md) - Thiết kế database MongoDB và mối quan hệ

6. [**API Endpoints**](./05-API_ENDPOINTS.md) - Mô tả chi tiết các API Endpoints

7. [**Kế hoạch phát triển**](./06-TIMELINE.md) - Timeline và kế hoạch triển khai

## Tổng quan kỹ thuật

### Frontend:

- **Ngôn ngữ**: TypeScript
- **Framework**: React
- **UI Library**: Chakra UI
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Routing**: React Router

### Backend:

- **Ngôn ngữ**: TypeScript
- **Framework**: Node.js + Express
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Payment Processing**: Stripe/PayPal

## Cách sử dụng tài liệu

### Dành cho developers:

- Bắt đầu với file 00-OVERVIEW.md để hiểu tổng quan
- Tìm hiểu cấu trúc dự án trong 01-PROJECT_STRUCTURE.md
- Frontend developers tập trung vào 02-COMPONENTS.md và 03-FEATURES.md
- Backend developers tập trung vào 04-DATABASE.md và 05-API_ENDPOINTS.md
- Tech lead và project manager tập trung vào 06-TIMELINE.md

### Dành cho designers:

- Tìm hiểu các components trong 02-COMPONENTS.md
- Hiểu các tính năng người dùng trong 03-FEATURES.md

### Dành cho testers:

- Tìm hiểu các tính năng cần test trong 03-FEATURES.md
- Xem chi tiết API trong 05-API_ENDPOINTS.md
- Tham khảo chiến lược testing trong 06-TIMELINE.md

## Các bước tiếp theo

1. **Phát triển Backend**: Thực hiện theo sprint plan trong file 06-TIMELINE.md
2. **Cập nhật và mở rộng tài liệu** khi có thay đổi trong quá trình phát triển
3. **Tích hợp Backend với Frontend** đã có

## Đóng góp

Nếu bạn muốn đóng góp vào tài liệu này, vui lòng:

1. Fork repository
2. Tạo branch mới
3. Thực hiện các thay đổi
4. Gửi Pull Request
