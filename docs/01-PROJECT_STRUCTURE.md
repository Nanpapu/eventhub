# Cấu trúc dự án EventHub

## Cấu trúc thư mục Client (Frontend)

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

### Thư mục components/

- **checkout/**: Components liên quan đến quy trình thanh toán
- **common/**: Components dùng chung (buttons, inputs, cards, etc.)
- **events/**: Components liên quan đến display và quản lý sự kiện
- **layout/**: Components về layout (header, footer, sidebar, etc.)
- **notification/**: Components liên quan đến hệ thống thông báo
- **user/**: Components liên quan đến thông tin người dùng

### Thư mục pages/

- **auth/**: Trang đăng nhập, đăng ký
- **categories/**: Trang danh mục sự kiện
- **events/**: Trang sự kiện (chi tiết, tạo mới, search)
- **info/**: Trang thông tin (about, contact, etc.)
- **organizer/**: Trang dành cho nhà tổ chức sự kiện
- **user/**: Trang thông tin người dùng

## Điều hướng ứng dụng (routes.tsx)

```jsx
<Route path="/" element={<App />}>
  <Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/events" element={<SearchResults />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/events/:id" element={<EventDetail />} />
    <Route path="/events/:eventId/checkout" element={<Checkout />} />
    <Route path="/create-event" element={<CreateEvent />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/my-events" element={<MyEvents />} />
    <Route path="/my-tickets" element={<MyTickets />} />
    <Route path="/saved-events" element={<SavedEvents />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/user" element={<UserDashboard />} />
    <Route
      path="/organizer/events/:eventId/attendees"
      element={<EventAttendees />}
    />
    <Route
      path="/organizer/events/:eventId/check-in"
      element={<EventCheckIn />}
    />
    <Route
      path="/organizer/events/:eventId/analytics"
      element={<EventAnalytics />}
    />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsOfService />} />
    <Route path="/help" element={<HelpCenter />} />
    <Route path="/community" element={<Community />} />
    <Route path="/press" element={<PressKit />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/become-organizer" element={<BecomeOrganizer />} />
  </Route>
</Route>
```

### Routes chính

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
   - `/about`, `/privacy`, `/terms`, `/help`, etc.

## Cấu trúc thư mục Server (Backend)

```
server/src/
├── config/               # Cấu hình ứng dụng
│   ├── database.ts       # Kết nối MongoDB
│   ├── jwt.ts            # Cấu hình JWT
│   └── app.ts            # Cấu hình Express app
├── controllers/          # Xử lý logic nghiệp vụ
│   ├── userController.ts
│   ├── eventController.ts
│   ├── ticketController.ts
│   ├── paymentController.ts
│   ├── reviewController.ts
│   └── notificationController.ts
├── interfaces/           # TypeScript interfaces
│   ├── user.interface.ts
│   ├── event.interface.ts
│   ├── ticket.interface.ts
│   └── ...
├── middlewares/          # Middleware functions
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── upload.middleware.ts
│   └── validator.middleware.ts
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── Event.ts
│   ├── Ticket.ts
│   ├── Payment.ts
│   ├── Review.ts
│   └── Notification.ts
├── routes/               # API endpoints
│   ├── userRoutes.ts
│   ├── eventRoutes.ts
│   ├── ticketRoutes.ts
│   ├── paymentRoutes.ts
│   ├── reviewRoutes.ts
│   └── notificationRoutes.ts
├── services/             # Service layer
│   ├── userService.ts
│   ├── eventService.ts
│   ├── ticketService.ts
│   ├── paymentService.ts
│   ├── reviewService.ts
│   ├── notificationService.ts
│   ├── emailService.ts
│   └── uploadService.ts
├── utils/                # Utility functions
│   ├── logger.ts
│   ├── helpers.ts
│   └── constants.ts
├── validations/          # Input validation
│   ├── userValidation.ts
│   ├── eventValidation.ts
│   ├── ticketValidation.ts
│   └── ...
├── app.ts                # Entry point
└── server.ts             # Server initialization
```

### Controllers

Controllers xử lý requests và responses, gọi các services tương ứng để xử lý logic nghiệp vụ.

### Services

Services chứa các business logic, tương tác với database thông qua models.

### Models

Models định nghĩa các schemas MongoDB và cung cấp interface để tương tác với database.

### Routes

Routes định nghĩa các API endpoints và kết nối chúng với các controllers tương ứng.

### Middlewares

- **auth.middleware.ts**: Authentication và authorization
- **error.middleware.ts**: Xử lý lỗi chung
- **upload.middleware.ts**: Xử lý upload files
- **validator.middleware.ts**: Validate input data
