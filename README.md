# EventHub - Nền tảng tìm kiếm và tham gia sự kiện

EventHub là một nền tảng toàn diện cho phép người dùng tạo, quản lý và tham gia các sự kiện. Dự án này được xây dựng với NextJS và cung cấp giao diện người dùng hiện đại với hỗ trợ chế độ Dark/Light Mode.

## Các cập nhật mới thực hiện

### Trang Home.tsx

- Đã thêm tính năng cho phép click vào các sự kiện nổi bật để xem chi tiết
- Các thẻ sự kiện (event card) giờ đây sẽ dẫn đến trang chi tiết sự kiện tương ứng (/events/:id)
- Đã thêm styling `textDecoration: "none"` để tránh hiển thị gạch chân khi sử dụng Link

### Trang SearchResults.tsx

- Đã đồng bộ hóa giao diện với trang Home.tsx
- Thay thế component EventCard bằng CustomEventCard giống với component được sử dụng ở trang Home
- Cải thiện cách hiển thị danh mục (categories):
  - Đã cấu trúc lại dữ liệu categories thành mảng các đối tượng với id và name
  - Thêm các danh mục mới: sports, tech, education, health, art, business
  - Thêm function getCategoryName để dễ dàng hiển thị tên danh mục từ id
- Đồng bộ hóa cách hiển thị event card, style và màu sắc giữa các trang
- Các thẻ event giờ đây đều có thể click vào để xem chi tiết

## Cấu trúc đường dẫn

- Trang chủ: `/`
- Danh sách sự kiện: `/events`
- Chi tiết sự kiện: `/events/:id`
- Tìm kiếm sự kiện: `/events?keyword=xxx&location=xxx&category=xxx`

## Hướng dẫn sử dụng

- Trang chủ: Xem các sự kiện nổi bật, duyệt theo danh mục phổ biến
- Trang kết quả tìm kiếm: Tìm kiếm và lọc sự kiện theo từ khóa, địa điểm và danh mục
- Trang chi tiết: Xem thông tin chi tiết về một sự kiện cụ thể

## Các tính năng chính

- Hiển thị danh sách sự kiện
- Tìm kiếm sự kiện theo từ khóa
- Lọc theo địa điểm, danh mục, giá (miễn phí/có phí)
- Phân trang kết quả tìm kiếm
- Giao diện responsive (hỗ trợ desktop và mobile)

## Cập nhật mới nhất

### Cải thiện cấu trúc đường dẫn

Chúng tôi đã cập nhật cấu trúc đường dẫn trong ứng dụng để đảm bảo tính nhất quán và trải nghiệm người dùng tốt hơn:

- **/events**: Hiển thị tất cả các sự kiện
- **/events/[event_id]**: Hiển thị chi tiết một sự kiện cụ thể
- **/categories**: Hiển thị tất cả các danh mục sự kiện (conference, workshop, concert...)
- **/categories/[category_name]**: Hiển thị tất cả sự kiện thuộc một danh mục cụ thể

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

# EventHub - Sự kiện đã lưu

## Tổng quan chức năng "Sự kiện đã lưu"

Chức năng "Sự kiện đã lưu" cho phép người dùng lưu lại các sự kiện họ quan tâm để xem lại sau. Đây là một tính năng tiện lợi giúp người dùng theo dõi và quản lý danh sách sự kiện mà họ quan tâm.

## Các tính năng chính

1. **Lưu sự kiện**: Từ trang chi tiết sự kiện, người dùng có thể nhấn vào nút trái tim để lưu sự kiện.
2. **Xem danh sách đã lưu**: Người dùng có thể truy cập trang "Sự kiện đã lưu" từ menu người dùng để xem tất cả các sự kiện đã lưu.
3. **Tìm kiếm và lọc**: Trong trang "Sự kiện đã lưu", người dùng có thể tìm kiếm theo tên hoặc lọc theo thể loại.
4. **Hủy lưu**: Người dùng có thể dễ dàng hủy lưu sự kiện từ trang danh sách hoặc từ trang chi tiết sự kiện.

## Cách sử dụng

1. **Lưu sự kiện**:

   - Truy cập trang chi tiết sự kiện
   - Nhấn vào biểu tượng trái tim ở góc trên bên phải
   - Một thông báo xác nhận sẽ hiển thị khi sự kiện được lưu thành công

2. **Xem sự kiện đã lưu**:

   - Nhấn vào avatar người dùng ở góc trên bên phải
   - Chọn "Sự kiện đã lưu" từ menu
   - Danh sách sự kiện đã lưu sẽ hiển thị

3. **Tìm kiếm và lọc**:

   - Sử dụng thanh tìm kiếm ở đầu trang "Sự kiện đã lưu"
   - Chọn thể loại từ dropdown để lọc danh sách

4. **Hủy lưu sự kiện**:
   - Từ trang danh sách đã lưu: Nhấn vào biểu tượng trái tim trên card sự kiện
   - Từ trang chi tiết: Nhấn vào biểu tượng trái tim đã được kích hoạt
