// MongoDB import script - Lưu vào file seed-data.js trong thư mục gốc
// Để chạy: mongosh "mongodb+srv://21521059:Lam@20032001@data.v6vriop.mongodb.net/" --file seed-data.js

// Connect to database
db = connect("mongodb+srv://21521059:Lam@20032001@data.v6vriop.mongodb.net/");

// Chọn database
db = db.getSiblingDB("eventhub");

// Xóa collections hiện tại (nếu có)
db.users.drop();
db.events.drop();
db.registrations.drop();
db.savedEvents.drop();
db.reviews.drop();
db.notifications.drop();

// 1. Tạo users
print("Tạo users...");
const users = [
  {
    email: "admin@eventhub.com",
    password: "$2a$10$eDOrjdPVXWva2C.uyDEl3up4DVXxn20VUxGZZDKjY.NUCJxi.rLr2", // "password123"
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "user@eventhub.com",
    password: "$2a$10$eDOrjdPVXWva2C.uyDEl3up4DVXxn20VUxGZZDKjY.NUCJxi.rLr2", // "password123"
    firstName: "Nguyễn",
    lastName: "Văn A",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: "organizer@eventhub.com",
    password: "$2a$10$eDOrjdPVXWva2C.uyDEl3up4DVXxn20VUxGZZDKjY.NUCJxi.rLr2", // "password123"
    firstName: "Tổ Chức",
    lastName: "Sự Kiện",
    role: "user", // Người tổ chức cũng là user bình thường nhưng có quyền tạo event
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const userIds = {};

// Thêm dữ liệu users
users.forEach((user, index) => {
  const result = db.users.insertOne(user);
  userIds[`user${index + 1}`] = result.insertedId;
});

// 2. Tạo events
print("Tạo events...");
const events = [
  {
    title: "Hội thảo thiết kế UI/UX",
    description: "Hội thảo về các nguyên tắc thiết kế giao diện người dùng hiện đại",
    category: "workshop",
    location: "TP. Hồ Chí Minh",
    venue: "Trung tâm công nghệ",
    startDate: new Date("2023-08-15T09:00:00"),
    endDate: new Date("2023-08-15T17:00:00"),
    bannerImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
    ticketTypes: [
      {
        name: "Standard",
        description: "Vé tiêu chuẩn",
        price: 200000,
        quantity: 100,
        startSaleDate: new Date("2023-07-15"),
        endSaleDate: new Date("2023-08-14"),
        soldQuantity: 75
      },
      {
        name: "VIP",
        description: "Vé VIP với chỗ ngồi ưu tiên",
        price: 500000,
        quantity: 50,
        startSaleDate: new Date("2023-07-15"),
        endSaleDate: new Date("2023-08-14"),
        soldQuantity: 30
      }
    ],
    organizer: userIds.user3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Hội nghị công nghệ Blockchain",
    description: "Khám phá tiềm năng và ứng dụng của công nghệ blockchain",
    category: "conference",
    location: "Hà Nội",
    venue: "Vietnam National Convention Center",
    startDate: new Date("2023-08-20T08:30:00"),
    endDate: new Date("2023-08-20T17:30:00"),
    bannerImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    ticketTypes: [
      {
        name: "Early Bird",
        description: "Vé ưu đãi đăng ký sớm",
        price: 300000,
        quantity: 100,
        startSaleDate: new Date("2023-07-01"),
        endSaleDate: new Date("2023-08-01"),
        soldQuantity: 100
      },
      {
        name: "Standard",
        description: "Vé tiêu chuẩn",
        price: 500000,
        quantity: 200,
        startSaleDate: new Date("2023-08-02"),
        endSaleDate: new Date("2023-08-19"),
        soldQuantity: 150
      }
    ],
    organizer: userIds.user3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Lễ hội âm nhạc 2023",
    description: "Sự kiện âm nhạc lớn nhất trong năm với các nghệ sĩ hàng đầu",
    category: "music",
    location: "Đà Nẵng",
    venue: "Bãi biển Mỹ Khê",
    startDate: new Date("2023-09-10T16:00:00"),
    endDate: new Date("2023-09-10T23:00:00"),
    bannerImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    ticketTypes: [
      {
        name: "General Admission",
        description: "Vé phổ thông",
        price: 350000,
        quantity: 1000,
        startSaleDate: new Date("2023-07-10"),
        endSaleDate: new Date("2023-09-09"),
        soldQuantity: 850
      },
      {
        name: "VIP Experience",
        description: "Trải nghiệm VIP với khu vực riêng và đồ uống miễn phí",
        price: 1200000,
        quantity: 100,
        startSaleDate: new Date("2023-07-10"),
        endSaleDate: new Date("2023-09-09"),
        soldQuantity: 80
      }
    ],
    organizer: userIds.user3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Đêm giao lưu startup",
    description: "Kết nối với các nhà sáng lập, nhà đầu tư và những người đam mê khởi nghiệp",
    category: "networking",
    location: "TP. Hồ Chí Minh",
    venue: "Dreamplex Coworking Space",
    startDate: new Date("2023-08-25T18:30:00"),
    endDate: new Date("2023-08-25T21:30:00"),
    bannerImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    ticketTypes: [
      {
        name: "Entrance",
        description: "Vé tham dự sự kiện",
        price: 0,
        quantity: 200,
        startSaleDate: new Date("2023-08-01"),
        endSaleDate: new Date("2023-08-25"),
        soldQuantity: 180
      }
    ],
    organizer: userIds.user3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Tech Conference 2023",
    description: "Hội nghị công nghệ hàng đầu với các chuyên gia đầu ngành",
    category: "conference",
    location: "TP. Hồ Chí Minh",
    venue: "White Palace Convention Center",
    startDate: new Date("2023-12-15T08:00:00"),
    endDate: new Date("2023-12-15T17:00:00"),
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    ticketTypes: [
      {
        name: "Early Bird",
        description: "Vé đăng ký sớm",
        price: 250000,
        quantity: 150,
        startSaleDate: new Date("2023-09-15"),
        endSaleDate: new Date("2023-10-15"),
        soldQuantity: 150
      },
      {
        name: "Standard",
        description: "Vé tiêu chuẩn",
        price: 500000,
        quantity: 200,
        startSaleDate: new Date("2023-10-16"),
        endSaleDate: new Date("2023-12-14"),
        soldQuantity: 120
      },
      {
        name: "VIP",
        description: "Vé VIP với quyền truy cập đặc biệt và quà tặng",
        price: 1000000,
        quantity: 50,
        startSaleDate: new Date("2023-09-15"),
        endSaleDate: new Date("2023-12-14"),
        soldQuantity: 50
      },
      {
        name: "Last Minute",
        description: "Vé mua phút chót",
        price: 800000,
        quantity: 100,
        startSaleDate: new Date("2023-12-10"),
        endSaleDate: new Date("2023-12-15"),
        soldQuantity: 58
      }
    ],
    organizer: userIds.user3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const eventIds = {};

// Thêm dữ liệu events
events.forEach((event, index) => {
  const result = db.events.insertOne(event);
  eventIds[`event${index + 1}`] = result.insertedId;
});

// 3. Tạo registrations
print("Tạo registrations...");

const registrations = [
  {
    event: eventIds.event1,
    user: userIds.user2,
    ticketType: events[0].ticketTypes[0]._id,
    quantity: 1,
    totalAmount: events[0].ticketTypes[0].price,
    attendeeInfo: [
      {
        firstName: "Nguyễn",
        lastName: "Văn A",
        email: "user@eventhub.com",
        phone: "0901234567"
      }
    ],
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    paymentId: "pm_" + Math.random().toString(36).substring(2, 15),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    event: eventIds.event2,
    user: userIds.user2,
    ticketType: events[1].ticketTypes[0]._id,
    quantity: 2,
    totalAmount: events[1].ticketTypes[0].price * 2,
    attendeeInfo: [
      {
        firstName: "Nguyễn",
        lastName: "Văn A",
        email: "user@eventhub.com",
        phone: "0901234567"
      },
      {
        firstName: "Phạm",
        lastName: "Thị B",
        email: "thib@example.com",
        phone: "0909876543"
      }
    ],
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "momo",
    paymentId: "pm_" + Math.random().toString(36).substring(2, 15),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Thêm dữ liệu registrations
registrations.forEach(registration => {
  db.registrations.insertOne(registration);
});

// 4. Tạo saved events
print("Tạo saved events...");

const savedEvents = [
  {
    user: userIds.user2,
    event: eventIds.event3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user: userIds.user2,
    event: eventIds.event4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user: userIds.user2,
    event: eventIds.event5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Thêm dữ liệu saved events
savedEvents.forEach(savedEvent => {
  db.savedEvents.insertOne(savedEvent);
});

// 5. Tạo reviews
print("Tạo reviews...");

const reviews = [
  {
    event: eventIds.event1,
    user: userIds.user2,
    rating: 5,
    comment: "Sự kiện rất hữu ích với nội dung phong phú và đa dạng.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    event: eventIds.event2,
    user: userIds.user2,
    rating: 4,
    comment: "Tổ chức chuyên nghiệp, nhưng hơi thiếu không gian cho networking.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Thêm dữ liệu reviews
reviews.forEach(review => {
  db.reviews.insertOne(review);
});

// 6. Tạo notifications
print("Tạo notifications...");

const notifications = [
  {
    user: userIds.user2,
    title: "Đăng ký thành công",
    message: "Bạn đã đăng ký thành công sự kiện Hội thảo thiết kế UI/UX.",
    type: "registration",
    relatedEvent: eventIds.event1,
    isRead: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    user: userIds.user2,
    title: "Nhắc nhở sự kiện",
    message: "Sự kiện Tech Conference 2023 sẽ diễn ra trong 3 ngày nữa.",
    type: "event",
    relatedEvent: eventIds.event5,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    user: userIds.user2,
    title: "Cập nhật hệ thống",
    message: "EventHub vừa cập nhật tính năng mới. Khám phá ngay!",
    type: "system",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Thêm dữ liệu notifications
notifications.forEach(notification => {
  db.notifications.insertOne(notification);
});

print("Hoàn thành nhập dữ liệu mẫu!");
print("Thống kê:");
print(`- ${db.users.countDocuments()} users`);
print(`- ${db.events.countDocuments()} events`);
print(`- ${db.registrations.countDocuments()} registrations`);
print(`- ${db.savedEvents.countDocuments()} saved events`);
print(`- ${db.reviews.countDocuments()} reviews`);
print(`- ${db.notifications.countDocuments()} notifications`);