import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Avatar,
  useToast,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  FormControl,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiShare2,
  FiHeart,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

// Interface cho dữ liệu sự kiện
interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  capacity: number;
}

// Interface cho dữ liệu bình luận
interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
}

// Dữ liệu mẫu cho sự kiện
const eventData: EventData = {
  id: 1,
  title: "UI/UX Design Workshop",
  description:
    "Join us for a hands-on workshop where you'll learn the fundamentals of UI/UX design. This workshop is perfect for beginners and intermediate designers who want to improve their skills. We'll cover the design thinking process, user research, wireframing, prototyping, and usability testing. By the end of this workshop, you'll have created a complete design for a mobile app.\n\nTopics covered:\n- Design principles and fundamentals\n- User-centered design processes\n- Creating user personas and user flows\n- Wireframing and prototyping\n- Design systems and component libraries\n- Usability testing and iteration\n\nAll participants will receive a certificate of completion and access to exclusive design resources.",
  date: "15/08/2023",
  startTime: "09:00 AM",
  endTime: "04:00 PM",
  location: "Technology Innovation Hub",
  address: "123 Tech Street, District 1, Ho Chi Minh City",
  image: "https://bit.ly/3IZUfQd",
  category: "workshop",
  isPaid: false,
  organizer: {
    name: "TechDesign Academy",
    avatar: "https://bit.ly/3Q3eQvj",
  },
  attendees: 42,
  capacity: 50,
};

// Dữ liệu mẫu cho bình luận
const commentsData: Comment[] = [
  {
    id: 1,
    user: {
      name: "Nguyen Van A",
      avatar: "https://bit.ly/3G0lIHt",
    },
    content:
      "This looks like an awesome workshop! Will there be any follow-up sessions?",
    date: "10/08/2023",
  },
  {
    id: 2,
    user: {
      name: "Tran Thi B",
      avatar: "https://bit.ly/40QpHal",
    },
    content:
      "I attended a similar workshop by TechDesign Academy last year and it was amazing. Highly recommended for beginners!",
    date: "09/08/2023",
  },
];

const EventDetail = () => {
  // Lấy ID sự kiện từ URL nhưng không sử dụng
  // const { id } = useParams<{ id: string }>();
  useParams<{ id: string }>(); // giữ useParams để khi cần ID trong tương lai
  const toast = useToast();

  // State cho các trạng thái trong trang
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(commentsData);

  // Xử lý đăng ký tham gia sự kiện
  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    toast({
      title: isRegistered
        ? "Registration cancelled"
        : "Registration successful!",
      description: isRegistered
        ? "You have cancelled your registration for this event."
        : "You have successfully registered for this event.",
      status: isRegistered ? "info" : "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý lưu sự kiện
  const handleSaveEvent = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved events" : "Event saved!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý chia sẻ sự kiện
  const handleShare = () => {
    // Logic chia sẻ sẽ được thêm sau khi có backend
    toast({
      title: "Share link copied!",
      description: "Event link has been copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý đăng bình luận
  const handlePostComment = () => {
    if (commentText.trim() === "") return;

    const newComment: Comment = {
      id: comments.length + 1,
      user: {
        name: "Current User", // Sẽ được thay thế bằng thông tin người dùng thực khi có backend
        avatar: "https://bit.ly/3Q3eQvj",
      },
      content: commentText,
      date: new Date().toLocaleDateString(),
    };

    setComments([newComment, ...comments]);
    setCommentText("");

    toast({
      title: "Comment posted!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Phần hình ảnh và thông tin cơ bản của sự kiện */}
      <Box position="relative" mb={8}>
        <Image
          src={eventData.image}
          alt={eventData.title}
          w="100%"
          h={{ base: "200px", md: "400px" }}
          objectFit="cover"
          borderRadius="lg"
        />

        {/* Badge thể loại và trạng thái */}
        <HStack position="absolute" top={4} right={4} spacing={2}>
          <Badge
            colorScheme="teal"
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {eventData.category}
          </Badge>
          <Badge
            colorScheme={eventData.isPaid ? "purple" : "green"}
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {eventData.isPaid ? "Paid" : "Free"}
          </Badge>
        </HStack>
      </Box>

      {/* Grid layout cho nội dung */}
      <Flex direction={{ base: "column", lg: "row" }} gap={8} mb={10}>
        {/* Cột thông tin chi tiết sự kiện */}
        <Box flex="2">
          <VStack align="start" spacing={5}>
            {/* Tiêu đề và nút tương tác */}
            <Flex
              w="100%"
              justify="space-between"
              align={{ base: "start", sm: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 4, sm: 0 }}
            >
              <Heading as="h1" size="xl">
                {eventData.title}
              </Heading>

              <HStack spacing={2}>
                <IconButton
                  aria-label="Save event"
                  icon={<FiHeart fill={isSaved ? "red" : "none"} />}
                  onClick={handleSaveEvent}
                  variant="outline"
                  colorScheme={isSaved ? "red" : "gray"}
                />
                <IconButton
                  aria-label="Share event"
                  icon={<FiShare2 />}
                  onClick={handleShare}
                  variant="outline"
                />
              </HStack>
            </Flex>

            {/* Chi tiết về thời gian và địa điểm */}
            <VStack align="start" spacing={3} w="100%">
              <Flex align="center" gap={2}>
                <Box as={FiCalendar} color="teal.500" />
                <Text fontWeight="medium">{eventData.date}</Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color="teal.500" />
                <Text>
                  {eventData.startTime} - {eventData.endTime}
                </Text>
              </Flex>

              <Flex align="start" gap={2}>
                <Box as={FiMapPin} color="teal.500" mt={1} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">{eventData.location}</Text>
                  <Text color="gray.600">{eventData.address}</Text>
                </VStack>
              </Flex>

              {eventData.isPaid && (
                <Flex align="center" gap={2}>
                  <Box as={FiDollarSign} color="teal.500" />
                  <Text fontWeight="bold">{eventData.price} VND</Text>
                </Flex>
              )}

              <Flex align="center" gap={2}>
                <Box as={FiUser} color="teal.500" />
                <Text>
                  {eventData.attendees} registered / {eventData.capacity}{" "}
                  capacity
                </Text>
              </Flex>
            </VStack>

            <Divider />

            {/* Tabs cho nội dung chi tiết và bình luận */}
            <Tabs w="100%" colorScheme="teal" isLazy>
              <TabList>
                <Tab fontWeight="medium">About</Tab>
                <Tab fontWeight="medium">Comments ({comments.length})</Tab>
              </TabList>

              <TabPanels>
                {/* Tab chi tiết sự kiện */}
                <TabPanel px={0}>
                  <VStack align="start" spacing={6}>
                    <Box>
                      <Heading size="md" mb={3}>
                        Description
                      </Heading>
                      <Text whiteSpace="pre-line">{eventData.description}</Text>
                    </Box>

                    <Box w="100%">
                      <Heading size="md" mb={3}>
                        Organizer
                      </Heading>
                      <Flex align="center" gap={3}>
                        <Avatar
                          src={eventData.organizer.avatar}
                          name={eventData.organizer.name}
                          size="md"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">
                            {eventData.organizer.name}
                          </Text>
                          <Text color="gray.600">Event Organizer</Text>
                        </VStack>
                      </Flex>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Tab bình luận */}
                <TabPanel px={0}>
                  <VStack align="start" spacing={6} w="100%">
                    {/* Form đăng bình luận */}
                    <Box w="100%">
                      <FormControl mb={3}>
                        <Textarea
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        colorScheme="teal"
                        onClick={handlePostComment}
                        isDisabled={commentText.trim() === ""}
                      >
                        Post Comment
                      </Button>
                    </Box>

                    <Divider />

                    {/* Danh sách bình luận */}
                    <VStack align="start" spacing={4} w="100%">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <Box
                            key={comment.id}
                            p={4}
                            bg="gray.50"
                            borderRadius="md"
                            w="100%"
                          >
                            <Flex gap={3}>
                              <Avatar
                                src={comment.user.avatar}
                                name={comment.user.name}
                                size="sm"
                              />
                              <Box>
                                <Flex
                                  align="center"
                                  justify="space-between"
                                  w="100%"
                                  mb={1}
                                >
                                  <Text fontWeight="bold">
                                    {comment.user.name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {comment.date}
                                  </Text>
                                </Flex>
                                <Text>{comment.content}</Text>
                              </Box>
                            </Flex>
                          </Box>
                        ))
                      ) : (
                        <Text color="gray.500">
                          No comments yet. Be the first to comment!
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>

        {/* Cột bên phải với thông tin đăng ký */}
        <Box
          flex="1"
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          alignSelf="flex-start"
          position="sticky"
          top="100px"
        >
          <VStack spacing={5} align="stretch">
            <Heading size="md">Registration</Heading>

            <VStack align="start" spacing={3}>
              <Flex align="center" gap={2}>
                <Box as={FiCalendar} color="teal.500" />
                <Text fontWeight="medium">{eventData.date}</Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color="teal.500" />
                <Text>
                  {eventData.startTime} - {eventData.endTime}
                </Text>
              </Flex>
            </VStack>

            <Box bg="gray.50" p={3} borderRadius="md">
              <Text fontWeight="medium">
                {eventData.attendees} people have registered
              </Text>
              <Text fontSize="sm" color="gray.600">
                {eventData.capacity - eventData.attendees} spots left
              </Text>
            </Box>

            <Button
              colorScheme={isRegistered ? "red" : "teal"}
              size="lg"
              onClick={handleRegister}
            >
              {isRegistered ? "Cancel Registration" : "Register for Event"}
            </Button>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              Registration closes 24 hours before event starts
            </Text>
          </VStack>
        </Box>
      </Flex>

      {/* Phần sự kiện liên quan */}
      <Box mt={10}>
        <Heading size="lg" mb={6}>
          Similar Events
        </Heading>
        <Text color="gray.600">
          Coming soon... Similar events will be available when backend is
          connected.
        </Text>
      </Box>
    </Container>
  );
};

export default EventDetail;
