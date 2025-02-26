import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaUsersCog,
} from "react-icons/fa";

/**
 * Trang giới thiệu về việc trở thành người tổ chức (Organizer)
 * Giới thiệu lợi ích, quyền hạn và cách đăng ký
 */
const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const bgBox = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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

  return (
    <Container maxW="container.lg" py={8}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Become an Organizer</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Banner */}
      <Box
        borderRadius="lg"
        bg="teal.500"
        color="white"
        p={{ base: 6, md: 10 }}
        mb={10}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.2"
          bg="url('https://bit.ly/3IYSA0D')"
          backgroundSize="cover"
          backgroundPosition="center"
          zIndex="0"
        />
        <VStack spacing={4} position="relative" zIndex="1">
          <Heading as="h1" size="xl">
            Become an EventHub Organizer
          </Heading>
          <Text fontSize="lg" maxW="container.md">
            Tạo, quản lý và phát triển các sự kiện của riêng bạn với công cụ
            quản lý sự kiện toàn diện của chúng tôi
          </Text>
          <Button
            size="lg"
            bg="white"
            color="teal.500"
            _hover={{ bg: "gray.100" }}
            onClick={() => navigate("/register?role=organizer")}
            mt={4}
          >
            Đăng ký ngay
          </Button>
        </VStack>
      </Box>

      {/* Thông báo */}
      <Alert status="info" mb={8} borderRadius="md">
        <AlertIcon />
        Hiện tại, tính năng này đang trong giai đoạn phát triển. Bạn có thể đăng
        ký tài khoản thông thường và liên hệ với chúng tôi để nâng cấp lên
        Organizer.
      </Alert>

      {/* Lợi ích */}
      <Box mb={12}>
        <Heading as="h2" size="lg" mb={8} textAlign="center">
          Lợi ích của việc trở thành Organizer
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {benefits.map((benefit, index) => (
            <Box
              key={index}
              p={6}
              bg={bgBox}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="md"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)" }}
            >
              <Flex
                w={12}
                h={12}
                align="center"
                justify="center"
                color="white"
                rounded="full"
                bg="teal.500"
                mb={4}
              >
                <Icon as={benefit.icon} boxSize={6} />
              </Flex>
              <Heading as="h3" size="md" mb={2}>
                {benefit.title}
              </Heading>
              <Text color="gray.600">{benefit.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Cách đăng ký */}
      <Box mb={12} p={8} bg={bgBox} borderRadius="lg" boxShadow="md">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Cách đăng ký trở thành Organizer
        </Heading>
        <List spacing={3} maxW="container.md" mx="auto">
          {registrationSteps.map((step, index) => (
            <ListItem key={index} display="flex" alignItems="flex-start">
              <ListIcon as={FaCheckCircle} color="teal.500" mt={1} />
              <Text>
                <Text as="span" fontWeight="bold" mr={2}>
                  Bước {index + 1}:
                </Text>
                {step}
              </Text>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* FAQ */}
      <Box mb={12}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Câu hỏi thường gặp
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box p={6} bg={bgBox} borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              Có tốn phí để trở thành Organizer không?
            </Heading>
            <Text>
              Không, việc đăng ký làm Organizer trên EventHub hoàn toàn miễn
              phí. Chúng tôi chỉ thu phí dịch vụ nhỏ trên mỗi vé được bán cho sự
              kiện trả phí.
            </Text>
          </Box>
          <Box p={6} bg={bgBox} borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              Tôi có thể tạo bao nhiêu sự kiện?
            </Heading>
            <Text>
              Không có giới hạn số lượng sự kiện mà bạn có thể tạo với tư cách
              là Organizer. Bạn có thể tạo và quản lý nhiều sự kiện cùng một
              lúc.
            </Text>
          </Box>
          <Box p={6} bg={bgBox} borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              Organizer có quyền gì đặc biệt?
            </Heading>
            <Text>
              Organizer có quyền tạo, chỉnh sửa, quản lý sự kiện, xem danh sách
              người tham dự, gửi thông báo và truy cập vào các công cụ phân tích
              chuyên sâu.
            </Text>
          </Box>
          <Box p={6} bg={bgBox} borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              Tôi cần chuẩn bị những gì để đăng ký?
            </Heading>
            <Text>
              Bạn cần chuẩn bị thông tin cá nhân, thông tin liên hệ và có thể
              cần cung cấp thông tin về tổ chức của bạn (nếu có) trong quá trình
              đăng ký.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <Box textAlign="center" mt={10} mb={6}>
        <Heading as="h2" size="lg" mb={4}>
          Sẵn sàng để tổ chức sự kiện của riêng bạn?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="container.md" mx="auto">
          Trở thành Organizer ngay hôm nay và bắt đầu hành trình tạo ra những sự
          kiện tuyệt vời!
        </Text>
        <Button
          as={Link}
          to="/register?role=organizer"
          size="lg"
          colorScheme="teal"
          px={10}
        >
          Đăng ký làm Organizer
        </Button>
      </Box>
    </Container>
  );
};

export default BecomeOrganizer;
