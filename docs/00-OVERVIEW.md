# EventHub Project - Tổng quan

## Giới thiệu

EventHub là một nền tảng quản lý sự kiện toàn diện, cho phép người dùng tìm kiếm, đặt vé và tổ chức các sự kiện. Tài liệu này tóm tắt kế hoạch phát triển dự án, đặc biệt tập trung vào phần Backend.

## Nội dung tài liệu

Tài liệu kế hoạch dự án được chia thành các phần sau:

1. **Cấu trúc dự án** - [01-PROJECT_STRUCTURE.md](./01-PROJECT_STRUCTURE.md)

   - Cấu trúc thư mục Frontend
   - Điều hướng ứng dụng (Routes)
   - Cấu trúc thư mục Backend

2. **Phân tích components và tính năng** - [02-COMPONENTS.md](./02-COMPONENTS.md)

   - Common Components
   - Event Components
   - User Components
   - Checkout Components
   - Authentication Pages
   - Information Pages
   - Context và State Management

3. **Tính năng chính** - [03-FEATURES.md](./03-FEATURES.md)

   - Trang chủ
   - Tìm kiếm sự kiện
   - Chi tiết sự kiện
   - Tạo sự kiện
   - Thanh toán
   - Quản lý người dùng
   - Đánh giá và Bình luận
   - Thông báo

4. **Mô hình Database** - [04-DATABASE.md](./04-DATABASE.md)

   - Schemas MongoDB
   - Relationships
   - Indexes
   - Validations

5. **API Endpoints** - [05-API_ENDPOINTS.md](./05-API_ENDPOINTS.md)

   - User API
   - Event API
   - Ticket API
   - Payment API
   - Review API
   - Notification API

6. **Kế hoạch phát triển** - [06-TIMELINE.md](./06-TIMELINE.md)
   - Sprint planning
   - Chiến lược testing
   - Deployment

## Tóm tắt công nghệ

### Frontend:

- React với TypeScript
- Chakra UI cho components
- React Router cho điều hướng
- React Hook Form cho quản lý forms
- Context API cho state management

### Backend:

- Node.js với Express
- TypeScript
- MongoDB với Mongoose
- JWT cho authentication
- Middlewares cho authorization
- API RESTful

## Hướng dẫn sử dụng tài liệu

- Dành cho Frontend Developers: Tập trung vào phần 1-3
- Dành cho Backend Developers: Tập trung vào phần 4-6
- Dành cho Team Lead: Xem toàn bộ tài liệu và kế hoạch phát triển

## Kết luận

Kế hoạch này cung cấp một cái nhìn tổng quan về dự án EventHub. Các file chi tiết trong thư mục `docs` sẽ cung cấp thông tin đầy đủ về từng khía cạnh của dự án.
