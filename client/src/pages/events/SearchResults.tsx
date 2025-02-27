import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Badge,
  Divider,
  Checkbox,
  Stack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useColorModeValue,
  Image,
  Tag,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiFilter,
  FiX,
  FiCalendar,
  FiTag,
} from "react-icons/fi";

// Định nghĩa interface cho event để có type checking
interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
}

// Dữ liệu mẫu cho sự kiện
const eventsData: EventData[] = [
  {
    id: 1,
    title: "Hội thảo thiết kế UI/UX",
    description:
      "Hội thảo về các nguyên tắc thiết kế giao diện người dùng hiện đại",
    date: "15/08/2023",
    location: "TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "workshop",
    isPaid: false,
  },
  {
    id: 2,
    title: "Hội nghị công nghệ Blockchain",
    description: "Khám phá tiềm năng và ứng dụng của công nghệ blockchain",
    date: "20/08/2023",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    category: "conference",
    isPaid: true,
  },
  {
    id: 3,
    title: "Lễ hội âm nhạc 2023",
    description: "Sự kiện âm nhạc lớn nhất trong năm với các nghệ sĩ hàng đầu",
    date: "10/09/2023",
    location: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
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
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
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
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
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
    image:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "conference",
    isPaid: true,
  },
  {
    id: 7,
    title: "Triển lãm nghệ thuật đương đại",
    description:
      "Chiêm ngưỡng các tác phẩm độc đáo từ các nghệ sĩ trong nước và quốc tế",
    date: "18/09/2023",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "exhibition",
    isPaid: true,
  },
  {
    id: 8,
    title: "Workshop nhiếp ảnh cơ bản",
    description:
      "Học các kỹ thuật nhiếp ảnh cơ bản và cách chỉnh sửa hình ảnh chuyên nghiệp",
    date: "22/08/2023",
    location: "TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80",
    category: "workshop",
    isPaid: true,
  },
  {
    id: 9,
    title: "Cuộc thi lập trình Hackathon",
    description:
      "Giải đấu lập trình trong 48 giờ với nhiều giải thưởng giá trị",
    date: "30/08/2023",
    location: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "networking",
    isPaid: false,
  },
  {
    id: 10,
    title: "Hội chợ công nghệ 2023",
    description:
      "Trưng bày và giới thiệu các sản phẩm công nghệ mới nhất trên thị trường",
    date: "15/09/2023",
    location: "TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "exhibition",
    isPaid: false,
  },
  {
    id: 11,
    title: "Hội thảo khởi nghiệp cho sinh viên",
    description:
      "Chia sẻ kinh nghiệm và định hướng cho sinh viên muốn bắt đầu khởi nghiệp",
    date: "05/10/2023",
    location: "Cần Thơ",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "workshop",
    isPaid: false,
  },
  {
    id: 12,
    title: "Biểu diễn âm nhạc truyền thống",
    description:
      "Thưởng thức các tiết mục âm nhạc dân tộc do các nghệ sĩ tài năng biểu diễn",
    date: "10/10/2023",
    location: "Huế",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "music",
    isPaid: false,
  },
];

// Danh sách địa điểm mẫu
const locations = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Huế",
  "Nha Trang",
];

// Danh sách categories
const categories = [
  { id: "conference", name: "Hội nghị" },
  { id: "workshop", name: "Hội thảo" },
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

const SearchResults = () => {
  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");
  const locationColor = useColorModeValue("gray.600", "gray.400");

  // Lấy query params từ URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // State cho trang tìm kiếm
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const eventsPerPage = 6;

  // Drawer cho filter trên mobile
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Cập nhật URL với các tham số tìm kiếm
    const params: { [key: string]: string } = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (category) params.category = category;
    setSearchParams(params);

    // Lọc sự kiện dựa trên tìm kiếm
    filterEvents();
  };

  // Xử lý lọc sự kiện
  const filterEvents = useCallback(() => {
    let results = [...eventsData];

    // Lọc theo từ khóa
    if (keyword) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(keyword.toLowerCase()) ||
          event.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Lọc theo địa điểm
    if (location) {
      results = results.filter((event) =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (category) {
      results = results.filter((event) => event.category === category);
    }

    // Lọc theo giá (Free/Paid)
    if (showFreeOnly) {
      results = results.filter((event) => !event.isPaid);
    }

    if (showPaidOnly) {
      results = results.filter((event) => event.isPaid);
    }

    setFilteredEvents(results);
  }, [keyword, location, category, showFreeOnly, showPaidOnly]);

  // Tính toán phân trang
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Chuyển trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // Cập nhật URL
    const params: { [key: string]: string } = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (category) params.category = category;
    if (newPage > 1) params.page = newPage.toString();
    setSearchParams(params);
  };

  // Reset tất cả bộ lọc
  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setCategory("");
    setShowFreeOnly(false);
    setShowPaidOnly(false);
    setPriceRange([0, 100]);
    setCurrentPage(1);
    setSearchParams({});
    setFilteredEvents(eventsData);
  };

  // Cập nhật kết quả khi các bộ lọc thay đổi
  useEffect(() => {
    filterEvents();
  }, [
    keyword,
    location,
    category,
    showFreeOnly,
    showPaidOnly,
    priceRange,
    filterEvents,
  ]);

  // Custom EventCard component tương tự như ở trang Home
  const CustomEventCard = ({ event }: { event: EventData }) => {
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
            src={event.image}
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
      <Container maxW="container.xl" py={8}>
        {/* Tiêu đề trang */}
        <Heading as="h1" size="xl" mb={6} color={textColor}>
          {keyword || location || category
            ? "Kết quả tìm kiếm"
            : "Khám phá tất cả sự kiện"}
        </Heading>

        {/* Giới thiệu trang - Chỉ hiển thị khi không có tìm kiếm */}
        {!(keyword || location || category) && (
          <Box mb={8}>
            <Text fontSize="lg" color={textColor} mb={4}>
              Khám phá và tham gia các sự kiện đa dạng từ hội thảo, hội nghị đến
              các lễ hội âm nhạc và giao lưu. Tìm kiếm sự kiện phù hợp với sở
              thích và lịch trình của bạn ngay hôm nay!
            </Text>
          </Box>
        )}

        {/* Desktop: Search & Filter Bar */}
        <Box
          display={{ base: "none", md: "block" }}
          mb={8}
          p={6}
          bg={boxBg}
          borderRadius="lg"
          boxShadow="md"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <Flex direction="column" gap={4}>
            <Flex gap={4}>
              <InputGroup size="md" flexGrow={1}>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={iconColor} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm sự kiện..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  borderColor={borderColor}
                />
              </InputGroup>

              <Button colorScheme="teal" onClick={handleSearch} px={8}>
                Tìm kiếm
              </Button>
            </Flex>

            <Flex gap={4} align="center">
              <InputGroup size="md" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <FiMapPin color={iconColor} />
                </InputLeftElement>
                <Select
                  placeholder="Tất cả địa điểm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  borderColor={borderColor}
                  pl={10}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup size="md" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <FiTag color={iconColor} />
                </InputLeftElement>
                <Select
                  placeholder="Tất cả danh mục"
                  size="md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  borderColor={borderColor}
                  pl={10}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <HStack spacing={4}>
                <Checkbox
                  isChecked={showFreeOnly}
                  onChange={(e) => {
                    setShowFreeOnly(e.target.checked);
                    if (e.target.checked) setShowPaidOnly(false);
                  }}
                >
                  Miễn phí
                </Checkbox>
                <Checkbox
                  isChecked={showPaidOnly}
                  onChange={(e) => {
                    setShowPaidOnly(e.target.checked);
                    if (e.target.checked) setShowFreeOnly(false);
                  }}
                >
                  Có phí
                </Checkbox>
              </HStack>

              <Button
                variant="outline"
                colorScheme="teal"
                size="md"
                leftIcon={<FiX />}
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Mobile: Compact Search & Filter */}
        <Box display={{ base: "block", md: "none" }} mb={6}>
          <Flex gap={2} mb={4}>
            <InputGroup size="md" flex={1}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color={iconColor} />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                borderColor={borderColor}
              />
            </InputGroup>

            <IconButton
              aria-label="Lọc"
              icon={<FiFilter />}
              colorScheme="teal"
              onClick={onOpen}
            />
          </Flex>

          {/* Filter Badges (hiển thị bộ lọc đã chọn) */}
          {(location || category || showFreeOnly || showPaidOnly) && (
            <Flex gap={2} mb={4} flexWrap="wrap">
              {location && (
                <Badge
                  colorScheme="teal"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {location}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setLocation("")}
                  />
                </Badge>
              )}
              {category && (
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {getCategoryName(category)}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setCategory("")}
                  />
                </Badge>
              )}
              {showFreeOnly && (
                <Badge
                  colorScheme="green"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  Miễn phí
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setShowFreeOnly(false)}
                  />
                </Badge>
              )}
              {showPaidOnly && (
                <Badge
                  colorScheme="orange"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  Có phí
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setShowPaidOnly(false)}
                  />
                </Badge>
              )}
            </Flex>
          )}
        </Box>

        {/* Mobile Drawer Filter */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Bộ lọc</DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="stretch" py={4}>
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Địa điểm
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMapPin color={iconColor} />
                    </InputLeftElement>
                    <Select
                      placeholder="Tất cả địa điểm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      pl={10}
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Danh mục
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiTag color={iconColor} />
                    </InputLeftElement>
                    <Select
                      placeholder="Tất cả danh mục"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      pl={10}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Giá
                  </Text>
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={showFreeOnly}
                      onChange={(e) => {
                        setShowFreeOnly(e.target.checked);
                        if (e.target.checked) setShowPaidOnly(false);
                      }}
                    >
                      Miễn phí
                    </Checkbox>
                    <Checkbox
                      isChecked={showPaidOnly}
                      onChange={(e) => {
                        setShowPaidOnly(e.target.checked);
                        if (e.target.checked) setShowFreeOnly(false);
                      }}
                    >
                      Có phí
                    </Checkbox>
                  </Stack>
                </Box>

                <Divider />

                <Button colorScheme="teal" onClick={handleSearch}>
                  Áp dụng
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Kết quả tìm kiếm */}
        {filteredEvents.length > 0 ? (
          <>
            <Flex justify="space-between" align="center" mb={6}>
              <Text color={textColor}>
                {filteredEvents.length} sự kiện được tìm thấy
              </Text>
              {keyword || location || category ? (
                <Button
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  leftIcon={<FiX />}
                  onClick={resetFilters}
                >
                  Xóa tất cả bộ lọc
                </Button>
              ) : null}
            </Flex>

            <Box
              bg={sectionBg}
              p={6}
              borderRadius="lg"
              mb={6}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
                mb={8}
              >
                {currentEvents.map((event) => (
                  <CustomEventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>

              {/* Phân trang đơn giản */}
              {totalPages > 1 && (
                <Flex justify="center" mt={4}>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      isDisabled={currentPage === 1}
                      colorScheme="teal"
                      variant="outline"
                    >
                      Trước
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          size="sm"
                          colorScheme="teal"
                          variant={currentPage === page ? "solid" : "ghost"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      isDisabled={currentPage === totalPages}
                      colorScheme="teal"
                      variant="outline"
                    >
                      Sau
                    </Button>
                  </HStack>
                </Flex>
              )}
            </Box>
          </>
        ) : (
          <Box
            textAlign="center"
            py={10}
            bg={sectionBg}
            borderRadius="lg"
            p={8}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4} color={textColor}>
              Không tìm thấy sự kiện
            </Heading>
            <Text mb={6} color={textColor}>
              Hãy thử điều chỉnh bộ lọc của bạn
            </Text>
            <Button colorScheme="teal" onClick={resetFilters}>
              Xóa bộ lọc
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
