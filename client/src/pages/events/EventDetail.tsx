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
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import { FaTimes, FaCalendarCheck, FaShoppingCart } from "react-icons/fa";

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
  image: "https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg",
  category: "workshop",
  isPaid: true,
  price: 25.99,
  organizer: {
    name: "TechDesign Academy",
    avatar:
      "https://ui-avatars.com/api/?name=TechDesign+Academy&background=0D8ABC&color=fff",
  },
  attendees: 42,
  capacity: 50,
};

const EventDetail = () => {
  // Lấy ID sự kiện từ URL nhưng không sử dụng
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  // State cho các trạng thái trong trang
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const infoBoxBgColor = useColorModeValue("gray.50", "gray.700");
  const infoBoxTextColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("teal.500", "teal.300");

  // Xử lý đăng ký tham gia sự kiện
  const handleRegister = () => {
    // Nếu đã đăng ký, hủy đăng ký
    if (isRegistered) {
      setIsRegistered(false);
      toast({
        title: "Hủy đăng ký thành công",
        description: "Bạn đã hủy đăng ký tham gia sự kiện này.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    /* 
      TODO: Khi có backend, cần thực hiện các bước:
      1. Gọi API để đăng ký sự kiện (POST /api/events/:id/register)
      2. Kiểm tra nếu sự kiện có phí:
         - Lưu trạng thái đăng ký là "pending"
         - Chuyển người dùng đến trang thanh toán
      3. Nếu sự kiện miễn phí:
         - Lưu trạng thái đăng ký là "confirmed"
         - Hiển thị thông báo thành công
    */

    // DEMO: Luôn đăng ký thành công cho sự kiện miễn phí
    setIsRegistered(true);
    toast({
      title: "Đăng ký thành công!",
      description: "Bạn đã đăng ký tham gia sự kiện này thành công.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý lưu sự kiện
  const handleSaveEvent = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Đã xóa khỏi sự kiện đã lưu" : "Đã lưu sự kiện!",
      description: isSaved
        ? "Sự kiện đã được xóa khỏi danh sách đã lưu của bạn."
        : "Bạn có thể xem lại sự kiện này trong mục 'Sự kiện đã lưu'.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý chia sẻ sự kiện
  const handleShare = () => {
    // Logic chia sẻ sẽ được thêm sau khi có backend
    toast({
      title: "Đã sao chép liên kết!",
      description: "Liên kết sự kiện đã được sao chép vào clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý chuyển tới trang thanh toán
  const handleBuyTicket = () => {
    /*
      TODO: Khi có backend, logic sẽ như sau:
      1. Gọi API để tạo đơn hàng (POST /api/events/:id/checkout)
      2. API trả về thông tin đơn hàng bao gồm paymentUrl
      3. Chuyển người dùng đến trang thanh toán (paymentUrl)
      4. Sau khi thanh toán, webhook sẽ cập nhật trạng thái đăng ký thành "confirmed"
      5. Chuyển người dùng trở lại trang chi tiết sự kiện với trạng thái đã đăng ký
    */

    // DEMO: Chỉ chuyển hướng đến trang thanh toán giả lập
    navigate(`/events/${id}/checkout`);
    toast({
      title: "Chuyển đến thanh toán",
      description: "Hoàn tất thanh toán để đảm bảo đăng ký của bạn.",
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
            {eventData.isPaid ? "Có phí" : "Miễn phí"}
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
                <Box as={FiUsers} color={iconColor} />
                <Text color={textColor}>
                  {eventData.attendees} đã đăng ký / {eventData.capacity} chỗ
                </Text>
              </Flex>

              <Flex align="center" gap={2} w="100%">
                <Box as={FiUsers} color={iconColor} />
                <Text fontWeight="medium">Tổ chức:</Text>
                <Text>{eventData.organizer.name}</Text>
              </Flex>
            </VStack>

            <Divider borderColor={borderColor} />

            {/* Mô tả sự kiện */}
            <Box>
              <Heading as="h3" size="md" mb={3} color={textColor}>
                Về Sự Kiện Này
              </Heading>
              <Text color={textColor}>{eventData.description}</Text>
            </Box>
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
              Đăng Ký
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
                {eventData.attendees} người đã đăng ký
              </Text>
              <Text fontSize="sm" color={infoBoxTextColor}>
                Còn {eventData.capacity - eventData.attendees} chỗ trống
              </Text>
            </Box>

            {/* Hiển thị trạng thái đăng ký */}
            {isRegistered && (
              <Box
                bg="green.50"
                color="green.700"
                p={3}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="green.400"
                _dark={{
                  bg: "green.900",
                  color: "green.200",
                  borderColor: "green.500",
                }}
              >
                <Flex align="center" gap={2}>
                  <Box as={FaCalendarCheck} />
                  <Text fontWeight="medium">
                    Bạn đã đăng ký tham gia sự kiện này
                  </Text>
                </Flex>
              </Box>
            )}

            {/* Phần điều khiển: đăng ký và mua vé */}
            <Box w="full" display="flex" flexDirection="column" gap={4} mt={6}>
              {/* 
                TODO: Khi có backend, điều kiện hiển thị nút sẽ như sau:
                - Nếu sự kiện miễn phí: Chỉ hiển thị nút "Đăng Ký Tham Gia"
                - Nếu sự kiện có phí: Chỉ hiển thị nút "Mua Vé"
                - Nếu người dùng đã đăng ký:
                  + Nếu sự kiện miễn phí: Hiển thị nút "Hủy Đăng Ký"
                  + Nếu sự kiện có phí: Hiển thị nút "Xem Vé" 
                
                DEMO: Hiện tại hiển thị cả hai nút để dễ demo
              */}

              {/* Nút đăng ký - luôn hiển thị trong chế độ demo */}
              <Button
                colorScheme={isRegistered ? "red" : "teal"}
                size="lg"
                width="full"
                onClick={handleRegister}
                leftIcon={isRegistered ? <FaTimes /> : <FaCalendarCheck />}
                variant={isRegistered ? "solid" : "solid"}
              >
                {isRegistered ? "Hủy Đăng Ký" : "Đăng Ký Tham Gia"}
              </Button>

              {/* Nút mua vé - luôn hiển thị trong chế độ demo */}
              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                onClick={handleBuyTicket}
                leftIcon={<FaShoppingCart />}
              >
                Mua Vé
              </Button>

              {/* Logic thông thường sẽ như sau:
                {!eventData.isPaid ? (
                  <Button
                    colorScheme={isRegistered ? "red" : "teal"}
                    size="lg"
                    width="full"
                    onClick={handleRegister}
                    leftIcon={isRegistered ? <FaTimes /> : <FaCalendarCheck />}
                  >
                    {isRegistered ? "Hủy Đăng Ký" : "Đăng Ký Tham Gia"}
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    onClick={handleBuyTicket}
                    leftIcon={<FaShoppingCart />}
                  >
                    Mua Vé
                  </Button>
                )}
              */}
            </Box>
          </VStack>
        </Box>
      </Flex>

      {/* Phần sự kiện liên quan */}
      <Box mt={10}>
        <Heading size="lg" mb={6} color={textColor}>
          Sự Kiện Tương Tự
        </Heading>
        <Text color={secondaryTextColor}>
          Sắp ra mắt... Sự kiện tương tự sẽ được hiển thị khi kết nối với
          backend.
        </Text>
      </Box>
    </Container>
  );
};

export default EventDetail;
