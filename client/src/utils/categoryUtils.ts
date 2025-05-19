// Danh sách categories
export const categories = [
  { id: "conference", name: "Hội nghị" },
  { id: "workshop", name: "Hội thảo" },
  { id: "meetup", name: "Gặp gỡ" },
  { id: "networking", name: "Kết nối" },
  { id: "music", name: "Âm nhạc" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "food", name: "Ẩm thực" },
  { id: "sports", name: "Thể thao" },
  { id: "tech", name: "Công nghệ" },
  { id: "education", name: "Giáo dục" },
  { id: "health", name: "Sức khỏe" },
  { id: "art", name: "Nghệ thuật" },
  { id: "business", name: "Kinh doanh" },
  { id: "other", name: "Khác" },
];

// Function để lấy tên category từ id
export const getCategoryName = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Khác";
};
