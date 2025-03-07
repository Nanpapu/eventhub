# API Endpoints

Tài liệu này mô tả chi tiết các API endpoints của backend EventHub.

## Authentication APIs

### 1. Đăng ký người dùng

**Endpoint:** `POST /api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**

- 201: Created
- 400: Bad Request
- 409: Conflict (Email already exists)

### 2. Đăng nhập

**Endpoint:** `POST /api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized

### 3. Đăng nhập với mạng xã hội

**Endpoint:** `POST /api/auth/social-login`

**Request:**

```json
{
  "provider": "google",
  "token": "oauth_token_from_provider"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here",
  "isNewUser": false
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized

### 4. Quên mật khẩu

**Endpoint:** `POST /api/auth/forgot-password`

**Request:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 404: Not Found

### 5. Đặt lại mật khẩu

**Endpoint:** `POST /api/auth/reset-password`

**Request:**

```json
{
  "token": "reset_token_from_email",
  "password": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized

## User APIs

### 1. Lấy thông tin người dùng

**Endpoint:** `GET /api/users/me`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "I'm a software developer",
    "role": "user"
  }
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized

### 2. Cập nhật thông tin người dùng

**Endpoint:** `PUT /api/users/me`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "name": "John Updated",
  "bio": "I'm a senior software developer",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Updated",
    "email": "john@example.com",
    "avatar": "https://example.com/new-avatar.jpg",
    "bio": "I'm a senior software developer",
    "role": "user"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized

### 3. Đổi mật khẩu

**Endpoint:** `PUT /api/users/change-password`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized

### 4. Lấy danh sách sự kiện đã lưu

**Endpoint:** `GET /api/users/saved-events`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "events": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "title": "Tech Conference 2023",
      "description": "A conference about technology",
      "date": "2023-09-15T09:00:00.000Z",
      "location": "New York",
      "image": "https://example.com/event.jpg",
      "category": "tech"
    }
  ]
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized

### 5. Lấy danh sách vé đã mua

**Endpoint:** `GET /api/users/tickets`

**Headers:**

- Authorization: Bearer {token}

**Query Parameters:**

- status: (optional) Filter by status (reserved, paid, cancelled, used)
- page: (optional) Page number
- limit: (optional) Items per page

**Response:**

```json
{
  "success": true,
  "tickets": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "eventId": "60d21b4667d0d8992e610c87",
      "event": {
        "title": "Tech Conference 2023",
        "date": "2023-09-15T09:00:00.000Z",
        "location": "New York",
        "image": "https://example.com/event.jpg"
      },
      "ticketTypeName": "VIP",
      "price": 100,
      "quantity": 2,
      "status": "paid",
      "purchaseDate": "2023-08-01T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "page": 1,
    "limit": 10
  }
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized

## Event APIs

### 1. Tạo sự kiện mới

**Endpoint:** `POST /api/events`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "title": "Tech Conference 2023",
  "description": "A conference about technology",
  "category": "tech",
  "date": "2023-09-15",
  "startTime": "09:00",
  "endTime": "18:00",
  "location": "New York",
  "address": "123 Main St, New York, NY",
  "isOnline": false,
  "capacity": 100,
  "isPaid": true,
  "ticketTypes": [
    {
      "name": "Standard",
      "price": 50,
      "quantity": 80
    },
    {
      "name": "VIP",
      "price": 100,
      "quantity": 20
    }
  ],
  "tags": ["tech", "conference", "2023"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Tech Conference 2023",
    "description": "A conference about technology",
    "category": "tech",
    "date": "2023-09-15T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "18:00",
    "location": "New York",
    "address": "123 Main St, New York, NY",
    "isOnline": false,
    "capacity": 100,
    "isPaid": true,
    "ticketTypes": [
      {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Standard",
        "price": 50,
        "quantity": 80,
        "quantitySold": 0
      },
      {
        "id": "60d21b4667d0d8992e610c91",
        "name": "VIP",
        "price": 100,
        "quantity": 20,
        "quantitySold": 0
      }
    ],
    "image": "https://example.com/default.jpg",
    "tags": ["tech", "conference", "2023"],
    "organizer": "60d21b4667d0d8992e610c85",
    "status": "draft"
  }
}
```

**Status Codes:**

- 201: Created
- 400: Bad Request
- 401: Unauthorized

### 2. Cập nhật sự kiện

**Endpoint:** `PUT /api/events/:id`

**Headers:**

- Authorization: Bearer {token}

**Request:** (Similar to create event, with optional fields)

**Response:**

```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Updated Tech Conference 2023",
    "description": "An updated conference about technology",
    "category": "tech",
    "date": "2023-09-20T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "19:00",
    "location": "New York",
    "address": "456 Main St, New York, NY",
    "isOnline": false,
    "capacity": 150,
    "isPaid": true,
    "ticketTypes": [
      {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Standard",
        "price": 60,
        "quantity": 100,
        "quantitySold": 0
      },
      {
        "id": "60d21b4667d0d8992e610c91",
        "name": "VIP",
        "price": 120,
        "quantity": 50,
        "quantitySold": 0
      }
    ],
    "image": "https://example.com/updated.jpg",
    "tags": ["tech", "conference", "2023", "updated"],
    "organizer": "60d21b4667d0d8992e610c85",
    "status": "draft"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 3. Đăng sự kiện

**Endpoint:** `PUT /api/events/:id/publish`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Event published successfully",
  "event": {
    "id": "60d21b4667d0d8992e610c87",
    "status": "published"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 4. Hủy sự kiện

**Endpoint:** `PUT /api/events/:id/cancel`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "reason": "Weather conditions"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event cancelled successfully",
  "event": {
    "id": "60d21b4667d0d8992e610c87",
    "status": "cancelled"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 5. Upload hình ảnh sự kiện

**Endpoint:** `POST /api/events/:id/upload-image`

**Headers:**

- Authorization: Bearer {token}
- Content-Type: multipart/form-data

**Request:**
Form data with 'image' field

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "https://example.com/uploads/event-image.jpg"
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 6. Tìm kiếm sự kiện

**Endpoint:** `GET /api/events/search`

**Query Parameters:**

- keyword: Search keyword
- category: Filter by category
- location: Filter by location
- startDate: Filter by start date
- endDate: Filter by end date
- isFree: Filter by free events (boolean)
- isPaid: Filter by paid events (boolean)
- minPrice: Filter by minimum price
- maxPrice: Filter by maximum price
- sortBy: Sort by field (date, price, popularity)
- sortOrder: Sort order (asc, desc)
- page: Page number
- limit: Items per page

**Response:**

```json
{
  "success": true,
  "events": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "title": "Tech Conference 2023",
      "description": "A conference about technology",
      "date": "2023-09-15T00:00:00.000Z",
      "location": "New York",
      "image": "https://example.com/event.jpg",
      "category": "tech",
      "isPaid": true,
      "price": 50
    }
  ],
  "pagination": {
    "total": 50,
    "pages": 5,
    "page": 1,
    "limit": 10
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request

### 7. Lấy chi tiết sự kiện

**Endpoint:** `GET /api/events/:id`

**Response:**

```json
{
  "success": true,
  "event": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Tech Conference 2023",
    "description": "A conference about technology",
    "category": "tech",
    "date": "2023-09-15T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "18:00",
    "location": "New York",
    "address": "123 Main St, New York, NY",
    "isOnline": false,
    "capacity": 100,
    "isPaid": true,
    "ticketTypes": [
      {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Standard",
        "price": 50,
        "quantity": 80,
        "quantitySold": 10
      },
      {
        "id": "60d21b4667d0d8992e610c91",
        "name": "VIP",
        "price": 100,
        "quantity": 20,
        "quantitySold": 5
      }
    ],
    "image": "https://example.com/event.jpg",
    "tags": ["tech", "conference", "2023"],
    "organizer": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe"
    },
    "status": "published",
    "averageRating": 4.5,
    "totalReviews": 10
  }
}
```

**Status Codes:**

- 200: OK
- 404: Not Found

### 8. Lưu/bỏ lưu sự kiện

**Endpoint:** `POST /api/events/:id/save`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Event saved successfully"
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized
- 404: Not Found

**Endpoint:** `DELETE /api/events/:id/save`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Event removed from saved events"
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized
- 404: Not Found

### 9. Lấy sự kiện liên quan

**Endpoint:** `GET /api/events/:id/related`

**Query Parameters:**

- limit: Items per page (default: 4)

**Response:**

```json
{
  "success": true,
  "events": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "title": "AI Conference 2023",
      "description": "A conference about AI",
      "date": "2023-10-15T00:00:00.000Z",
      "location": "San Francisco",
      "image": "https://example.com/event2.jpg",
      "category": "tech",
      "isPaid": true,
      "price": 70
    }
  ]
}
```

**Status Codes:**

- 200: OK
- 404: Not Found

## Ticket APIs

### 1. Tạo đơn hàng

**Endpoint:** `POST /api/tickets/order`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "eventId": "60d21b4667d0d8992e610c87",
  "tickets": [
    {
      "ticketTypeId": "60d21b4667d0d8992e610c90",
      "quantity": 2
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "60d21b4667d0d8992e610c92",
    "eventId": "60d21b4667d0d8992e610c87",
    "tickets": [
      {
        "id": "60d21b4667d0d8992e610c93",
        "ticketTypeId": "60d21b4667d0d8992e610c90",
        "ticketTypeName": "Standard",
        "quantity": 2,
        "price": 50,
        "status": "reserved"
      }
    ],
    "totalAmount": 100,
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "expiresAt": "2023-08-01T15:00:00.000Z"
  }
}
```

**Status Codes:**

- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found

### 2. Xử lý thanh toán

**Endpoint:** `POST /api/tickets/payment`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "orderId": "60d21b4667d0d8992e610c92",
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4242424242424242",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvc": "123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "id": "60d21b4667d0d8992e610c94",
    "amount": 100,
    "method": "credit_card",
    "status": "completed",
    "transactionId": "txn_1234567890"
  },
  "tickets": [
    {
      "id": "60d21b4667d0d8992e610c93",
      "status": "paid"
    }
  ]
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found

### 3. Check-in vé

**Endpoint:** `PUT /api/tickets/:id/check-in`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Ticket checked in successfully",
  "ticket": {
    "id": "60d21b4667d0d8992e610c93",
    "status": "used",
    "checkInDate": "2023-09-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 4. Hủy vé

**Endpoint:** `PUT /api/tickets/:id/cancel`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Ticket cancelled successfully",
  "ticket": {
    "id": "60d21b4667d0d8992e610c93",
    "status": "cancelled"
  }
}
```

**Status Codes:**

- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

## Review APIs

### 1. Tạo đánh giá mới

**Endpoint:** `POST /api/reviews`

**Headers:**

- Authorization: Bearer {token}

**Request:**

```json
{
  "eventId": "60d21b4667d0d8992e610c87",
  "rating": 5,
  "comment": "Great event! Very well organized."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": "60d21b4667d0d8992e610c95",
    "eventId": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "rating": 5,
    "comment": "Great event! Very well organized.",
    "createdAt": "2023-09-16T10:00:00.000Z"
  }
}
```

**Status Codes:**

- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found

### 2. Lấy đánh giá cho sự kiện

**Endpoint:** `GET /api/events/:id/reviews`

**Query Parameters:**

- page: Page number
- limit: Items per page
- sortBy: Sort by field (createdAt, rating)
- sortOrder: Sort order (asc, desc)

**Response:**

```json
{
  "success": true,
  "reviews": [
    {
      "id": "60d21b4667d0d8992e610c95",
      "user": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "rating": 5,
      "comment": "Great event! Very well organized.",
      "createdAt": "2023-09-16T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "page": 1,
    "limit": 10
  },
  "averageRating": 4.5
}
```

**Status Codes:**

- 200: OK
- 404: Not Found

## Notification APIs

### 1. Lấy thông báo của người dùng

**Endpoint:** `GET /api/notifications`

**Headers:**

- Authorization: Bearer {token}

**Query Parameters:**

- page: Page number
- limit: Items per page
- isRead: Filter by read status (boolean)

**Response:**

```json
{
  "success": true,
  "notifications": [
    {
      "id": "60d21b4667d0d8992e610c96",
      "type": "ticket_purchase",
      "message": "You have successfully purchased tickets for Tech Conference 2023",
      "relatedId": "60d21b4667d0d8992e610c87",
      "isRead": false,
      "createdAt": "2023-08-01T14:35:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "pages": 1,
    "page": 1,
    "limit": 10
  },
  "unreadCount": 3
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized

### 2. Đánh dấu thông báo đã đọc

**Endpoint:** `PUT /api/notifications/:id/read`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "id": "60d21b4667d0d8992e610c96",
    "isRead": true
  }
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized
- 404: Not Found

### 3. Đánh dấu tất cả thông báo đã đọc

**Endpoint:** `PUT /api/notifications/read-all`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 3
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized

## Admin APIs

### 1. Lấy danh sách người dùng (Admin only)

**Endpoint:** `GET /api/admin/users`

**Headers:**

- Authorization: Bearer {token}

**Query Parameters:**

- page: Page number
- limit: Items per page
- role: Filter by role
- search: Search by name or email

**Response:**

```json
{
  "success": true,
  "users": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-07-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "pages": 10,
    "page": 1,
    "limit": 10
  }
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized
- 403: Forbidden

### 2. Lấy thống kê hệ thống (Admin only)

**Endpoint:** `GET /api/admin/stats`

**Headers:**

- Authorization: Bearer {token}

**Response:**

```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 1000,
      "organizers": 50,
      "newThisMonth": 100
    },
    "events": {
      "total": 200,
      "published": 150,
      "upcoming": 80,
      "newThisMonth": 30
    },
    "tickets": {
      "total": 5000,
      "sold": 3000,
      "revenue": 150000
    }
  }
}
```

**Status Codes:**

- 200: OK
- 401: Unauthorized
- 403: Forbidden
