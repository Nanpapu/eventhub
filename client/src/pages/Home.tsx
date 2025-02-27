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
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/events/EventCard";

// Sample event data
const events = [
  {
    id: 1,
    title: "Hội thảo thiết kế UI/UX",
    description:
      "Hội thảo về các nguyên tắc thiết kế giao diện người dùng hiện đại",
    date: "15/08/2023",
    location: "TP. Hồ Chí Minh",
    image: "https://bit.ly/3IZUfQd",
    category: "workshop",
    isPaid: false,
  },
  {
    id: 2,
    title: "Hội nghị công nghệ Blockchain",
    description: "Khám phá tiềm năng và ứng dụng của công nghệ blockchain",
    date: "20/08/2023",
    location: "Hà Nội",
    image: "https://bit.ly/3wIlKgh",
    category: "conference",
    isPaid: true,
  },
  {
    id: 3,
    title: "Lễ hội âm nhạc 2023",
    description: "Sự kiện âm nhạc lớn nhất trong năm với các nghệ sĩ hàng đầu",
    date: "10/09/2023",
    location: "Đà Nẵng",
    image: "https://bit.ly/3IfO5Fh",
    category: "music",
    isPaid: true,
  },
  {
    id: 4,
    title: "Đêm giao lưu startup",
    description:
      "Kết nối với các nhà sáng lập, nhà đầu tư và những người đam mê khởi nghiệp",
    date: "25/08/2023",
    location: "TP. Hồ Chí Minh",
    image: "https://bit.ly/3kpPKS5",
    category: "networking",
    isPaid: false,
  },
  {
    id: 5,
    title: "Lễ hội ẩm thực & văn hóa",
    description:
      "Khám phá các món ẩm thực đa dạng và các tiết mục biểu diễn văn hóa",
    date: "05/09/2023",
    location: "Hà Nội",
    image: "https://bit.ly/3SVagzv",
    category: "food",
    isPaid: false,
  },
  {
    id: 6,
    title: "Hội nghị AI trong kinh doanh",
    description:
      "Tìm hiểu cách AI đang thay đổi doanh nghiệp và các ngành công nghiệp",
    date: "12/09/2023",
    location: "TP. Hồ Chí Minh",
    image: "https://bit.ly/3kD02Jq",
    category: "conference",
    isPaid: true,
  },
];

// Danh mục phổ biến
const popularCategories = [
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
];

const Home = () => {
  const navigate = useNavigate();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.800");

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
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                spacing={8}
                w="100%"
              >
                {events.slice(0, 6).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>
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

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
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
