import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Checkbox,
  HStack,
  useColorModeValue,
  BoxProps,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Divider,
  IconButton,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiTag, FiFilter, FiX } from "react-icons/fi";

// Interface cho danh mục
interface Category {
  id: string;
  name: string;
}

// Interface cho địa điểm
interface Location {
  id?: string;
  name: string;
}

// Props cho SearchBar
interface SearchBarProps extends BoxProps {
  // Dữ liệu
  categories?: Category[];
  locations?: Location[];

  // Trạng thái tìm kiếm
  keyword: string;
  setKeyword: (value: string) => void;
  location?: string;
  setLocation?: (value: string) => void;
  category?: string;
  setCategory?: (value: string) => void;
  showFreeOnly?: boolean;
  setShowFreeOnly?: (value: boolean) => void;
  showPaidOnly?: boolean;
  setShowPaidOnly?: (value: boolean) => void;

  // Callback
  onSearch: () => void;
  onReset: () => void;

  // Tùy chỉnh UI
  showLocationFilter?: boolean;
  showCategoryFilter?: boolean;
  showPriceFilter?: boolean;
  compact?: boolean; // Hiển thị gọn hơn

  // Filter đã áp dụng cho hiển thị badge
  appliedFilters?: {
    location?: string;
    category?: string;
    showFreeOnly?: boolean;
    showPaidOnly?: boolean;
  };

  // Function lấy tên danh mục từ id
  getCategoryName?: (id: string) => string;
}

/**
 * Component thanh tìm kiếm có thể tái sử dụng trên nhiều trang
 */
const SearchBar = ({
  // Dữ liệu
  categories = [],
  locations = [],

  // Trạng thái tìm kiếm
  keyword,
  setKeyword,
  location = "",
  setLocation = () => {},
  category = "",
  setCategory = () => {},
  showFreeOnly = false,
  setShowFreeOnly = () => {},
  showPaidOnly = false,
  setShowPaidOnly = () => {},

  // Callback
  onSearch,
  onReset,

  // Tùy chỉnh UI
  showLocationFilter = true,
  showCategoryFilter = true,
  showPriceFilter = true,
  compact = false,

  // Filter đã áp dụng
  appliedFilters = {},

  // Function helper
  getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  },

  // Props khác
  ...boxProps
}: SearchBarProps) => {
  // Colors theo theme
  const boxBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");

  // Drawer cho mobile
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Trạng thái tạm thời cho drawer filter
  const [tempKeyword, setTempKeyword] = useState(keyword);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempCategory, setTempCategory] = useState(category);
  const [tempShowFreeOnly, setTempShowFreeOnly] = useState(showFreeOnly);
  const [tempShowPaidOnly, setTempShowPaidOnly] = useState(showPaidOnly);

  // Cập nhật state tạm thời khi props thay đổi
  useEffect(() => {
    setTempKeyword(keyword);
    setTempLocation(location);
    setTempCategory(category);
    setTempShowFreeOnly(showFreeOnly);
    setTempShowPaidOnly(showPaidOnly);
  }, [keyword, location, category, showFreeOnly, showPaidOnly]);

  // Apply filters từ drawer
  const applyFilters = () => {
    setKeyword(tempKeyword);
    if (setLocation) setLocation(tempLocation);
    if (setCategory) setCategory(tempCategory);
    if (setShowFreeOnly) setShowFreeOnly(tempShowFreeOnly);
    if (setShowPaidOnly) setShowPaidOnly(tempShowPaidOnly);
    onSearch();
    onClose();
  };

  // Reset filters trong drawer
  const resetTempFilters = () => {
    setTempKeyword("");
    setTempLocation("");
    setTempCategory("");
    setTempShowFreeOnly(false);
    setTempShowPaidOnly(false);
  };

  // Xử lý nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Box {...boxProps}>
      {/* Desktop: Search & Filter Bar */}
      <Box
        display={{ base: compact ? "none" : "block", md: "block" }}
        p={6}
        bg={boxBg}
        borderRadius="lg"
        boxShadow="md"
        borderColor={borderColor}
        borderWidth={boxProps.borderWidth || "1px"}
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
                onKeyPress={handleKeyPress}
              />
            </InputGroup>

            <Button colorScheme="teal" onClick={onSearch} px={8}>
              Tìm kiếm
            </Button>
          </Flex>

          {(!compact ||
            showLocationFilter ||
            showCategoryFilter ||
            showPriceFilter) && (
            <Flex gap={4} align="center" wrap={{ base: "wrap", lg: "nowrap" }}>
              {showLocationFilter && (
                <InputGroup size="md" flex={{ base: "1 0 100%", md: 1 }}>
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
                      <option
                        key={loc.id || loc.name}
                        value={loc.id || loc.name}
                      >
                        {loc.name}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              )}

              {showCategoryFilter && (
                <InputGroup size="md" flex={{ base: "1 0 100%", md: 1 }}>
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
              )}

              {showPriceFilter && (
                <HStack spacing={4} flex={{ base: "1 0 100%", md: "auto" }}>
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
              )}

              <Button
                variant="outline"
                colorScheme="teal"
                size="md"
                leftIcon={<FiX />}
                onClick={onReset}
              >
                Xóa bộ lọc
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Mobile: Compact Search & Filter */}
      <Box display={{ base: "block", md: compact ? "block" : "none" }} mb={6}>
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
              onKeyPress={handleKeyPress}
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
        {appliedFilters &&
          (appliedFilters.location ||
            appliedFilters.category ||
            appliedFilters.showFreeOnly ||
            appliedFilters.showPaidOnly) && (
            <Flex gap={2} mb={4} flexWrap="wrap">
              {appliedFilters.location && (
                <Badge
                  colorScheme="teal"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {appliedFilters.location}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => {
                      setLocation("");
                      onSearch();
                    }}
                  />
                </Badge>
              )}

              {appliedFilters.category && (
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {getCategoryName(appliedFilters.category)}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => {
                      setCategory("");
                      onSearch();
                    }}
                  />
                </Badge>
              )}

              {appliedFilters.showFreeOnly && (
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
                    onClick={() => {
                      setShowFreeOnly(false);
                      onSearch();
                    }}
                  />
                </Badge>
              )}

              {appliedFilters.showPaidOnly && (
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
                    onClick={() => {
                      setShowPaidOnly(false);
                      onSearch();
                    }}
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
                  Tìm kiếm
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color={iconColor} />
                  </InputLeftElement>
                  <Input
                    placeholder="Tìm kiếm sự kiện..."
                    value={tempKeyword}
                    onChange={(e) => setTempKeyword(e.target.value)}
                  />
                </InputGroup>
              </Box>

              {showLocationFilter && locations.length > 0 && (
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
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      pl={10}
                    >
                      {locations.map((loc) => (
                        <option
                          key={loc.id || loc.name}
                          value={loc.id || loc.name}
                        >
                          {loc.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </Box>
              )}

              {showCategoryFilter && categories.length > 0 && (
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
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value)}
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
              )}

              {showPriceFilter && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Giá
                  </Text>
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={tempShowFreeOnly}
                      onChange={(e) => {
                        setTempShowFreeOnly(e.target.checked);
                        if (e.target.checked) setTempShowPaidOnly(false);
                      }}
                    >
                      Miễn phí
                    </Checkbox>
                    <Checkbox
                      isChecked={tempShowPaidOnly}
                      onChange={(e) => {
                        setTempShowPaidOnly(e.target.checked);
                        if (e.target.checked) setTempShowFreeOnly(false);
                      }}
                    >
                      Có phí
                    </Checkbox>
                  </Stack>
                </Box>
              )}

              <Divider />

              <Button colorScheme="teal" onClick={applyFilters}>
                Áp dụng
              </Button>
              <Button variant="outline" onClick={resetTempFilters}>
                Xóa bộ lọc
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SearchBar;
