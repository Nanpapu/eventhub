import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  useColorModeValue,
  Icon,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX, FiTag } from "react-icons/fi";
import { SearchBar } from "../../components/common";
import eventService, { EventFilter } from "../../services/event.service";
import {
  getCategoryName,
  categories as allCategories,
} from "../../utils/categoryUtils";
import { EventCard, EventCardData } from "../../components/events/EventCard";

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
  [key: string]: string | number | boolean | Date;
}

const locations = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Huế",
  "Nha Trang",
];

const SearchResults = () => {
  const textColor = useColorModeValue("gray.800", "gray.100");
  const resultsInfoBg = useColorModeValue("gray.100", "gray.700");
  const bannerTextColor = "white";

  const [searchParams, setSearchParams] = useSearchParams();

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

  const [tempKeyword, setTempKeyword] = useState(appliedKeyword);
  const [tempLocation, setTempLocation] = useState(appliedLocation);
  const [tempCategory, setTempCategory] = useState(appliedCategory);
  const [tempShowFreeOnly, setTempShowFreeOnly] = useState(appliedShowFreeOnly);
  const [tempShowPaidOnly, setTempShowPaidOnly] = useState(appliedShowPaidOnly);

  const [filteredEvents, setFilteredEvents] = useState<EventCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventsPerPage = 6;

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
          const formattedEvents: EventCardData[] = response.events.map(
            (event: EventResponse) => ({
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

    const currentSearchString = window.location.search.substring(1);
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
  const categoryOptions = allCategories.map((cat) => ({
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
          {areFiltersApplied() && (
            <Button
              colorScheme="red"
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
            bg={resultsInfoBg}
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
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
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
            colorScheme="red"
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
      {!areFiltersApplied() && (
        <Box
          py={{ base: 14, md: 20 }}
          px={{ base: 4, md: 8 }}
          borderRadius={{ base: 0, md: "lg" }}
          mb={10}
          position="relative"
          backgroundImage="url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.700"
            borderRadius={{ base: 0, md: "lg" }}
          />
          <Container maxW="container.lg" position="relative">
            <VStack
              spacing={5}
              align={{ base: "center", md: "flex-start" }}
              maxW={{ base: "full", md: "container.md" }}
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                color={bannerTextColor}
              >
                Khám Phá Sự Kiện Hoàn Hảo
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={bannerTextColor}
                maxW={{ base: "full", md: "container.sm" }}
              >
                Lọc sự kiện theo tên, địa điểm, danh mục hoặc duyệt toàn bộ danh
                sách. Luôn có những trải nghiệm mới đang chờ bạn!
              </Text>
            </VStack>
          </Container>
        </Box>
      )}

      <Container maxW="container.xl" py={areFiltersApplied() ? 8 : 0}>
        {areFiltersApplied() && (
          <Heading as="h1" size="xl" mb={6} color={textColor}>
            Kết quả tìm kiếm
          </Heading>
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
          mb={areFiltersApplied() ? 6 : 10}
        />

        {renderContent()}
      </Container>
    </Box>
  );
};

export default SearchResults;
