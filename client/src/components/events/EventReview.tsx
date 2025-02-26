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
  Divider,
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
  eventId: string | number;
  currentUserId?: string; // ID của người dùng hiện tại, nếu đã đăng nhập
  canAddReview?: boolean; // Người dùng có thể thêm đánh giá hay không
  onReviewAdded?: () => void; // Callback khi thêm đánh giá thành công
}

/**
 * Component hiển thị danh sách đánh giá và cho phép người dùng thêm đánh giá mới
 */
const EventReview = ({
  eventId,
  currentUserId = "current-user", // Giá trị mặc định cho demo
  canAddReview = true,
  onReviewAdded,
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

  // Tải dữ liệu đánh giá từ API (mock data cho demo)
  useEffect(() => {
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
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Làm tròn 1 chữ số thập phân
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
    <VStack spacing={6} align="stretch">
      {/* Heading và Rating Overview */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading size="lg">Reviews</Heading>
        <HStack>
          {renderStars(calculateAverageRating())}
          <Text fontWeight="bold" fontSize="lg">
            {calculateAverageRating()} ({reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"})
          </Text>
        </HStack>
      </Flex>

      {/* Thêm Review Button */}
      {canAddReview && !isAddingReview && !isEditingReview && !userReview && (
        <Button
          colorScheme="teal"
          onClick={() => setIsAddingReview(true)}
          alignSelf="flex-start"
        >
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {(isAddingReview || isEditingReview) && (
        <Box
          p={6}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md">
              {isEditingReview ? "Edit Your Review" : "Write a Review"}
            </Heading>

            <FormControl isRequired>
              <FormLabel>Rating</FormLabel>
              <Box py={2}>{renderStars(newReviewRating, true)}</Box>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Review</FormLabel>
              <Textarea
                placeholder="Share your experience about this event..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                minH="120px"
              />
            </FormControl>

            <HStack spacing={4} justifySelf="flex-end" alignSelf="flex-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingReview(false);
                  setIsEditingReview(false);
                  if (userReview) {
                    setNewReviewRating(userReview.rating);
                    setNewReviewComment(userReview.comment);
                  } else {
                    setNewReviewRating(0);
                    setNewReviewComment("");
                  }
                }}
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

      {/* User's Review */}
      {userReview && !isEditingReview && !isAddingReview && (
        <Box
          p={6}
          bg="teal.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="teal.100"
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="md">Your Review</Heading>
              <HStack>
                <Tooltip label="Edit Review">
                  <IconButton
                    aria-label="Edit review"
                    icon={<FaEdit />}
                    size="sm"
                    onClick={() => setIsEditingReview(true)}
                  />
                </Tooltip>
                <Tooltip label="Delete Review">
                  <IconButton
                    aria-label="Delete review"
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={handleDeleteReview}
                  />
                </Tooltip>
              </HStack>
            </Flex>

            <Flex align="center" gap={2}>
              {renderStars(userReview.rating)}
              <Text ml={2} fontWeight="medium">
                {userReview.rating}/5
              </Text>
            </Flex>

            <Text>{userReview.comment}</Text>

            <Text fontSize="sm" color="gray.500">
              {formatReviewDate(userReview.createdAt)}
              {userReview.isEdited && " (edited)"}
            </Text>
          </VStack>
        </Box>
      )}

      {/* Divider */}
      <Divider />

      {/* Other Reviews */}
      <VStack spacing={4} align="stretch">
        <Heading size="md">
          {userReview ? "Other Reviews" : "All Reviews"}
        </Heading>

        {reviews
          .filter((review) => review.userId !== currentUserId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((review) => (
            <Box
              key={review.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack spacing={3} align="stretch">
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar
                      size="sm"
                      name={review.userName}
                      src={review.userAvatar}
                    />
                    <Text fontWeight="bold">{review.userName}</Text>
                  </HStack>
                  <HStack>
                    {renderStars(review.rating)}
                    <Text ml={1} fontWeight="medium">
                      {review.rating}/5
                    </Text>
                  </HStack>
                </Flex>

                <Text>{review.comment}</Text>

                <Text fontSize="sm" color="gray.500">
                  {formatReviewDate(review.createdAt)}
                  {review.isEdited && " (edited)"}
                </Text>
              </VStack>
            </Box>
          ))}

        {reviews.filter((review) => review.userId !== currentUserId).length ===
          0 && (
          <Box py={8} textAlign="center">
            <Text color="gray.500">
              No reviews yet. Be the first to review!
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

export default EventReview;
