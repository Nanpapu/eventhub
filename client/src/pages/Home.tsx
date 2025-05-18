import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Tag,
  Icon,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { FiArrowRight, FiCalendar, FiMapPin, FiTag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../utils/formatters";

// Danh sách categories
const categories = [
  { id: "workshop", name: "Hội thảo" },
  { id: "conference", name: "Hội nghị" },
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
const getCategoryName = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Khác";
};

// Tạo interface cho event để có type checking
interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  organizer?: {
    name: string;
    id: string;
    avatar?: string;
  };
}

// Interface cho danh mục
interface CategoryData {
  id: string;
  name: string;
  image: string;
}

// Danh mục phổ biến
const popularCategories: CategoryData[] = [
  {
    id: "workshop",
    name: "Hội thảo",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "conference",
    name: "Hội nghị",
    image:
      "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "music",
    name: "Âm nhạc",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "networking",
    name: "Giao lưu",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "food",
    name: "Ẩm thực",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: "exhibition",
    name: "Triển lãm",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "sports",
    name: "Thể thao",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "tech",
    name: "Công nghệ",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "education",
    name: "Giáo dục",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "health",
    name: "Sức khỏe",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "art",
    name: "Nghệ thuật",
    image:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "business",
    name: "Kinh doanh",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const API_URL = "http://localhost:5000/api";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách sự kiện từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/events?limit=6`);

        if (response.data.success) {
          // Chuyển đổi dữ liệu từ API để phù hợp với interface
          const formattedEvents = response.data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: formatDate(new Date(event.date)),
            location: event.location,
            imageUrl: event.imageUrl,
            category: event.category,
            isPaid: event.isPaid,
            organizer: event.organizer,
          }));

          setEvents(formattedEvents);
        } else {
          setError("Không thể tải danh sách sự kiện");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");

  // Handler cho nút "Tạo sự kiện"
  const handleCreateEvent = () => {
    // TODO: Khi có backend, thêm logic kiểm tra đăng nhập và quyền ở đây
    // Ví dụ:
    // if (!isLoggedIn) {
    //   navigate("/login?redirect=/create-event");
    // } else if (!hasOrganizerPermission) {
    //   navigate("/become-organizer");
    // } else {
    //   navigate("/create-event");
    // }

    // Tạm thời, chỉ điều hướng đến trang đăng ký organizer khi chưa có backend
    navigate("/become-organizer");
  };

  // Tùy chỉnh EventCard component
  const CustomEventCard = ({ event }: { event: EventData }) => {
    const locationColor = useColorModeValue("gray.600", "gray.400");

    return (
      <Box
        as={Link}
        to={`/events/${event.id}`}
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "lg",
          bg: cardHoverBg,
        }}
        transition="all 0.3s"
        sx={{ textDecoration: "none" }}
      >
        <Box position="relative">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width="100%"
            height="180px"
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/400x300?text=Event+Image"
          />
          <Box position="absolute" top={2} right={2}>
            {event.isPaid ? (
              <Badge colorScheme="blue" py={1} px={2} borderRadius="md">
                Trả phí
              </Badge>
            ) : (
              <Badge colorScheme="green" py={1} px={2} borderRadius="md">
                Miễn phí
              </Badge>
            )}
          </Box>
        </Box>

        <Box p={4}>
          <Tag size="sm" bg={tagBg} color={tagColor} mb={2} borderRadius="full">
            <Icon as={FiTag} mr={1} />
            {getCategoryName(event.category)}
          </Tag>

          <Heading as="h3" size="md" mb={2} noOfLines={2}>
            {event.title}
          </Heading>

          <Text fontSize="sm" color={textColor} mb={3} noOfLines={2}>
            {event.description}
          </Text>

          <Flex fontSize="sm" color={locationColor} align="center" mb={2}>
            <Icon as={FiCalendar} mr={2} />
            <Text>{event.date}</Text>
          </Flex>

          <Flex fontSize="sm" color={locationColor} align="center">
            <Icon as={FiMapPin} mr={2} />
            <Text>{event.location}</Text>
          </Flex>
        </Box>
      </Box>
    );
  };

  return (
    <Box bg={bgColor}>
      <Container maxW="100%" px={0}>
        {/* Hero Section */}
        <Box
          bg="teal.500"
          color="white"
          py={{ base: 14, md: 20 }}
          px={8}
          borderRadius="lg"
          mb={10}
          backgroundImage="url('https://bit.ly/3IYSA0D')"
          backgroundSize="cover"
          backgroundPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            borderRadius="lg"
          />
          <Container maxW="container.xl" position="relative">
            <VStack
              spacing={5}
              align={{ base: "center", md: "flex-start" }}
              maxW="container.md"
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading as="h1" size="2xl">
                Tìm và tham gia sự kiện hấp dẫn
              </Heading>
              <Text fontSize="xl" maxW="container.sm">
                Khám phá các sự kiện thú vị đang diễn ra gần bạn và đặt vé ngay
                hôm nay!
              </Text>
              <Flex gap={4}>
                <Button
                  size="lg"
                  colorScheme="teal"
                  onClick={() => navigate("/events")}
                  rightIcon={<FiArrowRight />}
                >
                  Khám phá sự kiện
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                  borderColor="whiteAlpha.400"
                  onClick={handleCreateEvent}
                  title="Tạo sự kiện mới (yêu cầu quyền nhà tổ chức)"
                >
                  Tạo sự kiện
                </Button>
              </Flex>
            </VStack>
          </Container>
        </Box>

        {/* Featured Events Section */}
        <Container maxW="container.xl" mb={16}>
          <VStack spacing={8} align="stretch" w="100%">
            <Flex
              justify="space-between"
              align="center"
              flexWrap={{ base: "wrap", md: "nowrap" }}
              gap={4}
            >
              <Box>
                <Heading size="lg" color={textColor} mb={2}>
                  Sự kiện nổi bật
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Khám phá những sự kiện được quan tâm nhiều nhất
                </Text>
              </Box>
              <Button
                as={Link}
                to="/events"
                variant="outline"
                colorScheme="teal"
                rightIcon={<FiArrowRight />}
                sx={{ textDecoration: "none" }}
                size="md"
              >
                Xem tất cả sự kiện
              </Button>
            </Flex>

            <Box
              bg={sectionBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              {loading ? (
                <Flex justify="center" align="center" minH="300px">
                  <Spinner size="xl" color="teal.500" thickness="4px" />
                </Flex>
              ) : error ? (
                <Flex
                  justify="center"
                  align="center"
                  minH="200px"
                  direction="column"
                  gap={4}
                >
                  <Text color="red.500" fontSize="lg">
                    {error}
                  </Text>
                  <Button
                    colorScheme="teal"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </Flex>
              ) : events.length === 0 ? (
                <Flex justify="center" align="center" minH="200px">
                  <Text fontSize="lg" color={textColor}>
                    Không có sự kiện nào. Hãy quay lại sau!
                  </Text>
                </Flex>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  spacing={8}
                  w="100%"
                >
                  {events.map((event) => (
                    <CustomEventCard key={event.id} event={event} />
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </VStack>
        </Container>

        {/* Popular Categories */}
        <Container maxW="container.xl" mb={16}>
          <VStack spacing={8} align="stretch" w="100%">
            <Box>
              <Heading size="lg" color={textColor} mb={2}>
                Danh mục phổ biến
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Tìm sự kiện theo danh mục yêu thích của bạn
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {popularCategories.map((category) => (
                <Box
                  key={category.id}
                  as={Link}
                  to={`/events?category=${category.id}`}
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                  height="180px"
                  _hover={{ transform: "translateY(-5px)" }}
                  transition="all 0.3s"
                  boxShadow="md"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    backgroundImage={`url(${category.image})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    zIndex={0}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    zIndex={1}
                  />
                  <Flex
                    position="relative"
                    zIndex={2}
                    height="100%"
                    align="center"
                    justify="center"
                    p={4}
                    direction="column"
                  >
                    <Heading size="md" color="white" textAlign="center">
                      {category.name}
                    </Heading>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Join as Organizer Section */}
        <Box
          position="relative"
          py={20}
          px={8}
          borderRadius="xl"
          mb={16}
          overflow="hidden"
          boxShadow="xl"
        >
          {/* Background với gradient overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundImage="url('https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
            backgroundSize="cover"
            backgroundPosition="center"
            zIndex={0}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(to-r, teal.600, rgba(49, 151, 149, 0.9), rgba(38, 166, 154, 0.8))"
            zIndex={1}
          />

          <Container maxW="container.xl" position="relative" zIndex={2}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
            >
              <VStack
                spacing={6}
                align={{ base: "center", md: "flex-start" }}
                maxW={{ md: "60%" }}
                mb={{ base: 10, md: 0 }}
              >
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color="teal.100"
                    mb={2}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Dành cho nhà tổ chức
                  </Text>
                  <Heading
                    as="h2"
                    size="2xl"
                    color="white"
                    lineHeight="1.2"
                    textShadow="0px 2px 4px rgba(0,0,0,0.2)"
                  >
                    Trở thành nhà tổ chức sự kiện
                  </Heading>
                </Box>

                <Text
                  fontSize="xl"
                  maxW="container.md"
                  color="white"
                  textShadow="0px 1px 2px rgba(0,0,0,0.1)"
                >
                  Bạn có ý tưởng cho một sự kiện tuyệt vời? Hãy đăng ký trở
                  thành nhà tổ chức và bắt đầu tạo các sự kiện của riêng bạn
                  ngay hôm nay!
                </Text>

                <Button
                  size="lg"
                  colorScheme="teal"
                  color="teal.900"
                  bg="white"
                  _hover={{ bg: "gray.100" }}
                  px={8}
                  py={6}
                  fontWeight="bold"
                  as={Link}
                  to="/become-organizer"
                  sx={{ textDecoration: "none" }}
                  boxShadow="md"
                >
                  Bắt đầu ngay
                </Button>
              </VStack>

              <Box
                bg="white"
                p={4}
                borderRadius="xl"
                boxShadow="xl"
                width={{ base: "100%", md: "35%" }}
                display={{ base: "none", md: "block" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Nhà tổ chức sự kiện"
                  width="100%"
                  height="auto"
                  borderRadius="lg"
                  fallbackSrc="https://via.placeholder.com/400x300?text=Event+Organizing"
                />
              </Box>
            </Flex>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
