import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Link as ChakraLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaEnvelope,
  FaCog,
  FaTicketAlt,
  FaInfoCircle,
  FaBuilding,
  FaShieldAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useState } from "react";

// Định nghĩa cấu trúc dữ liệu cho câu hỏi thường gặp
interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: string;
  icon?: IconType;
  featured?: boolean;
}

// Tinh gọn và gộp Help Center với FAQ
const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Colors cho dark/light mode
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const categoryBg = useColorModeValue("blue.50", "blue.900");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const boxShadow = useColorModeValue("sm", "none");

  // Dữ liệu mẫu cho các câu hỏi thường gặp
  const faqData: FAQItem[] = [
    // Tài khoản
    {
      question: "Làm thế nào để tạo tài khoản?",
      answer:
        'Nhấp vào nút "Đăng ký" ở góc trên bên phải của trang web. Nhập địa chỉ email, tạo mật khẩu và điền thông tin hồ sơ của bạn. Xác minh địa chỉ email của bạn bằng cách nhấp vào liên kết được gửi đến hộp thư đến của bạn.',
      category: "Tài khoản",
      icon: FaUserCircle,
      featured: true,
    },
    {
      question: "Làm thế nào để đặt lại mật khẩu?",
      answer:
        'Để đặt lại mật khẩu, nhấp vào liên kết "Quên mật khẩu" trên trang đăng nhập. Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết đặt lại mật khẩu.',
      category: "Tài khoản",
      icon: FaUserCircle,
    },
    {
      question: "Làm cách nào để thay đổi thông tin cá nhân?",
      answer:
        "Để cập nhật thông tin cá nhân, hãy đăng nhập vào tài khoản của bạn, truy cập trang Hồ sơ từ menu người dùng. Tại đây, bạn có thể chỉnh sửa thông tin cá nhân, cập nhật ảnh hồ sơ và thay đổi cài đặt thông báo.",
      category: "Tài khoản",
      icon: FaUserCircle,
    },
    {
      question: "Làm thế nào để trở thành người tổ chức được xác minh?",
      answer:
        'Để trở thành người tổ chức được xác minh, hãy truy cập trang "Trở thành người tổ chức" từ menu tài khoản của bạn. Điền vào biểu mẫu với thông tin cần thiết và tải lên các tài liệu xác minh được yêu cầu. Quy trình xác minh thường mất 2-3 ngày làm việc để hoàn tất.',
      category: "Tài khoản",
      icon: FaUserCircle,
    },

    // Sự kiện
    {
      question: "Làm thế nào để đăng ký tham gia sự kiện?",
      answer:
        'Để đăng ký tham gia sự kiện, hãy điều hướng đến trang sự kiện và nhấp vào nút "Đăng ký" hoặc "Đặt vé". Làm theo hướng dẫn để hoàn tất đăng ký của bạn.',
      category: "Sự kiện",
      icon: FaCalendarAlt,
      featured: true,
    },
    {
      question: "Tôi có thể hủy đăng ký không?",
      answer:
        'Có, bạn có thể hủy đăng ký bằng cách vào mục "Sự kiện của tôi" trong bảng điều khiển tài khoản và chọn "Hủy đăng ký" cho sự kiện cụ thể. Vui lòng kiểm tra chính sách hoàn tiền của sự kiện trước khi hủy.',
      category: "Sự kiện",
      icon: FaCalendarAlt,
    },
    {
      question: "Làm thế nào để tạo sự kiện?",
      answer:
        'Để tạo sự kiện, hãy vào bảng điều khiển và nhấp vào nút "Tạo sự kiện". Điền thông tin sự kiện bao gồm tiêu đề, mô tả, ngày, địa điểm và tải lên hình ảnh sự kiện. Bạn cũng có thể thiết lập loại vé và giá nếu áp dụng.',
      category: "Sự kiện",
      icon: FaCalendarAlt,
      featured: true,
    },
    {
      question: "Làm thế nào để tìm kiếm sự kiện?",
      answer:
        "Bạn có thể tìm kiếm sự kiện bằng cách sử dụng thanh tìm kiếm trên trang chủ. Lọc sự kiện theo ngày, địa điểm, hoặc danh mục để tìm sự kiện phù hợp với bạn. Bạn cũng có thể duyệt qua các sự kiện nổi bật hoặc sắp diễn ra trên trang chủ.",
      category: "Sự kiện",
      icon: FaCalendarAlt,
    },
    {
      question: "Tôi có thể thêm đồng tổ chức cho sự kiện của mình không?",
      answer:
        'Có, bạn có thể thêm đồng tổ chức cho sự kiện của mình. Trong trang quản lý sự kiện, nhấp vào tab "Quản lý nhóm" và nhập địa chỉ email của người dùng mà bạn muốn thêm làm đồng tổ chức. Họ sẽ nhận được lời mời qua email để tham gia nhóm tổ chức sự kiện của bạn.',
      category: "Sự kiện",
      icon: FaCalendarAlt,
    },

    // Thanh toán
    {
      question: "Những phương thức thanh toán nào được chấp nhận?",
      answer:
        "Hiện tại, chúng tôi hỗ trợ thẻ tín dụng/ghi nợ, MoMo, ZaloPay và VNPay cho các khoản thanh toán sự kiện. Thêm các phương thức thanh toán khác sẽ được bổ sung trong các cập nhật tương lai.",
      category: "Thanh toán",
      icon: FaCreditCard,
      featured: true,
    },
    {
      question: "Làm thế nào để truy cập vé của tôi?",
      answer:
        'Sau khi đăng ký, vé của bạn sẽ được gửi đến email và cũng có sẵn trong phần "Vé của tôi" trên bảng điều khiển người dùng. Bạn có thể tải xuống, in hoặc xuất trình vé trên thiết bị di động khi tham dự sự kiện.',
      category: "Thanh toán",
      icon: FaTicketAlt,
    },
    {
      question: "Làm thế nào để yêu cầu hoàn tiền?",
      answer:
        'Để yêu cầu hoàn tiền, hãy vào phần Sự kiện của tôi trong hồ sơ người dùng, tìm sự kiện cần hoàn tiền và nhấp vào "Yêu cầu hoàn tiền". Điền thông tin cần thiết và gửi yêu cầu. Thời gian xử lý hoàn tiền thường mất 5-7 ngày làm việc.',
      category: "Thanh toán",
      icon: FaCreditCard,
    },
    {
      question: "Chính sách hoàn tiền của EventHub như thế nào?",
      answer:
        "Chính sách hoàn tiền tùy thuộc vào từng sự kiện và do người tổ chức quyết định. Thông thường, bạn có thể được hoàn tiền đầy đủ nếu hủy trong vòng 48 giờ sau khi đăng ký hoặc ít nhất 7 ngày trước sự kiện. Hãy kiểm tra chính sách hoàn tiền cụ thể của mỗi sự kiện trước khi đăng ký.",
      category: "Thanh toán",
      icon: FaCreditCard,
    },

    // Chung
    {
      question: "Làm thế nào để liên hệ với đội hỗ trợ?",
      answer:
        'Bạn có thể liên hệ với đội hỗ trợ của chúng tôi bằng cách gửi email đến support@eventhub.example.com hoặc sử dụng biểu mẫu liên hệ trên trang "Liên hệ với chúng tôi". Chúng tôi cố gắng phản hồi tất cả các yêu cầu trong vòng 24 giờ.',
      category: "Chung",
      icon: FaEnvelope,
      featured: true,
    },
    {
      question: "EventHub có ứng dụng di động không?",
      answer:
        "Hiện tại, EventHub là một ứng dụng web đáp ứng hoạt động tốt trên mọi thiết bị, bao gồm cả điện thoại di động. Chúng tôi đang phát triển ứng dụng di động dành riêng cho Android và iOS, dự kiến ra mắt trong tương lai gần.",
      category: "Chung",
      icon: FaCog,
    },

    // Bảo mật và quyền riêng tư
    {
      question: "Dữ liệu của tôi được bảo vệ như thế nào?",
      answer:
        "EventHub sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn. Chúng tôi mã hóa dữ liệu nhạy cảm, kiểm tra bảo mật thường xuyên và tuân thủ các quy định về bảo vệ dữ liệu. Để biết thêm chi tiết, vui lòng xem Chính sách Riêng tư của chúng tôi.",
      category: "Bảo mật",
      icon: FaShieldAlt,
    },
    {
      question: "Làm thế nào để quản lý quyền riêng tư của tôi?",
      answer:
        'Bạn có thể quản lý cài đặt quyền riêng tư trong phần "Cài đặt tài khoản". Tại đây, bạn có thể kiểm soát thông tin nào được công khai, cài đặt thông báo email và quản lý dữ liệu cá nhân của bạn.',
      category: "Bảo mật",
      icon: FaShieldAlt,
    },
  ];

  // Lấy các danh mục duy nhất và các icon tương ứng
  const categories = [...new Set(faqData.map((item) => item.category))];
  const categoryIcons: { [key: string]: IconType } = {
    "Tài khoản": FaUserCircle,
    "Sự kiện": FaCalendarAlt,
    "Thanh toán": FaCreditCard,
    Chung: FaInfoCircle,
    "Bảo mật": FaShieldAlt,
  };

  // Lấy những câu hỏi nổi bật
  const featuredFAQs = faqData.filter((faq) => faq.featured);

  // Lọc câu hỏi theo tìm kiếm
  const filteredFAQs =
    searchTerm.trim() === ""
      ? faqData
      : faqData.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof faq.answer === "string" &&
              faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
        );

  // Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container maxW="6xl" py={10}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} fontSize="sm" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Trung tâm Trợ giúp</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Trung tâm Trợ giúp
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
          Tìm câu trả lời nhanh chóng cho các câu hỏi của bạn về EventHub
        </Text>
      </Box>

      {/* Search Box */}
      <Box
        maxW="2xl"
        mx="auto"
        mb={12}
        p={6}
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
      >
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm câu hỏi và câu trả lời..."
            borderRadius="md"
            focusBorderColor={accentColor}
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
        <HStack mt={4} spacing={4} justify="center">
          <Button
            leftIcon={<Icon as={FaQuestionCircle} />}
            variant="ghost"
            onClick={() => {
              document
                .getElementById("featured-faqs")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Câu hỏi phổ biến
          </Button>
          <Button
            leftIcon={<Icon as={FaEnvelope} />}
            variant="ghost"
            as={Link}
            to="/contact"
          >
            Liên hệ hỗ trợ
          </Button>
        </HStack>
      </Box>

      {searchTerm.trim() === "" ? (
        <>
          {/* Câu hỏi nổi bật */}
          <Box mb={16} id="featured-faqs">
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              Câu hỏi thường gặp
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {featuredFAQs.map((faq, index) => (
                <Box
                  key={index}
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  boxShadow={boxShadow}
                  transition="all 0.3s"
                  _hover={{ shadow: "md" }}
                >
                  <HStack spacing={4} mb={3} align="flex-start">
                    {faq.icon && (
                      <Icon
                        as={faq.icon}
                        boxSize={6}
                        color={accentColor}
                        mt={1}
                      />
                    )}
                    <VStack align="start" spacing={2}>
                      <Heading as="h3" size="md">
                        {faq.question}
                      </Heading>
                      <Text color={textColor}>{faq.answer}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Các danh mục câu hỏi */}
          <Box mb={10}>
            <Heading
              as="h2"
              size="xl"
              mb={8}
              textAlign="center"
              color={headingColor}
            >
              Chọn chủ đề
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6}>
              {categories.map((category) => (
                <Box
                  key={category}
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    shadow: "md",
                    borderColor: accentColor,
                  }}
                  cursor="pointer"
                  onClick={() => {
                    document
                      .getElementById(`category-${category}`)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <VStack spacing={4}>
                    <Icon
                      as={categoryIcons[category] || FaQuestionCircle}
                      boxSize={10}
                      color={accentColor}
                    />
                    <Text fontWeight="medium">{category}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Tabs cho các danh mục FAQ */}
          <Tabs colorScheme="blue" variant="enclosed" mb={10}>
            <TabList
              mb={6}
              overflowX="auto"
              css={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                },
              }}
            >
              {categories.map((category) => (
                <Tab key={category} fontWeight="medium">
                  {category}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {categories.map((category) => (
                <TabPanel key={category} p={0}>
                  <Box id={`category-${category}`}>
                    <Accordion allowToggle>
                      {faqData
                        .filter((item) => item.category === category)
                        .map((faq, index) => (
                          <AccordionItem
                            key={index}
                            mb={3}
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                            overflow="hidden"
                          >
                            <h3>
                              <AccordionButton
                                py={4}
                                _expanded={{
                                  bg: categoryBg,
                                  fontWeight: "medium",
                                }}
                              >
                                <HStack flex="1" textAlign="left" spacing={3}>
                                  {faq.icon && (
                                    <Icon as={faq.icon} color={accentColor} />
                                  )}
                                  <Text>{faq.question}</Text>
                                  {faq.featured && (
                                    <Badge colorScheme="blue" fontSize="xs">
                                      Phổ biến
                                    </Badge>
                                  )}
                                </HStack>
                                <AccordionIcon />
                              </AccordionButton>
                            </h3>
                            <AccordionPanel pb={4} px={4}>
                              <Text>{faq.answer}</Text>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </>
      ) : (
        // Hiển thị kết quả tìm kiếm
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={6}>
            Kết quả tìm kiếm: {filteredFAQs.length} câu hỏi phù hợp
          </Heading>

          {filteredFAQs.length > 0 ? (
            <Accordion allowToggle>
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  mb={3}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton
                      py={4}
                      _expanded={{
                        bg: categoryBg,
                        fontWeight: "medium",
                      }}
                    >
                      <HStack flex="1" textAlign="left" spacing={3}>
                        {faq.icon && <Icon as={faq.icon} color={accentColor} />}
                        <Text>{faq.question}</Text>
                        <Badge
                          colorScheme="blue"
                          variant="outline"
                          fontSize="xs"
                        >
                          {faq.category}
                        </Badge>
                      </HStack>
                      <AccordionIcon />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={4}>
                    <Text>{faq.answer}</Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" mb={4}>
                Không tìm thấy câu hỏi phù hợp với từ khóa "{searchTerm}"
              </Text>
              <Button
                leftIcon={<Icon as={FaEnvelope} />}
                colorScheme="blue"
                as={Link}
                to="/contact"
              >
                Liên hệ hỗ trợ
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Contact Us Section */}
      <Box mt={16} p={8} bg={hoverBg} borderRadius="lg" textAlign="center">
        <Heading as="h3" size="lg" mb={4} color={headingColor}>
          Vẫn cần trợ giúp?
        </Heading>
        <Text mb={6} color={textColor}>
          Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, hãy liên hệ
          với đội ngũ hỗ trợ của chúng tôi.
        </Text>
        <Button as={Link} to="/contact" colorScheme="blue" size="lg" px={8}>
          Liên hệ Hỗ trợ
        </Button>
      </Box>

      {/* Các liên kết hữu ích */}
      <Box mt={16}>
        <Heading as="h3" size="lg" mb={6} color={headingColor}>
          Các liên kết hữu ích
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          <VStack
            as={Link}
            to="/terms"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaInfoCircle} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Điều khoản Dịch vụ</Text>
          </VStack>

          <VStack
            as={Link}
            to="/privacy"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaShieldAlt} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Chính sách Riêng tư</Text>
          </VStack>

          <VStack
            as={Link}
            to="/about"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaBuilding} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Về Chúng Tôi</Text>
          </VStack>

          <VStack
            as={Link}
            to="/become-organizer"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaCalendarAlt} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Trở thành Người tổ chức</Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Footer note */}
      <Divider my={10} />
      <Text fontSize="sm" textAlign="center" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default HelpCenter;
