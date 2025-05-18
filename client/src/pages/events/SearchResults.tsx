import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  Badge,
  useColorModeValue,
  Image,
  Tag,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiMapPin, FiX, FiCalendar, FiTag } from "react-icons/fi";
import { SearchBar } from "../../components/common";
import eventService, { EventFilter } from "../../services/event.service";

// Định nghĩa interface cho event để có type checking
interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  address: string;
}

// API event response interface
interface EventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  address: string;
  [key: string]: string | number | boolean | Date; // Thay thế any bằng union type cụ thể hơn
}

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

// Custom EventCard component tương tự như ở trang Home
const CustomEventCard = memo(({ event }: { event: EventData }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");
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
});

const SearchResults = () => {
  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.800");

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
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventsPerPage = 6;

  // Xử lý tìm kiếm
  const handleSearch = useCallback(() => {
    // Cập nhật URL với các tham số tìm kiếm
    const params: { [key: string]: string } = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (category) params.category = category;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);

    // Lọc sự kiện dựa trên tìm kiếm
    filterEvents();
  }, [keyword, location, category, currentPage, setSearchParams]);

  // Xử lý lọc sự kiện
  const filterEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Tạo đối tượng filter từ state
      const filter: EventFilter = {
        page: currentPage,
        limit: eventsPerPage,
      };

      if (keyword) filter.keyword = keyword;
      if (location) filter.location = location;
      if (category) filter.category = category;
      if (showFreeOnly) filter.isFree = true;
      if (showPaidOnly) filter.isFree = false;

      // Gọi API để lấy danh sách sự kiện đã lọc
      const result = await eventService.getEvents(filter);

      // Chuyển đổi dữ liệu từ API vào định dạng EventData
      const formattedEvents: EventData[] = result.events.map(
        (event: EventResponse) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toLocaleDateString("vi-VN"),
          location: event.location,
          imageUrl: event.imageUrl,
          category: event.category,
          isPaid: event.isPaid,
          address: event.address,
        })
      );

      setFilteredEvents(formattedEvents);
      setTotalPages(result.totalPages);
      setTotalEvents(result.total);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu sự kiện.");
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  }, [
    keyword,
    location,
    category,
    showFreeOnly,
    showPaidOnly,
    currentPage,
    eventsPerPage,
  ]);

  // Chuyển trang - sử dụng useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);

      // Cập nhật URL
      const params: { [key: string]: string } = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (category) params.category = category;
      if (newPage > 1) params.page = newPage.toString();
      setSearchParams(params);

      // Gọi API khi chuyển trang
      filterEvents();
    },
    [keyword, location, category, setSearchParams, filterEvents]
  );

  // Reset tất cả bộ lọc
  const resetFilters = useCallback(() => {
    setKeyword("");
    setLocation("");
    setCategory("");
    setShowFreeOnly(false);
    setShowPaidOnly(false);
    setCurrentPage(1);
    setSearchParams({});
    // Gọi lại API khi reset filter
    filterEvents();
  }, [setSearchParams, filterEvents]);

  // Tải dữ liệu ban đầu khi component mount
  useEffect(() => {
    // Nếu có tham số trong URL, thực hiện tìm kiếm ngay lập tức
    if (
      initialKeyword ||
      initialLocation ||
      initialCategory ||
      initialPage > 1
    ) {
      filterEvents();
    } else {
      // Nếu không có tham số tìm kiếm, vẫn load dữ liệu mặc định (trang 1)
      filterEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format địa điểm cho SearchBar
  const locationOptions = locations.map((loc) => ({ name: loc }));

  // Format danh mục cho SearchBar
  const categoryOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

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

        {/* SearchBar Component */}
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          showFreeOnly={showFreeOnly}
          setShowFreeOnly={setShowFreeOnly}
          showPaidOnly={showPaidOnly}
          setShowPaidOnly={setShowPaidOnly}
          onSearch={handleSearch}
          onReset={resetFilters}
          categories={categoryOptions}
          locations={locationOptions}
          showLocationFilter={true}
          showCategoryFilter={true}
          showPriceFilter={true}
          appliedFilters={{
            location,
            category,
            showFreeOnly,
            showPaidOnly,
          }}
          getCategoryName={getCategoryName}
          mb={6}
        />

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <Box
            textAlign="center"
            py={4}
            px={6}
            mb={6}
            bg="red.50"
            color="red.600"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text>{error}</Text>
          </Box>
        )}

        {/* Hiển thị loading spinner */}
        {loading ? (
          <Center py={10}>
            <Spinner size="xl" color="teal.500" thickness="4px" />
          </Center>
        ) : /* Kết quả tìm kiếm */
        filteredEvents.length > 0 ? (
          <>
            <Flex justify="space-between" align="center" mb={6}>
              <Text color={textColor}>{totalEvents} sự kiện được tìm thấy</Text>
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
                {filteredEvents.map((event) => (
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
