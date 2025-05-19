# Mô hình Database MongoDB

Tài liệu này mô tả chi tiết các schema MongoDB và mối quan hệ giữa chúng trong dự án EventHub.

## Schemas

### 1. User Schema

```typescript
interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: "user" | "organizer" | "admin";
  savedEvents: mongoose.Types.ObjectId[]; // Reference to Event IDs
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- email: unique
- role: 1

**Validations:**

- email: required, unique, valid email format
- password: required, min length 6
- name: required
- role: enum['user', 'organizer', 'admin']

**Methods:**

- comparePassword(candidatePassword): So sánh mật khẩu
- generateAuthToken(): Tạo JWT token

### 2. Event Schema

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
  maxTicketsPerPerson: number; // Số lượng vé tối đa mỗi người có thể mua
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
  organizer: mongoose.Types.ObjectId; // Reference to User ID
  attendees: mongoose.Types.ObjectId[]; // Reference to User IDs
  status: "draft" | "published" | "cancelled" | "completed";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- title: text
- description: text
- category: 1
- date: 1
- location: 1
- tags: 1
- organizer: 1
- status: 1

**Validations:**

- title: required, min length 5
- description: required
- category: required, enum
- date: required, date
- startTime: required
- endTime: required
- location: required
- address: required if !isOnline
- onlineUrl: required if isOnline
- capacity: required, min 1
- maxTicketsPerPerson: required, min 1, max = capacity
- price: required if isPaid && !ticketTypes
- ticketTypes: array, must have at least one if isPaid && !price
- image: required
- organizer: required, ObjectId

**Virtuals:**

- availableTickets: Tính số vé còn lại
- isAvailable: Kiểm tra sự kiện còn vé không
- hasStarted: Kiểm tra sự kiện đã bắt đầu chưa
- hasEnded: Kiểm tra sự kiện đã kết thúc chưa

### 3. Ticket Schema

```typescript
interface Ticket {
  _id: string;
  eventId: mongoose.Types.ObjectId; // Reference to Event ID
  userId: mongoose.Types.ObjectId; // Reference to User ID
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  status: "reserved" | "paid" | "cancelled" | "used";
  paymentId?: mongoose.Types.ObjectId; // Reference to Payment ID
  purchaseDate: Date;
  checkInDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- eventId: 1
- userId: 1
- status: 1
- purchaseDate: 1

**Validations:**

- eventId: required, ObjectId
- userId: required, ObjectId
- ticketTypeId: required
- ticketTypeName: required
- price: required, min 0
- quantity: required, min 1
- status: required, enum['reserved', 'paid', 'cancelled', 'used']
- purchaseDate: required

**Methods:**

- generateTicketQR(): Tạo QR code cho vé
- cancelTicket(): Hủy vé
- checkIn(): Check-in vé

### 4. Payment Schema

```typescript
interface Payment {
  _id: string;
  userId: mongoose.Types.ObjectId; // Reference to User ID
  eventId: mongoose.Types.ObjectId; // Reference to Event ID
  ticketId: mongoose.Types.ObjectId; // Reference to Ticket ID
  amount: number;
  method: "credit_card" | "paypal" | "bank_transfer";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- userId: 1
- eventId: 1
- ticketId: 1
- status: 1
- createdAt: 1

**Validations:**

- userId: required, ObjectId
- eventId: required, ObjectId
- ticketId: required, ObjectId
- amount: required, min 0
- method: required, enum['credit_card', 'paypal', 'bank_transfer']
- status: required, enum['pending', 'completed', 'failed', 'refunded']

**Methods:**

- processRefund(): Xử lý hoàn tiền
- generateReceipt(): Tạo hóa đơn

### 5. Notification Schema

```typescript
interface Notification {
  _id: string;
  userId: mongoose.Types.ObjectId; // Reference to User ID
  type: "event_reminder" | "ticket_purchase" | "event_update" | "system";
  message: string;
  relatedId?: string; // Could be eventId, ticketId, etc.
  isRead: boolean;
  createdAt: Date;
}
```

**Indexes:**

- userId: 1
- isRead: 1
- createdAt: -1

**Validations:**

- userId: required, ObjectId
- type: required, enum['event_reminder', 'ticket_purchase', 'event_update', 'system']
- message: required
- isRead: boolean, default: false

**Methods:**

- markAsRead(): Đánh dấu đã đọc

## Relationships

### 1. User - Event (One-to-Many)

- Một User có thể tạo nhiều Event (organizer)
- Mỗi Event có một Organizer (User)

```typescript
// User schema
savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]

// Event schema
organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
```

### 2. User - Ticket (One-to-Many)

- Một User có thể mua nhiều Ticket
- Mỗi Ticket thuộc về một User

```typescript
// Ticket schema
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```

### 3. Event - Ticket (One-to-Many)

- Một Event có thể có nhiều Ticket
- Mỗi Ticket thuộc về một Event

```typescript
// Ticket schema
eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
```

### 4. Ticket - Payment (One-to-One)

- Mỗi Ticket có thể có một Payment
- Mỗi Payment thuộc về một Ticket

```typescript
// Ticket schema
paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }

// Payment schema
ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true }
```

### 5. User - Notification (One-to-Many)

- Một User có thể có nhiều Notification
- Mỗi Notification thuộc về một User

```typescript
// Notification schema
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```

## Indexes và Query Optimization

### User Collection

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
```

### Event Collection

```javascript
db.events.createIndex({ title: "text", description: "text", tags: "text" });
db.events.createIndex({ category: 1 });
db.events.createIndex({ date: 1 });
db.events.createIndex({ location: 1 });
db.events.createIndex({ organizer: 1 });
db.events.createIndex({ status: 1 });
db.events.createIndex({ "ticketTypes.id": 1 });
```

### Ticket Collection

```javascript
db.tickets.createIndex({ eventId: 1 });
db.tickets.createIndex({ userId: 1 });
db.tickets.createIndex({ status: 1 });
db.tickets.createIndex({ purchaseDate: 1 });
```

### Payment Collection

```javascript
db.payments.createIndex({ userId: 1 });
db.payments.createIndex({ ticketId: 1 });
db.payments.createIndex({ status: 1 });
```

### Notification Collection

```javascript
db.notifications.createIndex({ userId: 1, isRead: 1 });
db.notifications.createIndex({ userId: 1, createdAt: -1 });
```

## Data Validation và Business Rules

1. **User Registration**

   - Email phải là duy nhất
   - Password phải được mã hóa (bcrypt)
   - Role mặc định là 'user'

2. **Event Creation**

   - Ngày sự kiện phải là thời gian trong tương lai
   - Nếu là sự kiện có phí, phải có price hoặc ít nhất một ticketType
   - Nếu là sự kiện online, phải có onlineUrl
   - Status mặc định là 'draft'

3. **Ticket Purchase**

   - Kiểm tra sự kiện còn vé không
   - Kiểm tra số lượng vé còn đủ không
   - Mặc định status là 'reserved', sau khi thanh toán chuyển thành 'paid'

4. **Payment Processing**

   - Cập nhật status của ticket khi payment thành công
   - Tạo notification khi payment thành công
   - Không cho phép mua vé nếu sự kiện đã kết thúc hoặc đã đầy

5. **Data Retention Rules**

   - Thông báo sẽ được lưu trữ trong 3 tháng
   - Payment records sẽ được lưu trữ trong 2 năm
   - User data sẽ được lưu trữ cho đến khi user yêu cầu xóa
