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
  Spinner,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { EventCard, EventCardData } from "../components/events/EventCard";
import { categories } from "../utils/categoryUtils";

// API response interface
interface ApiEventData {
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

const API_URL = "http://localhost:5000/api";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách sự kiện từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_URL}/events?limit=6&upcomingOnly=true`
        );

        if (response.data.success) {
          // Chuyển đổi dữ liệu từ API để phù hợp với interface EventCardData
          const formattedEvents: EventCardData[] = response.data.events.map(
            (event: ApiEventData) => ({
              id: event.id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString("vi-VN"),
              location: event.location,
              imageUrl: event.imageUrl,
              category: event.category,
              isPaid: event.isPaid,
            })
          );

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

  // Handler cho nút "Tạo sự kiện"
  const handleCreateEvent = () => {
    navigate("/become-organizer");
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
              <Heading as="h1" size="2xl" color="white">
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
                    <EventCard key={event.id} event={event} />
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
              {categories.map((category) => (
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
