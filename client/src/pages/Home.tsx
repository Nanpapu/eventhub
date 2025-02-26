import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiMapPin, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    category: string;
    isPaid: boolean;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      <Image
        src={event.image}
        alt={event.title}
        width="100%"
        height="200px"
        objectFit="cover"
      />

      <Box p={5}>
        <Box display="flex" alignItems="baseline">
          <Box
            color={metaColor}
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {event.isPaid ? "Trả phí" : "Miễn phí"} &bull;{" "}
            {event.category === "workshop"
              ? "Hội thảo"
              : event.category === "conference"
              ? "Hội nghị"
              : event.category === "music"
              ? "Âm nhạc"
              : event.category === "networking"
              ? "Giao lưu"
              : event.category === "food"
              ? "Ẩm thực"
              : event.category}
          </Box>
        </Box>

        <Heading size="md" my={2} isTruncated color={textColor}>
          {event.title}
        </Heading>

        <Text noOfLines={2} mb={3} color={textColor}>
          {event.description}
        </Text>

        <Flex align="center" color={metaColor} fontSize="sm" mb={2}>
          <FiCalendar />
          <Text ml={2}>{event.date}</Text>
        </Flex>

        <Flex align="center" color={metaColor} fontSize="sm" mb={4}>
          <FiMapPin />
          <Text ml={2}>{event.location}</Text>
        </Flex>

        <Button
          as={Link}
          to={`/events/${event.id}`}
          colorScheme="teal"
          width="full"
          sx={{ textDecoration: "none" }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Box>
  );
};

const Home = () => {
  // Thêm state cho form tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const navigate = useNavigate();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const sectionBg = useColorModeValue("gray.50", "gray.800");

  // Xử lý submit form tìm kiếm
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (searchLocation) params.append("location", searchLocation);
    if (searchCategory) params.append("category", searchCategory);

    navigate(`/events?${params.toString()}`);
  };

  return (
    <Box bg={bgColor}>
      <Container maxW="100%" px={0}>
        {/* Hero Section */}
        <Box
          bg="teal.500"
          color="white"
          py={20}
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
          <VStack
            spacing={5}
            position="relative"
            align="flex-start"
            maxW="container.md"
          >
            <Heading as="h1" size="2xl">
              Tìm và tham gia sự kiện hấp dẫn
            </Heading>
            <Text fontSize="xl" maxW="container.sm">
              Khám phá các sự kiện thú vị đang diễn ra gần bạn và đặt vé ngay
              hôm nay!
            </Text>
            <Button
              size="lg"
              colorScheme="teal"
              onClick={() => navigate("/events")}
            >
              Khám phá sự kiện
            </Button>
          </VStack>
        </Box>

        {/* Search Section */}
        <Container maxW="container.xl" mb={12}>
          <VStack spacing={5} align="stretch" w="100%">
            <Heading size="lg" color={textColor}>
              Tìm kiếm sự kiện
            </Heading>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              bg={sectionBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              {/* Keyword Input */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={iconColor} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Tên sự kiện, chủ đề..."
                  bg={inputBg}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  borderColor={borderColor}
                />
              </InputGroup>

              {/* Location Input */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiMapPin color={iconColor} />
                </InputLeftElement>
                <Input
                  placeholder="Địa điểm"
                  bg={inputBg}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  borderColor={borderColor}
                />
              </InputGroup>

              {/* Category Select */}
              <Select
                placeholder="Chọn danh mục"
                bg={inputBg}
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                borderColor={borderColor}
              >
                <option value="workshop">Hội thảo</option>
                <option value="conference">Hội nghị</option>
                <option value="music">Âm nhạc</option>
                <option value="networking">Giao lưu</option>
                <option value="food">Ẩm thực</option>
              </Select>

              <Button colorScheme="teal" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </Stack>
          </VStack>
        </Container>

        {/* Featured Events Section */}
        <Container maxW="container.xl" mb={16}>
          <VStack spacing={5} align="flex-start" w="100%" mb={6}>
            <Heading size="lg" color={textColor}>
              Sự kiện nổi bật
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Khám phá những sự kiện được quan tâm nhiều nhất trong thời gian
              gần đây
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            spacing={10}
            mb={8}
            w="100%"
          >
            {events.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>

          <Flex justify="center">
            <Button
              colorScheme="teal"
              variant="outline"
              size="lg"
              as={Link}
              to="/events"
              sx={{ textDecoration: "none" }}
            >
              Xem tất cả sự kiện
            </Button>
          </Flex>
        </Container>

        {/* Join as Organizer Section */}
        <Box
          bg="teal.500"
          color="white"
          py={16}
          px={8}
          borderRadius="lg"
          mb={16}
        >
          <Container maxW="container.xl">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
            >
              <VStack
                spacing={4}
                align={{ base: "center", md: "flex-start" }}
                maxW={{ md: "60%" }}
                mb={{ base: 6, md: 0 }}
              >
                <Heading as="h2" size="xl">
                  Trở thành nhà tổ chức sự kiện
                </Heading>
                <Text fontSize="lg" maxW="container.md">
                  Bạn có ý tưởng cho một sự kiện tuyệt vời? Hãy đăng ký trở
                  thành nhà tổ chức và bắt đầu tạo các sự kiện của riêng bạn
                  ngay hôm nay!
                </Text>
                <Button
                  size="lg"
                  colorScheme="white"
                  variant="outline"
                  _hover={{ bg: "whiteAlpha.200" }}
                  as={Link}
                  to="/become-organizer"
                  sx={{ textDecoration: "none" }}
                >
                  Bắt đầu ngay
                </Button>
              </VStack>

              <Image
                src="https://bit.ly/3qJyXvj"
                alt="Event Organizer"
                width={{ base: "100%", md: "35%" }}
                height="auto"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/400x300?text=Event+Organizing"
              />
            </Flex>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
