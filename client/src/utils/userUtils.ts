/**
 * Trả về URL avatar mặc định nhất quán khi người dùng không có avatar
 *
 * Hàm này giúp đảm bảo rằng tất cả các avatar mặc định trong toàn bộ ứng dụng
 * được hiển thị với cùng một phong cách và màu sắc. Nó sử dụng tên người dùng
 * để tạo avatar với các chữ cái đầu tiên của họ tên.
 *
 * @param name Tên người dùng để tạo avatar với chữ cái đầu
 * @returns URL avatar mặc định từ dịch vụ ui-avatars.com
 */
export const getDefaultAvatar = (name?: string): string => {
  const formattedName = name ? encodeURIComponent(name) : "User";
  // Sử dụng ui-avatars.com để tạo avatar với chữ cái đầu của tên
  return `https://ui-avatars.com/api/?name=${formattedName}&background=0D8ABC&color=fff`;
};
