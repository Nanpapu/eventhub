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

### Common Components

#### 1. SearchBar Component

**Chức năng chính:**

- Tìm kiếm sự kiện theo từ khóa, địa điểm, danh mục và các bộ lọc khác
- Hỗ trợ tìm kiếm cơ bản và nâng cao
- Lưu và áp dụng các bộ lọc

**Props và State:**

```typescript
interface SearchBarProps {
  categories?: Category[];
  locations?: Location[];
  keyword: string;
  setKeyword: (value: string) => void;
  location?: string;
  setLocation?: (value: string) => void;
  category?: string;
  setCategory?: (value: string) => void;
  showFreeOnly?: boolean;
  setShowFreeOnly?: (value: boolean) => void;
  showPaidOnly?: boolean;
  setShowPaidOnly?: (value: boolean) => void;
  onSearch: () => void;
  onReset: () => void;
  showLocationFilter?: boolean;
  showCategoryFilter?: boolean;
  showPriceFilter?: boolean;
  compact?: boolean;
  appliedFilters?: {
    location?: string;
    category?: string;
    showFreeOnly?: boolean;
    showPaidOnly?: boolean;
  };
  getCategoryName?: (id: string) => string;
}
```

**Event Handlers:**

- `applyFilters()`: Áp dụng các bộ lọc tìm kiếm
- `resetTempFilters()`: Đặt lại các bộ lọc
- `handleKeyPress()`: Xử lý khi người dùng nhấn Enter

#### 2. Layout Components

**Header Component:**

- Hiển thị menu, logo và các chức năng chính
- Quản lý thanh tìm kiếm
- Hiển thị menu người dùng (đăng nhập/đăng ký/profile)
- Hiển thị notifications
- Hỗ trợ responsive

**Footer Component:**

- Hiển thị thông tin liên hệ và navigation links
- Hiển thị các liên kết mạng xã hội
- Hiển thị newsletter signup
- Hiển thị thông tin bản quyền

**MainLayout Component:**

- Container bao bọc Header, Footer và nội dung chính
- Quản lý spacing và layout chung

#### 3. Utility Components

**DateDisplay Component:**

- Định dạng và hiển thị ngày tháng
- Hỗ trợ nhiều format và locale

**CurrencyDisplay Component:**

- Định dạng và hiển thị giá tiền
- Hỗ trợ nhiều loại tiền tệ

**NumberDisplay Component:**

- Định dạng và hiển thị số
- Hỗ trợ định dạng phân cách, làm tròn

**ColorModeToggle Component:**

- Chuyển đổi giữa chế độ sáng/tối
- Lưu trữ cài đặt người dùng

**LanguageSwitcher Component:**

- Chuyển đổi ngôn ngữ ứng dụng
- Tích hợp với LanguageContext

### Event Components

#### 1. EventCard Component

**Chức năng chính:**

- Hiển thị thông tin tóm tắt của một sự kiện
- Hiển thị hình ảnh, tiêu đề, mô tả ngắn
- Hiển thị ngày, giờ, địa điểm
- Hiển thị badge cho loại sự kiện và giá

**Props:**

```typescript
interface EventCardProps {
  event: EventType;
}

interface EventType {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
}
```

#### 2. EventReview Component

**Chức năng chính:**

- Hiển thị và quản lý đánh giá cho sự kiện
- Cho phép thêm đánh giá mới
- Hiển thị đánh giá trung bình
- Phân trang và lọc đánh giá

#### 3. TicketDetails Component

**Chức năng chính:**

- Hiển thị thông tin chi tiết về các loại vé
- Cho phép chọn số lượng vé
- Hiển thị tổng giá tiền
- Kiểm tra số lượng vé còn lại

### User Components

#### 1. MyTickets Component

**Chức năng chính:**

- Hiển thị danh sách vé đã mua của người dùng
- Phân loại theo sắp tới, đã qua, đã hủy
- Hiển thị chi tiết vé và QR code
- Cho phép tải về vé

#### 2. EventManagement Component

**Chức năng chính:**

- Quản lý các sự kiện đã tạo bởi người dùng
- Cho phép chỉnh sửa, xóa sự kiện
- Hiển thị thống kê cơ bản về số người tham dự
- Quản lý các sự kiện đã lưu

**State và Functions:**

```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  organizer: string;
  isOwner?: boolean;
  participants?: number;
}

// Event handlers
const handleSearch = () => {...};
const resetFilters = () => {...};
const handleDeleteEvent = (eventId: number) => {...};
const handleUnsaveEvent = (eventId: number) => {...};
```

#### 3. UserSettings Component

**Chức năng chính:**

- Quản lý thông tin cá nhân và cài đặt tài khoản
- Đổi mật khẩu
- Cập nhật ảnh đại diện
- Quản lý email và thông báo
- Quản lý thanh toán và billing

### Authentication Pages

#### 1. Login Page

**Chức năng chính:**

- Form đăng nhập với email và mật khẩu
- Đăng nhập với tài khoản mạng xã hội (Google, Facebook)
- Lưu trạng thái đăng nhập (Remember me)
- Quên mật khẩu

**Form và Validation:**

```typescript
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**API Calls:**

- `login(email, password)`: Xác thực người dùng
- `loginWithSocial(provider)`: Đăng nhập với mạng xã hội
- `requestPasswordReset(email)`: Yêu cầu đặt lại mật khẩu

#### 2. Register Page

**Chức năng chính:**

- Form đăng ký tài khoản mới
- Xác nhận email
- Điều khoản sử dụng
- Đăng ký với tài khoản mạng xã hội

**Form và Validation:**

```typescript
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}
```

**API Calls:**

- `register(userData)`: Đăng ký tài khoản mới
- `verifyEmail(token)`: Xác nhận email
- `registerWithSocial(provider)`: Đăng ký với mạng xã hội

### Information Pages

#### 1. AboutUs Page

**Chức năng chính:**

- Giới thiệu về nền tảng EventHub
- Giới thiệu về đội ngũ phát triển
- Tầm nhìn và sứ mệnh
- Lịch sử phát triển

#### 2. HelpCenter Page

**Chức năng chính:**

- FAQ (Câu hỏi thường gặp)
- Hướng dẫn sử dụng
- Form liên hệ hỗ trợ
- Tìm kiếm thông tin hỗ trợ

#### 3. BecomeOrganizer Page

**Chức năng chính:**

- Thông tin về việc trở thành nhà tổ chức
- Lợi ích và đặc quyền
- Hướng dẫn đăng ký
- Form đăng ký làm nhà tổ chức

#### 4. PrivacyPolicy & TermsOfService Pages

**Chức năng chính:**

- Trình bày các điều khoản pháp lý
- Chính sách bảo mật
- Điều khoản sử dụng
- Chính sách hoàn tiền và hủy vé

### Checkout Components

#### 1. CheckoutForm Component

**Chức năng chính:**

- Form thanh toán và xác nhận mua vé
- Hiển thị thông tin sự kiện
- Hiển thị thông tin vé đã chọn
- Nhập thông tin người mua
- Xử lý thanh toán và xác nhận đơn hàng

**Các Thành Phần Chính:**

- Personal Information Form
- Ticket Summary
- Payment Method Selection
- Order Confirmation

### Context và State Management

#### 1. LanguageContext

**Chức năng chính:**

- Quản lý ngôn ngữ hiện tại của ứng dụng
- Cung cấp các hàm chuyển đổi ngôn ngữ
- Lưu trữ cài đặt ngôn ngữ của người dùng

#### 2. AuthContext (cần triển khai)

**Chức năng chính:**

- Quản lý trạng thái đăng nhập
- Cung cấp thông tin người dùng hiện tại
- Xử lý đăng nhập/đăng xuất
- Lưu trữ token xác thực

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
- CategoryGrid: Hiển thị các danh mục sự kiện
- PromoSection: Hiển thị các khuyến mãi và tính năng nổi bật

### Tìm kiếm (SearchResults)

**Chức năng chính:**

- Tìm kiếm sự kiện với nhiều bộ lọc
- Sắp xếp kết quả theo nhiều tiêu chí
- Hiển thị kết quả dưới dạng grid hoặc list

**Components:**

- FilterSidebar: Cung cấp bộ lọc cho tìm kiếm (danh mục, giá, ngày, địa điểm)
- SortBar: Cho phép sắp xếp kết quả
- EventList/EventGrid: Hiển thị danh sách sự kiện
- Pagination: Phân trang kết quả tìm kiếm

**API Calls:**

- `searchEvents(params)`: Tìm kiếm sự kiện với các tham số
- `getEventsByCategory(categoryId)`: Lấy sự kiện theo danh mục

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
- ShareButtons: Chia sẻ sự kiện lên mạng xã hội

**API Calls:**

- `getEventDetails(eventId)`: Lấy thông tin chi tiết sự kiện
- `getEventReviews(eventId)`: Lấy đánh giá cho sự kiện
- `saveEvent(eventId)`: Lưu sự kiện vào danh sách yêu thích
- `getRelatedEvents(eventId)`: Lấy các sự kiện liên quan

### Tạo sự kiện (CreateEvent)

**Chức năng chính:**

- Form tạo sự kiện mới
- Upload hình ảnh
- Quản lý các loại vé
- Cài đặt thời gian và địa điểm
- Xem trước sự kiện

**Form Validations:**

- Kiểm tra các trường bắt buộc
- Kiểm tra định dạng ngày tháng
- Kiểm tra giá vé
- Kiểm tra số lượng vé

**API Calls:**

- `createEvent(eventData)`: Tạo sự kiện mới
- `updateEvent(eventId, eventData)`: Cập nhật sự kiện hiện có
- `uploadEventImage(file)`: Upload hình ảnh sự kiện

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
- OrderConfirmation: Xác nhận đơn hàng

**Form Validations:**

- Kiểm tra thông tin cá nhân
- Kiểm tra thông tin thanh toán
- Xác nhận điều khoản sử dụng

**API Calls:**

- `createOrder(orderData)`: Tạo đơn hàng mới
- `processPayment(paymentData)`: Xử lý thanh toán
- `sendConfirmationEmail(email, orderDetails)`: Gửi email xác nhận

### Quản lý sự kiện (Dashboard)

**Chức năng chính:**

- Xem danh sách sự kiện đã tạo
- Quản lý người tham dự
- Xem thống kê và phân tích
- Check-in người tham dự

**Components:**

- EventList: Danh sách sự kiện đã tạo
- AttendeesList: Danh sách người tham dự
- EventStats: Thống kê về sự kiện
- CheckInForm: Form check-in người tham dự

**API Calls:**

- `getOrganizerEvents(userId)`: Lấy sự kiện của ban tổ chức
- `getEventAttendees(eventId)`: Lấy danh sách người tham dự
- `getEventStats(eventId)`: Lấy thống kê sự kiện
- `checkInAttendee(eventId, ticketId)`: Check-in người tham dự

### Thông báo (Notifications)

**Chức năng chính:**

- Hiển thị thông báo cho người dùng
- Đánh dấu thông báo đã đọc
- Phân loại thông báo

**Components:**

- NotificationList: Danh sách thông báo
- NotificationItem: Hiển thị một thông báo
- NotificationBadge: Hiển thị số thông báo chưa đọc

**API Calls:**

- `getUserNotifications(userId)`: Lấy thông báo của người dùng
- `markNotificationAsRead(notificationId)`: Đánh dấu thông báo đã đọc
- `markAllNotificationsAsRead(userId)`: Đánh dấu tất cả thông báo đã đọc

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
