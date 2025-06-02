import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Flex,
  List,
  ListItem,
  ListIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaUsersCog,
  FaCrown,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";

/**
 * Trang giới thiệu về việc trở thành người tổ chức (Organizer)
 * Giới thiệu lợi ích, quyền hạn và cách đăng ký
 */
const BecomeOrganizer = () => {
  const navigate = useNavigate();

  // Màu sắc đồng bộ với HelpCenter
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");
  const boxAccentBg = useColorModeValue("teal.50", "teal.900");

  // Lợi ích của việc trở thành Organizer
  const benefits = [
    {
      title: "Quản lý sự kiện chuyên nghiệp",
      description:
        "Truy cập vào các công cụ quản lý sự kiện tiên tiến, bao gồm phân tích dữ liệu và báo cáo.",
      icon: FaCalendarAlt,
    },
    {
      title: "Xây dựng cộng đồng",
      description:
        "Kết nối với những người có cùng sở thích và xây dựng cộng đồng của riêng bạn.",
      icon: FaUsers,
    },
    {
      title: "Phân tích chi tiết",
      description:
        "Thống kê người tham dự, hiệu suất sự kiện và các dữ liệu phân tích khác.",
      icon: FaChartLine,
    },
    {
      title: "Tạo doanh thu",
      description:
        "Tạo và bán vé cho sự kiện của bạn, quản lý doanh thu dễ dàng.",
      icon: FaMoneyBillWave,
    },
    {
      title: "Quản lý người tham dự",
      description:
        "Kiểm soát danh sách người tham dự, gửi thông báo và tương tác với họ.",
      icon: FaUsersCog,
    },
  ];

  // Các bước đăng ký làm Organizer
  const registrationSteps = [
    "Đăng ký tài khoản người dùng trên EventHub",
    "Điền thông tin cá nhân và thông tin tổ chức của bạn",
    "Xác minh danh tính và thông tin liên hệ",
    "Hoàn tất đăng ký và được nâng cấp lên tài khoản Organizer",
    "Bắt đầu tạo và quản lý sự kiện của bạn",
  ];

  // Lý do nên trở thành Organizer
  const reasons = [
    {
      icon: FaCrown,
      title: "Uy tín",
      description:
        "Tăng cường uy tín của bạn trong cộng đồng sự kiện với tư cách là người tổ chức được xác minh.",
    },
    {
      icon: FaShieldAlt,
      title: "Bảo mật",
      description:
        "Hệ thống bảo mật cao cấp để bảo vệ dữ liệu sự kiện và thông tin người tham dự của bạn.",
    },
    {
      icon: FaLightbulb,
      title: "Sáng tạo",
      description:
        "Tự do sáng tạo và tùy chỉnh sự kiện của bạn với các công cụ thiết kế linh hoạt.",
    },
  ];

  return (
    <Container maxW="6xl" py={10}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb mb={8} fontSize="sm" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Trở thành Người tổ chức</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Trở thành Người tổ chức sự kiện
        </Heading>
        <Text fontSize="lg" maxW="3xl" mx="auto" color={textColor}>
          Tạo, quản lý và phát triển các sự kiện của riêng bạn với công cụ quản
          lý sự kiện toàn diện của chúng tôi. Hãy bắt đầu hành trình của bạn
          ngay hôm nay!
        </Text>
      </Box>

      {/* Thông báo */}
      <Alert status="info" mb={10} borderRadius="lg">
        <AlertIcon />
        <Text>
          Hiện tại, tính năng này đang trong giai đoạn phát triển. Bạn có thể
          đăng ký tài khoản thông thường và liên hệ với chúng tôi để nâng cấp
          lên Organizer.
        </Text>
      </Alert>

      {/* Lý do trở thành Organizer */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        {reasons.map((reason, index) => (
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
            <Flex
              mb={4}
              w={12}
              h={12}
              bg={boxAccentBg}
              color={accentColor}
              borderRadius="full"
              justifyContent="center"
              alignItems="center"
            >
              <Icon as={reason.icon} boxSize={5} />
            </Flex>
            <Heading as="h3" size="md" mb={2} color={headingColor}>
              {reason.title}
            </Heading>
            <Text color={textColor}>{reason.description}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Banner */}
      <Box mb={10} p={8} borderRadius="lg" bg={boxAccentBg} textAlign="center">
        <Heading as="h2" size="lg" mb={4} color={headingColor}>
          Tạo sự kiện đầu tiên của bạn
        </Heading>
        <Text fontSize="lg" mb={6} color={textColor} maxW="3xl" mx="auto">
          Mở khóa tiềm năng tổ chức sự kiện của bạn và tạo ra những trải nghiệm
          đáng nhớ cho người tham dự.
        </Text>
        <Button
          size="lg"
          colorScheme="teal"
          onClick={() => navigate("/register?role=organizer")}
        >
          Đăng ký ngay
        </Button>
      </Box>

      {/* Lợi ích */}
      <Box
        mb={10}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Lợi ích của việc trở thành Người tổ chức
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Khám phá những lợi ích độc quyền dành cho các Người tổ chức đã xác
          minh trên nền tảng EventHub.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {benefits.map((benefit, index) => (
            <Box
              key={index}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ shadow: "md", borderColor: accentColor }}
            >
              <Flex
                w={12}
                h={12}
                align="center"
                justify="center"
                color="white"
                rounded="full"
                bg={accentColor}
                mb={4}
              >
                <Icon as={benefit.icon} boxSize={5} />
              </Flex>
              <Heading as="h3" size="md" mb={2} color={headingColor}>
                {benefit.title}
              </Heading>
              <Text color={textColor}>{benefit.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Cách đăng ký */}
      <Box
        mb={10}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Cách đăng ký trở thành Người tổ chức
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Quy trình đăng ký đơn giản, nhanh chóng và được thiết kế để giúp bạn
          nhanh chóng bắt đầu hành trình tổ chức sự kiện.
        </Text>
        <List spacing={5} maxW="container.md" mx="auto">
          {registrationSteps.map((step, index) => (
            <ListItem
              key={index}
              display="flex"
              alignItems="flex-start"
              p={4}
              bg={bgColor}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ shadow: "sm", borderColor: accentColor }}
            >
              <ListIcon
                as={FaCheckCircle}
                color={accentColor}
                mt={1}
                boxSize={5}
              />
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Bước {index + 1}
                </Text>
                <Text color={textColor}>{step}</Text>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* FAQ */}
      <Box
        mb={10}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Câu hỏi thường gặp
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Tìm câu trả lời cho các câu hỏi phổ biến về việc trở thành Người tổ
          chức sự kiện trên EventHub.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            p={6}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Có tốn phí để trở thành Người tổ chức không?
            </Heading>
            <Text color={textColor}>
              Không, việc đăng ký làm Người tổ chức trên EventHub hoàn toàn miễn
              phí. Chúng tôi chỉ thu phí dịch vụ nhỏ trên mỗi vé được bán cho sự
              kiện trả phí.
            </Text>
          </Box>
          <Box
            p={6}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Tôi có thể tạo bao nhiêu sự kiện?
            </Heading>
            <Text color={textColor}>
              Không có giới hạn số lượng sự kiện mà bạn có thể tạo với tư cách
              là Người tổ chức. Bạn có thể tạo và quản lý nhiều sự kiện cùng một
              lúc.
            </Text>
          </Box>
          <Box
            p={6}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Người tổ chức có quyền gì đặc biệt?
            </Heading>
            <Text color={textColor}>
              Người tổ chức có quyền tạo, chỉnh sửa, quản lý sự kiện, xem danh
              sách người tham dự, gửi thông báo và truy cập vào các công cụ phân
              tích chuyên sâu.
            </Text>
          </Box>
          <Box
            p={6}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Tôi cần chuẩn bị những gì để đăng ký?
            </Heading>
            <Text color={textColor}>
              Bạn cần chuẩn bị thông tin cá nhân, thông tin liên hệ và có thể
              cần cung cấp thông tin về tổ chức của bạn (nếu có) trong quá trình
              đăng ký.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <Box
        mb={10}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
        textAlign="center"
      >
        <Heading as="h2" size="xl" mb={4} color={headingColor}>
          Sẵn sàng để tổ chức sự kiện của riêng bạn?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto" color={textColor}>
          Trở thành Người tổ chức sự kiện ngay hôm nay và bắt đầu hành trình tạo
          ra những sự kiện tuyệt vời!
        </Text>
        <HStack spacing={4} justify="center">
          <Button
            as={Link}
            to="/register?role=organizer"
            size="lg"
            variant="outline"
            colorScheme="teal"
          >
            Đăng ký làm Người tổ chức
          </Button>
          <Button
            as={Link}
            to="/contact-us"
            size="lg"
            variant="outline"
            colorScheme="teal"
          >
            Liên hệ hỗ trợ
          </Button>
        </HStack>
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

export default BecomeOrganizer;
