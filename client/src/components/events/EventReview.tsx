import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Textarea,
  useToast,
  useColorModeValue,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";

// Interface cho đánh giá
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  isEdited?: boolean;
}

// Props cho component EventReview
interface EventReviewProps {
  eventId?: string | number; // Thêm dấu ? để làm optional
  currentUserId?: string; // ID của người dùng hiện tại, nếu đã đăng nhập
  canAddReview?: boolean; // Người dùng có thể thêm đánh giá hay không
  onReviewAdded?: () => void; // Callback khi thêm đánh giá thành công
  rating?: number; // Rating sẵn có (cho hiển thị nhanh)
  reviewCount?: number; // Số lượng đánh giá (cho hiển thị nhanh)
}

/**
 * Component hiển thị danh sách đánh giá và cho phép người dùng thêm đánh giá mới
 */
const EventReview = ({
  // eventId không được sử dụng hiện tại nhưng vẫn giữ lại cho tính mở rộng API trong tương lai
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eventId,
  currentUserId = "current-user", // Giá trị mặc định cho demo
  canAddReview = true,
  onReviewAdded,
  rating,
  reviewCount,
}: EventReviewProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const userReviewBg = useColorModeValue("teal.50", "teal.900");
  const userReviewBorderColor = useColorModeValue("teal.200", "teal.700");
  const formBgColor = useColorModeValue("gray.50", "gray.700");
  const ratingLabelColor = useColorModeValue("teal.600", "teal.300");
  const placeholderBgColor = useColorModeValue("gray.100", "gray.600");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");

  // Tải dữ liệu đánh giá từ API (mock data cho demo)
  useEffect(() => {
    // Nếu không có eventId, không cần gọi API
    // if (!eventId) return;

    // Mock data - trong thực tế sẽ gọi API
    const mockReviews: Review[] = [
      {
        id: "r1",
        userId: "user1",
        userName: "John Doe",
        userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        comment:
          "Sự kiện rất tuyệt vời! Tôi rất hài lòng với nội dung và cách tổ chức. Chắc chắn sẽ tham gia các sự kiện tiếp theo.",
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      },
      {
        id: "r2",
        userId: "user2",
        userName: "Jane Smith",
        userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        comment:
          "Nhìn chung là tốt, nhưng có thể cải thiện hơn ở phần âm thanh. Phần nội dung rất bổ ích.",
        createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
      },
      {
        id: "r3",
        userId: "user3",
        userName: "Robert Johnson",
        userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 3,
        comment:
          "Sự kiện khá bình thường, không có gì đặc biệt. Tôi mong đợi nhiều hơn từ phần hỏi đáp.",
        createdAt: new Date(Date.now() - 21 * 24 * 3600 * 1000),
      },
    ];

    // Kiểm tra xem người dùng hiện tại đã đánh giá chưa
    const existingUserReview = mockReviews.find(
      (review) => review.userId === currentUserId
    );

    setReviews(mockReviews);
    if (existingUserReview) {
      setUserReview(existingUserReview);
      setNewReviewRating(existingUserReview.rating);
      setNewReviewComment(existingUserReview.comment);
    }
  }, [currentUserId]);

  // Tính rating trung bình
  const calculateAverageRating = (): number => {
    // Nếu có rating được truyền vào, ưu tiên sử dụng
    if (rating !== undefined) return rating;

    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Làm tròn 1 chữ số thập phân
  };

  // Lấy số lượng đánh giá
  const getReviewCount = (): number => {
    // Nếu có reviewCount được truyền vào, ưu tiên sử dụng
    if (reviewCount !== undefined) return reviewCount;

    return reviews.length;
  };

  // Hiển thị stars cho rating
  const renderStars = (rating: number, interactive = false) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            cursor={interactive ? "pointer" : "default"}
            onClick={interactive ? () => setNewReviewRating(star) : undefined}
            onMouseEnter={
              interactive ? () => setHoveredRating(star) : undefined
            }
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          >
            {interactive ? (
              star <= (hoveredRating || newReviewRating) ? (
                <FaStar color="#FFD700" size={20} />
              ) : (
                <FaRegStar size={20} />
              )
            ) : star <= rating ? (
              <FaStar color="#FFD700" size={16} />
            ) : (
              <FaRegStar size={16} />
            )}
          </Box>
        ))}
      </HStack>
    );
  };

  // Gợi ý đánh giá dựa trên số sao
  const getRatingHint = () => {
    switch (newReviewRating) {
      case 1:
        return "Rất không hài lòng";
      case 2:
        return "Không hài lòng";
      case 3:
        return "Bình thường";
      case 4:
        return "Hài lòng";
      case 5:
        return "Rất hài lòng";
      default:
        return "Chọn đánh giá của bạn";
    }
  };

  // Xử lý thêm/cập nhật đánh giá
  const handleSubmitReview = () => {
    if (newReviewRating === 0) {
      toast({
        title: "Vui lòng chọn số sao",
        description: "Bạn chưa chọn số sao đánh giá cho sự kiện này",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newReviewComment.trim() === "") {
      toast({
        title: "Vui lòng nhập nội dung đánh giá",
        description: "Hãy chia sẻ trải nghiệm của bạn về sự kiện này",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulation of API call
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      // Tạo đánh giá mới hoặc cập nhật đánh giá hiện có
      const reviewData: Review = {
        id: userReview ? userReview.id : `new-${Date.now()}`,
        userId: currentUserId,
        userName: "Current User", // Trong thực tế lấy từ thông tin người dùng
        userAvatar: "https://randomuser.me/api/portraits/men/10.jpg", // Trong thực tế lấy từ thông tin người dùng
        rating: newReviewRating,
        comment: newReviewComment,
        createdAt: new Date(),
        isEdited: isEditingReview,
      };

      if (userReview) {
        // Cập nhật đánh giá hiện có
        const updatedReviews = reviews.map((review) =>
          review.id === userReview.id ? reviewData : review
        );
        setReviews(updatedReviews);
        setUserReview(reviewData);
        toast({
          title: "Đã cập nhật đánh giá!",
          description: "Cảm ơn bạn đã chia sẻ ý kiến về sự kiện này",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Thêm đánh giá mới
        const updatedReviews = [reviewData, ...reviews];
        setReviews(updatedReviews);
        setUserReview(reviewData);
        toast({
          title: "Đã thêm đánh giá mới!",
          description: "Cảm ơn bạn đã chia sẻ ý kiến về sự kiện này",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Reset form
      setIsAddingReview(false);
      setIsEditingReview(false);
      setIsSubmitting(false);

      // Gọi callback
      if (onReviewAdded) {
        onReviewAdded();
      }
    }, 1000);
  };

  // Xử lý xóa đánh giá
  const handleDeleteReview = () => {
    if (!userReview) return;

    // Xóa đánh giá
    const updatedReviews = reviews.filter(
      (review) => review.id !== userReview.id
    );
    setReviews(updatedReviews);
    setUserReview(null);
    setNewReviewRating(0);
    setNewReviewComment("");

    toast({
      title: "Đã xóa đánh giá!",
      description: "Đánh giá của bạn đã được xóa thành công",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Format thời gian đánh giá
  const formatReviewDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Rating và nút thêm đánh giá */}
      <VStack align="start" spacing={6} mb={8} w="100%">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "start", sm: "center" }}
          w="100%"
          wrap="wrap"
          gap={4}
        >
          <HStack spacing={3}>
            {renderStars(calculateAverageRating())}
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {calculateAverageRating()} ({getReviewCount()}{" "}
              {getReviewCount() === 1 ? "đánh giá" : "đánh giá"})
            </Text>
          </HStack>

          {canAddReview && !isAddingReview && !userReview && (
            <Button
              size="md"
              colorScheme="teal"
              leftIcon={<FaStar />}
              onClick={() => setIsAddingReview(true)}
              _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              Viết đánh giá
            </Button>
          )}
        </Flex>

        {/* Form thêm/chỉnh sửa đánh giá - Thiết kế cải tiến */}
        {(isAddingReview || isEditingReview) && (
          <Box
            w="100%"
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={formBgColor}
            boxShadow="md"
            position="relative"
            transition="all 0.3s"
          >
            <VStack align="start" spacing={6}>
              <Heading size="md" color={textColor} mb={2}>
                {isEditingReview
                  ? "Chỉnh sửa đánh giá của bạn"
                  : "Chia sẻ trải nghiệm của bạn"}
              </Heading>

              {/* Rating stars với hiệu ứng và gợi ý */}
              <Box w="100%">
                <Text fontWeight="medium" color={ratingLabelColor} mb={2}>
                  Đánh giá của bạn*
                </Text>
                <Flex align="center" mb={2}>
                  <HStack spacing={2}>
                    {renderStars(newReviewRating, true)}
                  </HStack>
                  <Text ml={4} color={textColor} fontWeight="medium">
                    {getRatingHint()}
                  </Text>
                </Flex>
              </Box>

              {/* Textarea với gợi ý nâng cao */}
              <FormControl isRequired>
                <FormLabel fontWeight="medium" color={ratingLabelColor}>
                  Nội dung đánh giá*
                </FormLabel>
                <Textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder={`Hãy chia sẻ trải nghiệm của bạn về sự kiện này...
- Điều gì bạn thích nhất?
- Bạn học được gì từ sự kiện?
- Bạn có đề xuất gì để cải thiện?`}
                  size="md"
                  color={textColor}
                  borderColor={borderColor}
                  bg={bgColor}
                  _hover={{ borderColor: "teal.400" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                  }}
                  minH="150px"
                  resize="vertical"
                  p={4}
                />
                <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                  {newReviewComment.length}/500 ký tự
                </Text>
              </FormControl>

              <HStack w="100%" justify="space-between" pt={2}>
                <Button
                  onClick={() => {
                    setIsAddingReview(false);
                    setIsEditingReview(false);
                    // Nếu đang chỉnh sửa, reset lại giá trị cũ
                    if (isEditingReview && userReview) {
                      setNewReviewRating(userReview.rating);
                      setNewReviewComment(userReview.comment);
                    } else {
                      setNewReviewRating(0);
                      setNewReviewComment("");
                    }
                  }}
                  variant="outline"
                  borderColor={borderColor}
                >
                  Hủy
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleSubmitReview}
                  isLoading={isSubmitting}
                  loadingText="Đang gửi..."
                  leftIcon={isEditingReview ? <FaEdit /> : <FaStar />}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  {isEditingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Đánh giá của người dùng hiện tại - Thiết kế cải tiến */}
      {userReview && !isEditingReview && (
        <Box
          w="100%"
          p={5}
          mb={8}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={userReviewBorderColor}
          bg={userReviewBg}
          position="relative"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
          transition="all 0.3s"
        >
          <Flex justify="space-between" align="start" mb={3}>
            <Heading size="sm" color={textColor}>
              Đánh giá của bạn
            </Heading>

            <HStack spacing={2}>
              <Tooltip label="Chỉnh sửa đánh giá" placement="top">
                <IconButton
                  aria-label="Chỉnh sửa đánh giá"
                  icon={<FaEdit />}
                  size="sm"
                  onClick={() => {
                    setIsEditingReview(true);
                    setNewReviewRating(userReview.rating);
                    setNewReviewComment(userReview.comment);
                  }}
                  variant="ghost"
                  colorScheme="teal"
                  _hover={{ bg: hoverBgColor }}
                />
              </Tooltip>
              <Tooltip label="Xóa đánh giá" placement="top">
                <IconButton
                  aria-label="Xóa đánh giá"
                  icon={<FaTrash />}
                  size="sm"
                  onClick={handleDeleteReview}
                  variant="ghost"
                  colorScheme="red"
                  _hover={{ bg: hoverBgColor }}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Phần nội dung đánh giá của người dùng hiện tại */}
          <VStack align="start" spacing={3}>
            <Flex align="center" wrap="wrap" gap={2}>
              {renderStars(userReview.rating)}
              <Text fontSize="sm" color={secondaryTextColor}>
                {formatReviewDate(userReview.createdAt)}
                {userReview.isEdited && " (đã chỉnh sửa)"}
              </Text>
            </Flex>
            <Text color={textColor} fontSize="md" fontStyle="italic">
              "{userReview.comment}"
            </Text>
          </VStack>
        </Box>
      )}

      {/* Tất cả đánh giá (bao gồm cả reviews và comments) */}
      <Box mb={4}>
        <Heading size="md" mb={5} color={textColor}>
          Tất cả đánh giá (
          {reviews.filter((r) => r.userId !== currentUserId).length})
        </Heading>

        {reviews.filter((review) => review.userId !== currentUserId).length ===
        0 ? (
          <Box
            py={10}
            textAlign="center"
            bg={placeholderBgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            borderStyle="dashed"
          >
            <Text color={secondaryTextColor} fontSize="lg">
              Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!
            </Text>
            {canAddReview && !userReview && !isAddingReview && (
              <Button
                mt={4}
                colorScheme="teal"
                leftIcon={<FaStar />}
                onClick={() => setIsAddingReview(true)}
              >
                Viết đánh giá
              </Button>
            )}
          </Box>
        ) : (
          <VStack spacing={5} align="start" w="100%">
            {reviews
              .filter((review) => review.userId !== currentUserId)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((review) => (
                <Box
                  key={review.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  w="100%"
                  borderColor={borderColor}
                  bg={bgColor}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4} mb={3}>
                    <Avatar
                      size="md"
                      name={review.userName}
                      src={review.userAvatar}
                    />
                    <Box>
                      <Text fontWeight="bold" color={textColor} fontSize="md">
                        {review.userName}
                      </Text>
                      <HStack mt={1}>
                        {renderStars(review.rating)}
                        <Text fontSize="sm" color={secondaryTextColor} ml={1}>
                          {formatReviewDate(review.createdAt)}
                          {review.isEdited && " (đã chỉnh sửa)"}
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Text
                    color={textColor}
                    ml={14}
                    fontSize="md"
                    fontStyle="italic"
                  >
                    "{review.comment}"
                  </Text>
                </Box>
              ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default EventReview;
