# Tính năng chính của EventHub

Tài liệu này mô tả chi tiết các tính năng chính của EventHub, từ góc độ người dùng và tương tác hệ thống.

## Trang chủ (Home)

**Chức năng chính:**

- Hiển thị banner chính với tìm kiếm sự kiện
- Hiển thị các danh mục sự kiện nổi bật
- Hiển thị các sự kiện sắp tới
- Hiển thị các sự kiện phổ biến
- Hiển thị CTA để tạo sự kiện mới

**Components:**

- EventCard: Hiển thị thông tin tóm tắt về sự kiện
- SearchBar: Cho phép tìm kiếm sự kiện theo từ khóa, địa điểm, ngày
- CategoryGrid: Hiển thị các danh mục sự kiện
- PromoSection: Hiển thị các khuyến mãi và tính năng nổi bật

**API Calls:**

- `getFeatureEvents()`: Lấy danh sách sự kiện nổi bật
- `getUpcomingEvents()`: Lấy danh sách sự kiện sắp tới
- `getPopularEvents()`: Lấy danh sách sự kiện phổ biến
- `getCategories()`: Lấy danh sách các danh mục sự kiện

## Tìm kiếm (SearchResults)

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
- `getLocations()`: Lấy danh sách các địa điểm phổ biến

**Filter Parameters:**

```typescript
interface SearchParams {
  keyword?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFree?: boolean;
  isPaid?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "date" | "price" | "popularity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
```

## Chi tiết sự kiện (EventDetail)

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
- `getTicketTypes(eventId)`: Lấy các loại vé cho sự kiện

## Tạo sự kiện (CreateEvent)

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
- `getCategories()`: Lấy danh sách các danh mục sự kiện

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

## Thanh toán (Checkout)

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
- `getTicketAvailability(eventId, ticketTypeId)`: Kiểm tra số lượng vé còn lại

**Model dữ liệu:**

```typescript
interface OrderData {
  eventId: string;
  userId: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod: string;
}
```

## Quản lý sự kiện (Dashboard)

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
- `exportAttendeesList(eventId)`: Xuất danh sách người tham dự

**Thống kê:**

- Số lượng vé đã bán
- Doanh thu
- Tỷ lệ tham dự
- Đánh giá trung bình

## Quản lý người dùng (User)

**Chức năng chính:**

- Xem và chỉnh sửa thông tin cá nhân
- Quản lý vé đã mua
- Quản lý sự kiện đã lưu
- Xem lịch sử đơn hàng
- Quản lý cài đặt tài khoản

**Components:**

- ProfileForm: Form chỉnh sửa thông tin cá nhân
- TicketsList: Danh sách vé đã mua
- SavedEventsList: Danh sách sự kiện đã lưu
- OrderHistory: Lịch sử đơn hàng
- AccountSettings: Cài đặt tài khoản

**API Calls:**

- `getUserProfile(userId)`: Lấy thông tin cá nhân
- `updateUserProfile(userId, userData)`: Cập nhật thông tin cá nhân
- `getUserTickets(userId)`: Lấy danh sách vé đã mua
- `getUserSavedEvents(userId)`: Lấy danh sách sự kiện đã lưu
- `getUserOrders(userId)`: Lấy lịch sử đơn hàng

## Đánh giá và Bình luận

**Chức năng chính:**

- Đánh giá sự kiện (1-5 sao)
- Thêm bình luận về sự kiện
- Hiển thị đánh giá trung bình
- Phân trang và lọc đánh giá

**Components:**

- ReviewForm: Form thêm đánh giá mới
- ReviewsList: Danh sách đánh giá
- RatingDisplay: Hiển thị đánh giá trung bình

**API Calls:**

- `createReview(reviewData)`: Tạo đánh giá mới
- `getEventReviews(eventId, params)`: Lấy đánh giá cho sự kiện
- `getEventRating(eventId)`: Lấy đánh giá trung bình của sự kiện

**Model dữ liệu:**

```typescript
interface ReviewData {
  userId: string;
  eventId: string;
  rating: number; // 1-5
  comment: string;
}
```

## Thông báo (Notifications)

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

**Loại thông báo:**

- Nhắc nhở sự kiện
- Xác nhận mua vé
- Cập nhật sự kiện
- Thông báo hệ thống
