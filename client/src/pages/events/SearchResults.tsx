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
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiMapPin, FiX, FiCalendar, FiTag } from "react-icons/fi";
import { SearchBar } from "../../components/common";
import eventService, { EventFilter } from "../../services/event.service";
// import { useTranslation } from "react-i18next"; // Biến t không được sử dụng, có thể xóa hoặc comment

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

  const [searchParams, setSearchParams] = useSearchParams();

  // State cho các filter đã được áp dụng để fetch dữ liệu
  const [appliedKeyword, setAppliedKeyword] = useState(
    () => searchParams.get("keyword") || ""
  );
  const [appliedLocation, setAppliedLocation] = useState(
    () => searchParams.get("location") || ""
  );
  const [appliedCategory, setAppliedCategory] = useState(
    () => searchParams.get("category") || ""
  );
  const [appliedShowFreeOnly, setAppliedShowFreeOnly] = useState(
    () => searchParams.get("free") === "true"
  );
  const [appliedShowPaidOnly, setAppliedShowPaidOnly] = useState(
    () => searchParams.get("paid") === "true"
  );
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1", 10)
  );

  // State cho các giá trị đang được chọn trong SearchBar (chưa áp dụng)
  const [tempKeyword, setTempKeyword] = useState(appliedKeyword);
  const [tempLocation, setTempLocation] = useState(appliedLocation);
  const [tempCategory, setTempCategory] = useState(appliedCategory);
  const [tempShowFreeOnly, setTempShowFreeOnly] = useState(appliedShowFreeOnly);
  const [tempShowPaidOnly, setTempShowPaidOnly] = useState(appliedShowPaidOnly);

  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventsPerPage = 6;

  // Hàm kiểm tra xem có filter nào đang được áp dụng không
  const areFiltersApplied = useCallback(() => {
    return !!(
      appliedKeyword ||
      appliedLocation ||
      appliedCategory ||
      appliedShowFreeOnly ||
      appliedShowPaidOnly
    );
  }, [
    appliedKeyword,
    appliedLocation,
    appliedCategory,
    appliedShowFreeOnly,
    appliedShowPaidOnly,
  ]);

  const fetchAndFilterEvents = useCallback(
    async (pageToFetch: number, filters: EventFilter) => {
      console.log("[fetchAndFilterEvents] Called with:", {
        pageToFetch,
        filters,
      });
      setLoading(true);
      setError(null);

      const apiFilter: EventFilter = {
        page: pageToFetch,
        limit: eventsPerPage,
      };

      if (filters.keyword) apiFilter.keyword = filters.keyword;
      if (filters.location) apiFilter.location = filters.location;
      if (filters.category) apiFilter.category = filters.category;
      if (filters.isFree !== undefined) apiFilter.isFree = filters.isFree;

      console.log("[fetchAndFilterEvents] API Filter to be sent:", apiFilter);

      try {
        const response = await eventService.getEvents(apiFilter);
        console.log("[fetchAndFilterEvents] API Response received:", response);

        if (response && response.events && response.pagination) {
          const formattedEvents: EventData[] = response.events.map(
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
          setTotalEvents(response.pagination.total);
          setTotalPages(
            response.pagination.totalPages > 0
              ? response.pagination.totalPages
              : 1
          );
        } else {
          console.error(
            "[fetchAndFilterEvents] Invalid API response structure:",
            response
          );
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        console.error("[fetchAndFilterEvents] Error fetching events:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi tải dữ liệu sự kiện."
        );
        setFilteredEvents([]);
        setTotalEvents(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [eventsPerPage]
  );

  // Effect để fetch dữ liệu khi filter hoặc page thay đổi
  useEffect(() => {
    const currentFilters: EventFilter = {
      keyword: appliedKeyword,
      location: appliedLocation,
      category: appliedCategory,
      isFree: appliedShowFreeOnly
        ? true
        : appliedShowPaidOnly
        ? false
        : undefined,
    };
    console.log(
      `[useEffect appliedFilters/currentPage] Triggered. Page: ${currentPage}, Filters:`,
      currentFilters
    );
    fetchAndFilterEvents(currentPage, currentFilters);

    // Cập nhật URL params
    const newSearchParams = new URLSearchParams();
    if (appliedKeyword) newSearchParams.set("keyword", appliedKeyword);
    if (appliedLocation) newSearchParams.set("location", appliedLocation);
    if (appliedCategory) newSearchParams.set("category", appliedCategory);
    if (appliedShowFreeOnly) newSearchParams.set("free", "true");
    else if (appliedShowPaidOnly) newSearchParams.set("paid", "true");

    if (currentPage > 1) {
      newSearchParams.set("page", currentPage.toString());
    } else {
      newSearchParams.delete("page");
    }

    // Chỉ gọi setSearchParams nếu có sự thay đổi thực sự
    // Lấy search string hiện tại từ window.location để so sánh chính xác hơn
    const currentSearchString = window.location.search.substring(1); // Bỏ dấu '?'
    if (newSearchParams.toString() !== currentSearchString) {
      console.log(
        "[useEffect appliedFilters/currentPage] Updating URL Search Params:",
        newSearchParams.toString()
      );
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [
    appliedKeyword,
    appliedLocation,
    appliedCategory,
    appliedShowFreeOnly,
    appliedShowPaidOnly,
    currentPage,
    fetchAndFilterEvents,
    setSearchParams,
  ]);

  const handleApplySearch = useCallback(() => {
    console.log("[handleApplySearch] Applying search with temp filters:", {
      tempKeyword,
      tempLocation,
      tempCategory,
      tempShowFreeOnly,
      tempShowPaidOnly,
    });
    setAppliedKeyword(tempKeyword);
    setAppliedLocation(tempLocation);
    setAppliedCategory(tempCategory);
    setAppliedShowFreeOnly(tempShowFreeOnly);
    setAppliedShowPaidOnly(tempShowPaidOnly);
    setCurrentPage(1);
  }, [
    tempKeyword,
    tempLocation,
    tempCategory,
    tempShowFreeOnly,
    tempShowPaidOnly,
  ]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log(`[handlePageChange] Changing to page: ${newPage}`);
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        console.log(
          `[handlePageChange] Page change to ${newPage} aborted. Conditions not met: totalPages=${totalPages}, currentPage=${currentPage}`
        );
      }
    },
    [totalPages, currentPage]
  );

  const handleResetFilters = useCallback(() => {
    console.log("[handleResetFilters] Resetting all filters.");
    setTempKeyword("");
    setTempLocation("");
    setTempCategory("");
    setTempShowFreeOnly(false);
    setTempShowPaidOnly(false);

    setAppliedKeyword("");
    setAppliedLocation("");
    setAppliedCategory("");
    setAppliedShowFreeOnly(false);
    setAppliedShowPaidOnly(false);
    setCurrentPage(1);
  }, []);

  const locationOptions = locations.map((loc) => ({ name: loc }));
  const categoryOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  const renderPaginationControls = () => {
    console.log("---- [renderPaginationControls] Debug Info ----");
    console.log("Current Page (state):", currentPage);
    console.log("Total Events (state):", totalEvents);
    console.log("Total Pages (state, from server):", totalPages);
    console.log("Events Per Page (constant):", eventsPerPage);
    console.log("Is Loading (state):", loading);
    console.log("----------------------------------------------");

    if (loading && totalEvents === 0 && currentPage === 1) {
      return null;
    }

    if (totalPages <= 1 || totalEvents === 0) {
      return null;
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          size="sm"
          colorScheme="teal"
          variant={currentPage === i ? "solid" : "ghost"}
          onClick={() => handlePageChange(i)}
          isDisabled={loading}
          mx={1}
        >
          {i}
        </Button>
      );
    }

    return (
      <Flex justify="center" mt={8} mb={4}>
        <HStack spacing={2}>
          <Button
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            isDisabled={currentPage === 1 || loading}
            colorScheme="teal"
            variant="outline"
          >
            Trước
          </Button>
          {pageNumbers}
          <Button
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            isDisabled={currentPage === totalPages || loading}
            colorScheme="teal"
            variant="outline"
          >
            Sau
          </Button>
        </HStack>
      </Flex>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
      );
    }

    if (error) {
      return (
        <Center flexDirection="column" h="200px">
          <Text color="red.500" mb={4}>
            {error}
          </Text>
          {/* Nút Clear Filters khi có lỗi */}
          {areFiltersApplied() && (
            <Button
              colorScheme="red" // Đổi màu thành đỏ
              onClick={handleResetFilters}
              leftIcon={<Icon as={FiX} />}
              size="sm"
            >
              Clear Filters and Retry
            </Button>
          )}
        </Center>
      );
    }

    if (filteredEvents.length > 0) {
      return (
        <>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb={6}
            p={4}
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="md"
          >
            <Text fontSize="lg" fontWeight="medium">
              {totalEvents} event{totalEvents !== 1 ? "s" : ""} found
              {appliedKeyword && ` for "${appliedKeyword}"`}
              {appliedLocation && ` in "${appliedLocation}"`}
              {appliedCategory &&
                ` under "${getCategoryName(appliedCategory)}"`}
              {areFiltersApplied()
                ? " with applied filters"
                : " without filters"}
              .
            </Text>
            {/* Không còn nút Clear Filters ở đây nữa */}
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8}>
            {filteredEvents.map((event) => (
              <CustomEventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>
          {renderPaginationControls()}
        </>
      );
    }

    return (
      <Center flexDirection="column" py={10} px={6} textAlign="center">
        <Icon as={FiTag} boxSize={"50px"} color={"orange.300"} mb={4} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          No events found
        </Heading>
        <Text color={"gray.500"} mb={6}>
          Sorry, we couldn't find any events matching your criteria.
        </Text>
        {areFiltersApplied() && (
          <Button
            colorScheme="red" // Đổi màu thành đỏ
            onClick={handleResetFilters}
            leftIcon={<Icon as={FiX} />}
            size="lg"
            mt={4}
          >
            Clear All Filters
          </Button>
        )}
      </Center>
    );
  };

  return (
    <Box bg={useColorModeValue("white", "gray.900")}>
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" mb={6} color={textColor}>
          {areFiltersApplied() ? "Kết quả tìm kiếm" : "Khám phá tất cả sự kiện"}
        </Heading>

        {!areFiltersApplied() && (
          <Box mb={8}>
            <Text fontSize="lg" color={textColor} mb={4}>
              Khám phá và tham gia các sự kiện đa dạng từ hội thảo, hội nghị đến
              các lễ hội âm nhạc và giao lưu. Tìm kiếm sự kiện phù hợp với sở
              thích và lịch trình của bạn ngay hôm nay!
            </Text>
          </Box>
        )}

        <SearchBar
          keyword={tempKeyword}
          setKeyword={setTempKeyword}
          location={tempLocation}
          setLocation={setTempLocation}
          category={tempCategory}
          setCategory={setTempCategory}
          showFreeOnly={tempShowFreeOnly}
          setShowFreeOnly={(value) => {
            setTempShowFreeOnly(value);
            if (value) setTempShowPaidOnly(false);
          }}
          showPaidOnly={tempShowPaidOnly}
          setShowPaidOnly={(value) => {
            setTempShowPaidOnly(value);
            if (value) setTempShowFreeOnly(false);
          }}
          onSearch={handleApplySearch}
          onReset={handleResetFilters}
          categories={categoryOptions}
          locations={locationOptions}
          showLocationFilter={true}
          showCategoryFilter={true}
          showPriceFilter={true}
          appliedFilters={{
            location: appliedLocation,
            category: appliedCategory,
            showFreeOnly: appliedShowFreeOnly,
            showPaidOnly: appliedShowPaidOnly,
          }}
          getCategoryName={getCategoryName}
          mb={6}
        />

        {renderContent()}
      </Container>
    </Box>
  );
};

export default SearchResults;
