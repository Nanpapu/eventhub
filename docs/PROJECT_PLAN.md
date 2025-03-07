# EventHub Project Plan

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Phần 1: Phân tích cấu trúc dự án](#phần-1-phân-tích-cấu-trúc-dự-án)
- [Phần 2: Phân tích chi tiết Components và tính năng](#phần-2-phân-tích-chi-tiết-components-và-tính-năng)
- [Phần 3: Cập nhật mô hình Database và Timeline](#phần-3-cập-nhật-mô-hình-database-và-timeline)

## Giới thiệu

EventHub là một nền tảng quản lý sự kiện toàn diện, cho phép người dùng tìm kiếm, đặt vé và tổ chức các sự kiện. Tài liệu này cập nhật kế hoạch dự án dựa trên tình hình hiện tại, tập trung vào việc phát triển Backend.

## Phần 1: Phân tích cấu trúc dự án

### Cấu trúc thư mục Client (Frontend)

```
client/src/
├── app/                  # App configuration
├── assets/               # Static assets
├── components/           # Reusable UI components
│   ├── checkout/         # Components for checkout flow
│   ├── common/           # Shared components
│   ├── events/           # Event-related components
│   ├── layout/           # Layout components
│   ├── notification/     # Notification components
│   └── user/             # User-related components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── locales/              # i18n translations
├── pages/                # Main application pages
│   ├── auth/             # Authentication pages
│   ├── categories/       # Category pages
│   ├── events/           # Event pages
│   ├── info/             # Information pages
│   ├── organizer/        # Organizer dashboard pages
│   └── user/             # User dashboard pages
├── services/             # API and service integrations
└── utils/                # Utility functions
```

### Điều hướng ứng dụng (routes.tsx)

Ứng dụng Frontend được tổ chức với các routes chính:

1. **Trang chủ và Tìm kiếm**

   - `/` - Trang chủ
   - `/events` và `/search` - Tìm kiếm sự kiện

2. **Quản lý người dùng**

   - `/login` - Đăng nhập
   - `/register` - Đăng ký
   - `/profile` - Hồ sơ người dùng
   - `/my-tickets` - Vé đã mua
   - `/saved-events` - Sự kiện đã lưu
   - `/notifications` - Thông báo

3. **Chi tiết và Mua vé sự kiện**

   - `/events/:id` - Chi tiết sự kiện
   - `/events/:eventId/checkout` - Thanh toán

4. **Quản lý sự kiện**

   - `/create-event` - Tạo sự kiện mới
   - `/my-events` - Sự kiện đã tạo
   - `/dashboard` - Bảng điều khiển

5. **Quản lý sự kiện cho Ban tổ chức**

   - `/organizer/events/:eventId/attendees` - Người tham dự
   - `/organizer/events/:eventId/check-in` - Check-in
   - `/organizer/events/:eventId/analytics` - Phân tích

6. **Trang thông tin**
   - `/about`, `/privacy`, `/terms`, `/help`, v.v.

### Cấu trúc thư mục Server (Backend)

```
server/src/
├── config/               # Cấu hình ứng dụng
├── controllers/          # Xử lý logic nghiệp vụ
├── interfaces/           # TypeScript interfaces
├── middlewares/          # Middleware functions
├── models/               # MongoDB schemas
├── routes/               # API endpoints
├── services/             # Service layer
├── utils/                # Utility functions
└── validations/          # Input validation
```

## Phần 2: Phân tích chi tiết Components và tính năng

### Trang chủ (Home)

**Chức năng chính:**

- Hiển thị banner chính với tìm kiếm sự kiện
- Hiển thị các danh mục sự kiện nổi bật
- Hiển thị các sự kiện sắp tới
- Hiển thị các sự kiện phổ biến
- Hiển thị CTA để tạo sự kiện mới

**Components:**

- EventCard: Hiển thị thông tin tóm tắt về sự kiện (hình ảnh, tiêu đề, mô tả, ngày, địa điểm, giá)
- SearchBar: Cho phép tìm kiếm sự kiện theo từ khóa, địa điểm, ngày

### Tìm kiếm (SearchResults)

**Chức năng chính:**

- Tìm kiếm sự kiện với nhiều bộ lọc
- Sắp xếp kết quả theo nhiều tiêu chí
- Hiển thị kết quả dưới dạng grid hoặc list

**Components:**

- FilterSidebar: Cung cấp bộ lọc cho tìm kiếm (danh mục, giá, ngày, địa điểm)
- SortBar: Cho phép sắp xếp kết quả
- EventList/EventGrid: Hiển thị danh sách sự kiện

### Chi tiết sự kiện (EventDetail)

**Chức năng chính:**

- Hiển thị thông tin chi tiết về sự kiện
- Cho phép đăng ký/mua vé
- Hiển thị đánh giá và bình luận
- Hiển thị sự kiện liên quan
- Lưu sự kiện vào danh sách yêu thích

**Components:**

- EventHeader: Hiển thị tiêu đề, hình ảnh, thông tin cơ bản
- TicketSelection: Cho phép chọn và mua vé
- EventDescription: Hiển thị mô tả chi tiết
- EventReviews: Hiển thị đánh giá và bình luận
- RelatedEvents: Hiển thị sự kiện liên quan

### Tạo sự kiện (CreateEvent)

**Chức năng chính:**

- Form tạo sự kiện mới
- Upload hình ảnh
- Quản lý các loại vé
- Cài đặt thời gian và địa điểm
- Xem trước sự kiện

**Model dữ liệu:**

```typescript
interface EventFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  capacity: number;
  isPaid: boolean;
  price?: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  image: string;
  tags: string[];
}
```

### Thanh toán (Checkout)

**Chức năng chính:**

- Chọn loại vé và số lượng
- Nhập thông tin người mua
- Xử lý thanh toán
- Xác nhận đơn hàng

**Components:**

- CheckoutForm: Form nhập thông tin và thanh toán
- TicketSummary: Tóm tắt thông tin vé đã chọn
- PaymentOptions: Các phương thức thanh toán

### Quản lý sự kiện (Dashboard)

**Chức năng chính:**

- Xem danh sách sự kiện đã tạo
- Quản lý người tham dự
- Xem thống kê và phân tích
- Check-in người tham dự

### Trang người dùng (Profile)

**Chức năng chính:**

- Hiển thị thông tin cá nhân
- Quản lý vé đã mua
- Xem sự kiện đã lưu
- Xem thông báo
- Cài đặt tài khoản

## Phần 3: Cập nhật mô hình Database và Timeline

### Mô hình Database (MongoDB)

Dựa trên interfaces được sử dụng trong Frontend, chúng ta cần thiết kế các schema sau cho MongoDB:

1. **User Schema**

```typescript
interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: "user" | "organizer" | "admin";
  savedEvents: string[]; // Reference to Event IDs
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Event Schema**

```typescript
interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  capacity: number;
  isPaid: boolean;
  price?: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
  }[];
  image: string;
  tags: string[];
  organizer: string; // Reference to User ID
  attendees: string[]; // Reference to User IDs
  status: "draft" | "published" | "cancelled" | "completed";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
```

3. **Ticket Schema**

```typescript
interface Ticket {
  _id: string;
  eventId: string; // Reference to Event ID
  userId: string; // Reference to User ID
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  status: "reserved" | "paid" | "cancelled" | "used";
  paymentId?: string; // Reference to Payment ID
  purchaseDate: Date;
  checkInDate?: Date;
}
```

4. **Payment Schema**

```typescript
interface Payment {
  _id: string;
  userId: string; // Reference to User ID
  eventId: string; // Reference to Event ID
  ticketId: string; // Reference to Ticket ID
  amount: number;
  method: "credit_card" | "paypal" | "bank_transfer";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

5. **Review Schema**

```typescript
interface Review {
  _id: string;
  userId: string; // Reference to User ID
  eventId: string; // Reference to Event ID
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
```

6. **Notification Schema**

```typescript
interface Notification {
  _id: string;
  userId: string; // Reference to User ID
  type: "event_reminder" | "ticket_purchase" | "event_update" | "system";
  message: string;
  relatedId?: string; // Could be eventId, ticketId, etc.
  isRead: boolean;
  createdAt: Date;
}
```

### Relationships

1. **User - Event (One-to-Many)**

   - Một User có thể tạo nhiều Event
   - Mỗi Event có một Organizer (User)

2. **User - Ticket (One-to-Many)**

   - Một User có thể mua nhiều Ticket
   - Mỗi Ticket thuộc về một User

3. **Event - Ticket (One-to-Many)**

   - Một Event có thể có nhiều Ticket
   - Mỗi Ticket thuộc về một Event

4. **User - Notification (One-to-Many)**

   - Một User có thể có nhiều Notification
   - Mỗi Notification thuộc về một User

5. **Event - Review (One-to-Many)**
   - Một Event có thể có nhiều Review
   - Mỗi Review thuộc về một Event

### Timeline phát triển Backend

1. **Sprint 1: Cài đặt cơ bản (1 tuần)**

   - Thiết lập project Node.js với Express và MongoDB
   - Cài đặt các middlewares cần thiết
   - Thiết kế và triển khai các schema MongoDB

2. **Sprint 2: Authentication & User Management (1 tuần)**

   - Đăng ký, đăng nhập, quản lý profile
   - JWT Authentication
   - Role-based access control

3. **Sprint 3: Event Management (2 tuần)**

   - CRUD operations cho Event
   - Upload và quản lý hình ảnh
   - Tìm kiếm và filter sự kiện

4. **Sprint 4: Ticket & Payment (2 tuần)**

   - Quản lý loại vé
   - Hệ thống đặt vé
   - Tích hợp payment gateway

5. **Sprint 5: Notifications & Reviews (1 tuần)**

   - Hệ thống notification
   - Đánh giá và bình luận sự kiện

6. **Sprint 6: Organizer Dashboard (1 tuần)**

   - Quản lý người tham dự
   - Hệ thống check-in
   - Thống kê và báo cáo

7. **Sprint 7: Testing & Optimization (1 tuần)**

   - Unit testing và integration testing
   - Performance optimization
   - Security audit

8. **Sprint 8: Deployment & Documentation (1 tuần)**
   - Triển khai lên production
   - Viết documentation API
   - Tạo môi trường CI/CD

### Chiến lược testing

1. **Unit Testing**

   - Test các hàm helpers, utilities
   - Test các service functions
   - Test các controller methods

2. **Integration Testing**

   - Test các API endpoints
   - Test các database operations
   - Test các business workflows

3. **End-to-End Testing**

   - Test luồng người dùng hoàn chỉnh
   - Test tích hợp Frontend và Backend

4. **Performance Testing**
   - Test thời gian phản hồi của API
   - Test khả năng chịu tải
   - Test memory usage
