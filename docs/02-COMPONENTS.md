# Components và tính năng UI

Tài liệu này mô tả chi tiết các components UI của dự án EventHub.

## Common Components

### 1. SearchBar Component

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

### 2. Layout Components

#### Header Component

- Hiển thị menu, logo và các chức năng chính
- Quản lý thanh tìm kiếm
- Hiển thị menu người dùng (đăng nhập/đăng ký/profile)
- Hiển thị notifications
- Hỗ trợ responsive

#### Footer Component

- Hiển thị thông tin liên hệ và navigation links
- Hiển thị các liên kết mạng xã hội
- Hiển thị newsletter signup
- Hiển thị thông tin bản quyền

#### MainLayout Component

- Container bao bọc Header, Footer và nội dung chính
- Quản lý spacing và layout chung

### 3. Utility Components

#### DateDisplay Component

- Định dạng và hiển thị ngày tháng
- Hỗ trợ nhiều format và locale

#### CurrencyDisplay Component

- Định dạng và hiển thị giá tiền
- Hỗ trợ nhiều loại tiền tệ

#### NumberDisplay Component

- Định dạng và hiển thị số
- Hỗ trợ định dạng phân cách, làm tròn

#### ColorModeToggle Component

- Chuyển đổi giữa chế độ sáng/tối
- Lưu trữ cài đặt người dùng

#### LanguageSwitcher Component

- Chuyển đổi ngôn ngữ ứng dụng
- Tích hợp với LanguageContext

## Event Components

### 1. EventCard Component

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

### 2. TicketDetails Component

**Chức năng chính:**

- Hiển thị thông tin chi tiết về các loại vé
- Cho phép chọn số lượng vé
- Hiển thị tổng giá tiền
- Kiểm tra số lượng vé còn lại

## User Components

### 1. MyTickets Component

**Chức năng chính:**

- Hiển thị danh sách vé đã mua của người dùng
- Phân loại theo sắp tới, đã qua, đã hủy
- Hiển thị chi tiết vé và QR code
- Cho phép tải về vé

### 2. EventManagement Component

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

### 3. UserSettings Component

**Chức năng chính:**

- Quản lý thông tin cá nhân và cài đặt tài khoản
- Đổi mật khẩu
- Cập nhật ảnh đại diện
- Quản lý email và thông báo
- Quản lý thanh toán và billing

## Checkout Components

### 1. CheckoutForm Component

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

## Authentication Pages

### 1. Login Page

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

### 2. Register Page

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

## Information Pages

### 1. AboutUs Page

**Chức năng chính:**

- Giới thiệu về nền tảng EventHub
- Giới thiệu về đội ngũ phát triển
- Tầm nhìn và sứ mệnh
- Lịch sử phát triển

### 2. HelpCenter Page

**Chức năng chính:**

- FAQ (Câu hỏi thường gặp)
- Hướng dẫn sử dụng
- Form liên hệ hỗ trợ
- Tìm kiếm thông tin hỗ trợ

### 3. BecomeOrganizer Page

**Chức năng chính:**

- Thông tin về việc trở thành nhà tổ chức
- Lợi ích và đặc quyền
- Hướng dẫn đăng ký
- Form đăng ký làm nhà tổ chức

### 4. PrivacyPolicy & TermsOfService Pages

**Chức năng chính:**

- Trình bày các điều khoản pháp lý
- Chính sách bảo mật
- Điều khoản sử dụng
- Chính sách hoàn tiền và hủy vé

## Context và State Management

### 1. LanguageContext

**Chức năng chính:**

- Quản lý ngôn ngữ hiện tại của ứng dụng
- Cung cấp các hàm chuyển đổi ngôn ngữ
- Lưu trữ cài đặt ngôn ngữ của người dùng

### 2. AuthContext (cần triển khai)

**Chức năng chính:**

- Quản lý trạng thái đăng nhập
- Cung cấp thông tin người dùng hiện tại
- Xử lý đăng nhập/đăng xuất
- Lưu trữ token xác thực
