// Lệnh MongoDB shell để tạo dữ liệu mẫu
// Dùng lệnh này với MongoDB shell: mongo < sampleData.js

// Kết nối đến database eventhub
// use eventhub

// Tạo dữ liệu người dùng để làm organizer
const users = [
  {
    _id: ObjectId(),
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$X9xNFNIjGdO0Tp.Qkzs5vOFVEwNzwXBs0RjXBU8R9XwC2AqKDOAyq", // password: 123456
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Organizer User",
    email: "organizer@example.com",
    password: "$2a$10$X9xNFNIjGdO0Tp.Qkzs5vOFVEwNzwXBs0RjXBU8R9XwC2AqKDOAyq", // password: 123456
    role: "organizer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Regular User",
    email: "user@example.com",
    password: "$2a$10$X9xNFNIjGdO0Tp.Qkzs5vOFVEwNzwXBs0RjXBU8R9XwC2AqKDOAyq", // password: 123456
    role: "user",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Lưu IDs của user để dùng làm organizer
const adminId = users[0]._id;
const organizerId = users[1]._id;
const userId = users[2]._id;

// Tạo dữ liệu sự kiện mẫu
const events = [
  {
    title: "Hội thảo thiết kế UI/UX",
    description:
      "Hội thảo về các nguyên tắc thiết kế giao diện người dùng hiện đại. Chúng tôi sẽ khám phá những xu hướng thiết kế mới nhất, các công cụ và kỹ thuật để tạo ra trải nghiệm người dùng tuyệt vời.",
    date: new Date("2023-12-15"),
    startTime: "09:00",
    endTime: "17:00",
    location: "TP. Hồ Chí Minh",
    address: "Số 123 Đường Nguyễn Huệ, Quận 1",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "workshop",
    isPaid: false,
    capacity: 100,
    maxTicketsPerPerson: 2,
    ticketTypes: [
      {
        name: "Standard",
        price: 0,
        quantity: 100,
        availableQuantity: 100,
        description: "Vé tham dự thường",
      },
    ],
    tags: ["design", "ux", "ui", "workshop"],
    organizer: organizerId,
    attendees: 0,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Hội nghị công nghệ Blockchain",
    description:
      "Khám phá tiềm năng và ứng dụng của công nghệ blockchain trong thế giới hiện đại. Các chuyên gia hàng đầu sẽ chia sẻ kinh nghiệm và kiến thức về blockchain, cryptocurrency, và NFTs.",
    date: new Date("2023-12-20"),
    startTime: "08:30",
    endTime: "16:30",
    location: "Hà Nội",
    address: "Số 456 Đường Lý Thái Tổ, Quận Hoàn Kiếm",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    category: "conference",
    isPaid: true,
    price: 200000,
    capacity: 150,
    maxTicketsPerPerson: 1,
    ticketTypes: [
      {
        name: "Early Bird",
        price: 150000,
        quantity: 50,
        availableQuantity: 0,
        description: "Giá ưu đãi cho người đăng ký sớm",
        startSaleDate: new Date("2023-11-01"),
        endSaleDate: new Date("2023-11-30"),
      },
      {
        name: "Standard",
        price: 200000,
        quantity: 75,
        availableQuantity: 65,
        description: "Vé thường",
      },
      {
        name: "VIP",
        price: 500000,
        quantity: 25,
        availableQuantity: 20,
        description:
          "Vé VIP bao gồm bữa trưa và không gian networking đặc biệt",
      },
    ],
    tags: ["blockchain", "crypto", "technology", "conference"],
    organizer: organizerId,
    attendees: 15,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Lễ hội âm nhạc 2023",
    description:
      "Sự kiện âm nhạc lớn nhất trong năm với các nghệ sĩ hàng đầu. Tận hưởng không khí âm nhạc sôi động với nhiều thể loại từ pop, rock, đến EDM và hip hop.",
    date: new Date("2023-12-10"),
    startTime: "18:00",
    endTime: "23:00",
    location: "Đà Nẵng",
    address: "Bãi biển Mỹ Khê, Quận Sơn Trà",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "music",
    isPaid: true,
    price: 350000,
    capacity: 1000,
    maxTicketsPerPerson: 4,
    ticketTypes: [
      {
        name: "Vé Phổ thông",
        price: 350000,
        quantity: 800,
        availableQuantity: 650,
        description: "Vé vào cổng thường",
      },
      {
        name: "VIP",
        price: 750000,
        quantity: 150,
        availableQuantity: 100,
        description: "Vé VIP với khu vực riêng và đồ uống miễn phí",
      },
      {
        name: "Platinum",
        price: 1500000,
        quantity: 50,
        availableQuantity: 30,
        description:
          "Trải nghiệm tối ưu với khu vực gần sân khấu và gặp gỡ nghệ sĩ",
      },
    ],
    tags: ["music", "festival", "concert", "entertainment"],
    organizer: adminId,
    attendees: 220,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Đêm giao lưu startup",
    description:
      "Kết nối với các nhà sáng lập, nhà đầu tư và những người đam mê khởi nghiệp. Cơ hội để kết nối, học hỏi và tìm kiếm đối tác cho doanh nghiệp của bạn.",
    date: new Date("2023-12-25"),
    startTime: "19:00",
    endTime: "22:00",
    location: "TP. Hồ Chí Minh",
    address: "Dreamplex Coworking Space, 195 Điện Biên Phủ, Quận Bình Thạnh",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    category: "networking",
    isPaid: false,
    capacity: 80,
    maxTicketsPerPerson: 1,
    ticketTypes: [
      {
        name: "Standard",
        price: 0,
        quantity: 80,
        availableQuantity: 35,
        description: "Vé tham dự miễn phí",
      },
    ],
    tags: ["startup", "networking", "business", "entrepreneurship"],
    organizer: organizerId,
    attendees: 45,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Lễ hội ẩm thực & văn hóa",
    description:
      "Khám phá các món ẩm thực đa dạng và các tiết mục biểu diễn văn hóa từ nhiều vùng miền. Trải nghiệm sự độc đáo của ẩm thực Việt Nam và quốc tế.",
    date: new Date("2023-12-05"),
    startTime: "10:00",
    endTime: "22:00",
    location: "Hà Nội",
    address: "Công viên Thống Nhất, Quận Hai Bà Trưng",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "food",
    isPaid: false,
    capacity: 500,
    maxTicketsPerPerson: 5,
    ticketTypes: [
      {
        name: "Vé gia đình",
        price: 0,
        quantity: 500,
        availableQuantity: 300,
        description: "Vé tham dự miễn phí cho tất cả",
      },
    ],
    tags: ["food", "culture", "festival", "culinary"],
    organizer: adminId,
    attendees: 200,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Hội nghị AI trong kinh doanh",
    description:
      "Tìm hiểu cách AI đang thay đổi doanh nghiệp và các ngành công nghiệp. Khám phá các ứng dụng thực tế của AI và machine learning trong các doanh nghiệp.",
    date: new Date("2023-12-12"),
    startTime: "09:00",
    endTime: "18:00",
    location: "TP. Hồ Chí Minh",
    address: "Khách sạn Rex, 141 Nguyễn Huệ, Quận 1",
    isOnline: true,
    onlineUrl: "https://zoom.us/j/123456789",
    imageUrl:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "conference",
    isPaid: true,
    price: 250000,
    capacity: 200,
    maxTicketsPerPerson: 2,
    ticketTypes: [
      {
        name: "Online",
        price: 100000,
        quantity: 100,
        availableQuantity: 80,
        description: "Tham dự qua Zoom",
      },
      {
        name: "Offline",
        price: 250000,
        quantity: 100,
        availableQuantity: 60,
        description: "Tham dự trực tiếp tại khách sạn Rex",
      },
    ],
    tags: ["ai", "business", "technology", "conference"],
    organizer: organizerId,
    attendees: 60,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Workshop: Data Science for Beginners",
    description:
      "Workshop cơ bản về Data Science cho người mới bắt đầu. Bạn sẽ được hướng dẫn các kỹ thuật phân tích dữ liệu cơ bản và làm quen với các công cụ thông dụng.",
    date: new Date("2023-12-30"),
    startTime: "09:00",
    endTime: "17:00",
    location: "Hà Nội",
    address: "Mindx Technology School, 101 Láng Hạ, Đống Đa",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "workshop",
    isPaid: true,
    price: 150000,
    capacity: 30,
    maxTicketsPerPerson: 1,
    ticketTypes: [
      {
        name: "Student",
        price: 100000,
        quantity: 15,
        availableQuantity: 10,
        description: "Giá ưu đãi cho học sinh, sinh viên",
      },
      {
        name: "Professional",
        price: 150000,
        quantity: 15,
        availableQuantity: 15,
        description: "Vé thường cho người đi làm",
      },
    ],
    tags: ["data", "workshop", "technology", "education"],
    organizer: adminId,
    attendees: 5,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Triển lãm nghệ thuật đương đại",
    description:
      "Khám phá các tác phẩm nghệ thuật đương đại từ các nghệ sĩ trẻ Việt Nam. Triển lãm giới thiệu những góc nhìn mới mẻ và sáng tạo về xã hội hiện đại.",
    date: new Date("2023-12-08"),
    startTime: "10:00",
    endTime: "20:00",
    location: "TP. Hồ Chí Minh",
    address:
      "The Factory Contemporary Arts Centre, 15 Nguyễn Ư Dĩ, Thảo Điền, Quận 2",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "art",
    isPaid: true,
    price: 50000,
    capacity: 300,
    maxTicketsPerPerson: 5,
    ticketTypes: [
      {
        name: "Standard",
        price: 50000,
        quantity: 280,
        availableQuantity: 230,
        description: "Vé tham quan",
      },
      {
        name: "Premium",
        price: 150000,
        quantity: 20,
        availableQuantity: 15,
        description: "Bao gồm tour hướng dẫn và sách triển lãm",
      },
    ],
    tags: ["art", "exhibition", "contemporary", "culture"],
    organizer: organizerId,
    attendees: 55,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Tạo lệnh để thêm dữ liệu vào MongoDB
print("Deleting existing users...");
db.users.deleteMany({});
print("Adding users...");
db.users.insertMany(users);

print("Deleting existing events...");
db.events.deleteMany({});
print("Adding events...");
db.events.insertMany(events);

print("Sample data imported successfully!");

// Hướng dẫn sử dụng:
// 1. Mở MongoDB shell: mongo
// 2. Chọn database: use eventhub
// 3. Chạy lệnh: load("sampleData.js")
// Hoặc sử dụng lệnh: mongo eventhub sampleData.js
