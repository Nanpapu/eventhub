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
  useToast,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiShare2,
  FiHeart,
  FiClock,
  FiDollarSign,
  FiShoppingCart,
} from "react-icons/fi";
import { EventReview } from "../../components/events";

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
  isPaid: true,
  price: 25.99,
  organizer: {
    name: "TechDesign Academy",
    avatar: "https://bit.ly/3Q3eQvj",
  },
  attendees: 42,
  capacity: 50,
};

// Dữ liệu mẫu cho bình luận - không còn sử dụng nhưng giữ lại làm tài liệu
// const commentsData: Comment[] = [ ... ];

const EventDetail = () => {
  // Lấy ID sự kiện từ URL nhưng không sử dụng
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  // State cho các trạng thái trong trang
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // State comments không còn sử dụng sau khi gộp với reviews
  // const [commentText, setCommentText] = useState("");
  // const [comments, setComments] = useState<Comment[]>(commentsData);

  // Màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const tabBgColor = useColorModeValue("gray.50", "gray.900");
  const infoBoxBgColor = useColorModeValue("gray.50", "gray.700");
  const infoBoxTextColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("teal.500", "teal.300");

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

  // Xử lý chuyển tới trang thanh toán
  const handleBuyTicket = () => {
    navigate(`/events/${id}/checkout`);
    toast({
      title: "Proceeding to checkout",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Phần hình ảnh và thông tin cơ bản của sự kiện */}
      <Box position="relative" mb={8} bg={bgColor} borderRadius="lg">
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
        <Box
          flex="2"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <VStack align="start" spacing={5}>
            {/* Tiêu đề và nút tương tác */}
            <Flex
              w="100%"
              justify="space-between"
              align={{ base: "start", sm: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 4, sm: 0 }}
            >
              <Heading as="h1" size="xl" color={textColor}>
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
                <Box as={FiCalendar} color={iconColor} />
                <Text fontWeight="medium" color={textColor}>
                  {eventData.date}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color={iconColor} />
                <Text color={textColor}>
                  {eventData.startTime} - {eventData.endTime}
                </Text>
              </Flex>

              <Flex align="start" gap={2}>
                <Box as={FiMapPin} color={iconColor} mt={1} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" color={textColor}>
                    {eventData.location}
                  </Text>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    {eventData.address}
                  </Text>
                </VStack>
              </Flex>

              {eventData.isPaid && (
                <Flex align="center" gap={2}>
                  <Box as={FiDollarSign} color={iconColor} />
                  <Text fontWeight="bold" color={textColor}>
                    {eventData.price} VND
                  </Text>
                </Flex>
              )}

              <Flex align="center" gap={2}>
                <Box as={FiUser} color={iconColor} />
                <Text color={textColor}>
                  {eventData.attendees} registered / {eventData.capacity}{" "}
                  capacity
                </Text>
              </Flex>
            </VStack>

            <Divider borderColor={borderColor} />

            {/* Mô tả sự kiện */}
            <Box>
              <Heading as="h3" size="md" mb={3} color={textColor}>
                About This Event
              </Heading>
              <Text color={textColor}>{eventData.description}</Text>
            </Box>

            {/* Phần tabs cho thông tin chi tiết */}
            <Tabs
              isFitted
              w="100%"
              mt={4}
              colorScheme="teal"
              variant="enclosed"
            >
              <TabList bg={tabBgColor} borderRadius="md" p={1}>
                <Tab _selected={{ bg: cardBgColor, color: textColor }}>
                  Details
                </Tab>
                <Tab _selected={{ bg: cardBgColor, color: textColor }}>
                  Reviews & Comments
                </Tab>
              </TabList>
              <TabPanels mt={4}>
                {/* Details Tab */}
                <TabPanel p={0}>
                  <VStack align="start" spacing={4} color={textColor}>
                    <Flex align="center" gap={2} w="100%">
                      <Box as={FiUser} color={iconColor} />
                      <Text fontWeight="medium">Organizer:</Text>
                      <Text>{eventData.organizer.name}</Text>
                    </Flex>
                  </VStack>
                </TabPanel>

                {/* Reviews & Comments Tab */}
                <TabPanel p={0}>
                  <VStack align="start" spacing={4}>
                    <EventReview rating={4.5} reviewCount={32} />
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>

        {/* Cột thông tin đăng ký và chi tiết */}
        <Box
          flex="1"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          height="fit-content"
          position="sticky"
          top="100px"
          bg={cardBgColor}
          borderColor={borderColor}
        >
          <VStack spacing={5} align="stretch">
            <Heading size="md" color={textColor}>
              Registration
            </Heading>

            <VStack align="start" spacing={3}>
              <Flex align="center" gap={2}>
                <Box as={FiCalendar} color={iconColor} />
                <Text fontWeight="medium" color={textColor}>
                  {eventData.date}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color={iconColor} />
                <Text color={textColor}>
                  {eventData.startTime} - {eventData.endTime}
                </Text>
              </Flex>
            </VStack>

            <Box bg={infoBoxBgColor} p={3} borderRadius="md">
              <Text fontWeight="medium" color={textColor}>
                {eventData.attendees} people have registered
              </Text>
              <Text fontSize="sm" color={infoBoxTextColor}>
                {eventData.capacity - eventData.attendees} spots left
              </Text>
            </Box>

            {/* Nút đăng ký và mua vé */}
            <VStack spacing={3} width="100%">
              <Button
                colorScheme={isRegistered ? "red" : "teal"}
                size="lg"
                onClick={handleRegister}
                width="100%"
              >
                {isRegistered ? "Cancel Registration" : "Register for Event"}
              </Button>

              {eventData.isPaid && eventData.price && (
                <Button
                  colorScheme="purple"
                  size="lg"
                  width="100%"
                  leftIcon={<FiShoppingCart />}
                  onClick={handleBuyTicket}
                >
                  Buy Ticket - ${eventData.price.toFixed(2)}
                </Button>
              )}

              <Text fontSize="sm" color={infoBoxTextColor} textAlign="center">
                Registration closes 24 hours before event starts
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Flex>

      {/* Phần sự kiện liên quan */}
      <Box mt={10}>
        <Heading size="lg" mb={6} color={textColor}>
          Similar Events
        </Heading>
        <Text color={secondaryTextColor}>
          Coming soon... Similar events will be available when backend is
          connected.
        </Text>
      </Box>
    </Container>
  );
};

export default EventDetail;
