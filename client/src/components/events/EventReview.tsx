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
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const userReviewBg = useColorModeValue("teal.50", "teal.900");
  const userReviewBorderColor = useColorModeValue("teal.200", "teal.700");

  // Tải dữ liệu đánh giá từ API (mock data cho demo)
  useEffect(() => {
    // Nếu không có eventId, không cần gọi API
    if (!eventId) return;

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
  }, [eventId, currentUserId]);

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

  // Xử lý thêm/cập nhật đánh giá
  const handleSubmitReview = () => {
    if (newReviewRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newReviewComment.trim() === "") {
      toast({
        title: "Error",
        description: "Please write a review comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
        title: "Review updated",
        description: "Your review has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Thêm đánh giá mới
      const updatedReviews = [...reviews, reviewData];
      setReviews(updatedReviews);
      setUserReview(reviewData);
      toast({
        title: "Review added",
        description: "Your review has been added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    // Reset form
    setIsAddingReview(false);
    setIsEditingReview(false);

    // Gọi callback
    if (onReviewAdded) {
      onReviewAdded();
    }
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
      title: "Review deleted",
      description: "Your review has been deleted successfully",
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
      {/* Rating và form đánh giá */}
      <VStack align="start" spacing={6} mb={8} w="100%">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "start", sm: "center" }}
          w="100%"
          wrap="wrap"
          gap={4}
        >
          <HStack>
            {renderStars(calculateAverageRating())}
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {calculateAverageRating()} ({getReviewCount()}{" "}
              {getReviewCount() === 1 ? "review" : "reviews"})
            </Text>
          </HStack>

          {canAddReview && !isAddingReview && !userReview && (
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => setIsAddingReview(true)}
            >
              Write a Review
            </Button>
          )}
        </Flex>

        {/* Form thêm/chỉnh sửa đánh giá */}
        {(isAddingReview || isEditingReview) && (
          <Box
            w="100%"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor={borderColor}
            bg={bgColor}
          >
            <VStack align="start" spacing={4}>
              <Heading size="md" color={textColor}>
                {isEditingReview ? "Edit Your Review" : "Write a Review"}
              </Heading>

              <FormControl>
                <FormLabel color={textColor}>Rating</FormLabel>
                <Box py={2}>{renderStars(newReviewRating, true)}</Box>
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Comment</FormLabel>
                <Textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your experience about this event..."
                  size="md"
                  color={textColor}
                  borderColor={borderColor}
                />
              </FormControl>

              <HStack w="100%" justify="space-between">
                <Button
                  onClick={() => {
                    setIsAddingReview(false);
                    setIsEditingReview(false);
                    // Nếu đang chỉnh sửa, reset lại giá trị cũ
                    if (isEditingReview && userReview) {
                      setNewReviewRating(userReview.rating);
                      setNewReviewComment(userReview.comment);
                    }
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button colorScheme="teal" onClick={handleSubmitReview}>
                  {isEditingReview ? "Update Review" : "Submit Review"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Đánh giá của người dùng hiện tại */}
      {userReview && !isEditingReview && (
        <Box
          w="100%"
          p={4}
          mb={6}
          borderWidth="1px"
          borderRadius="md"
          borderColor={userReviewBorderColor}
          bg={userReviewBg}
          position="relative"
        >
          <Heading size="sm" mb={2} color={textColor}>
            Your Review
          </Heading>

          <HStack position="absolute" top={4} right={4}>
            <Tooltip label="Edit review">
              <IconButton
                aria-label="Edit review"
                icon={<FaEdit />}
                size="sm"
                onClick={() => {
                  setIsEditingReview(true);
                  setNewReviewRating(userReview.rating);
                  setNewReviewComment(userReview.comment);
                }}
                variant="ghost"
              />
            </Tooltip>
            <Tooltip label="Delete review">
              <IconButton
                aria-label="Delete review"
                icon={<FaTrash />}
                size="sm"
                onClick={handleDeleteReview}
                variant="ghost"
                colorScheme="red"
              />
            </Tooltip>
          </HStack>

          {/* Phần nội dung đánh giá của người dùng hiện tại */}
          <VStack align="start" spacing={2}>
            <HStack>
              {renderStars(userReview.rating)}
              <Text fontSize="sm" color={secondaryTextColor}>
                {formatReviewDate(userReview.createdAt)}
                {userReview.isEdited && " (edited)"}
              </Text>
            </HStack>
            <Text color={textColor}>{userReview.comment}</Text>
          </VStack>
        </Box>
      )}

      {/* Tất cả đánh giá (bao gồm cả reviews và comments) */}
      <Heading size="md" mb={4} color={textColor}>
        All Reviews
      </Heading>

      {reviews.filter((review) => review.userId !== currentUserId).length ===
      0 ? (
        <Text color={secondaryTextColor}>
          No reviews yet. Be the first to review this event!
        </Text>
      ) : (
        <VStack spacing={4} align="start" w="100%">
          {reviews
            .filter((review) => review.userId !== currentUserId)
            .map((review) => (
              <Box
                key={review.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                w="100%"
                borderColor={borderColor}
                bg={bgColor}
              >
                <HStack spacing={4} mb={2}>
                  <Avatar
                    size="sm"
                    name={review.userName}
                    src={review.userAvatar}
                  />
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      {review.userName}
                    </Text>
                    <HStack>
                      {renderStars(review.rating)}
                      <Text fontSize="sm" color={secondaryTextColor}>
                        {formatReviewDate(review.createdAt)}
                        {review.isEdited && " (edited)"}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <Text ml={{ base: 0, md: 12 }} mt={2} color={textColor}>
                  {review.comment}
                </Text>
              </Box>
            ))}
        </VStack>
      )}
    </Box>
  );
};

export default EventReview;
