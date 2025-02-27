import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Image,
  Link as ChakraLink,
  Divider,
  useColorModeValue,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaDownload,
  FaFileDownload,
  FaEnvelope,
  FaFileAlt,
} from "react-icons/fa";

// Tinh gọn trang PressKit
const PressKit = () => {
  // Các giá trị màu cần thiết
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const buttonColorScheme = "blue";
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const boxAccentBg = useColorModeValue("blue.50", "blue.900");

  // Thông tin thương hiệu rút gọn
  const brandColors = [
    {
      name: "Chính",
      hex: "#3182CE", // Blue.500
      rgb: "49, 130, 206",
    },
    {
      name: "Đậm",
      hex: "#2C5282", // Blue.800
      rgb: "44, 82, 130",
    },
    {
      name: "Nhạt",
      hex: "#63B3ED", // Blue.300
      rgb: "99, 179, 237",
    },
  ];

  // Logo được đơn giản hóa
  const logos = [
    {
      name: "Logo chính",
      type: "PNG",
      path: "/assets/img/logo-primary.png",
      bg: "transparent",
    },
    {
      name: "Logo đơn sắc",
      type: "PNG",
      path: "/assets/img/logo-mono.png",
      bg: "white",
    },
  ];

  // Bộ truyền thông đơn giản hóa
  const mediaKits = [
    {
      title: "Bộ truyền thông cơ bản",
      description: "Bao gồm logo, hình ảnh, và thông tin cơ bản về EventHub",
      fileSize: "5.2 MB",
      format: "ZIP",
      downloadLink: "#",
    },
    {
      title: "Bộ hình ảnh sự kiện",
      description: "Hình ảnh chất lượng cao về các sự kiện nổi bật",
      fileSize: "12 MB",
      format: "ZIP",
      downloadLink: "#",
    },
  ];

  // Thông cáo báo chí đơn giản hóa
  const pressReleases = [
    {
      title: "EventHub ra mắt nền tảng tổ chức sự kiện trực tuyến",
      date: "20/05/2023",
      summary:
        "EventHub, nền tảng tổ chức sự kiện do sinh viên UIT phát triển, chính thức ra mắt với mục tiêu kết nối người tổ chức sự kiện và người tham gia một cách dễ dàng.",
      downloadLink: "#",
    },
    {
      title: "EventHub giành giải nhất cuộc thi Khởi nghiệp Sinh viên",
      date: "15/06/2023",
      summary:
        "Dự án EventHub của sinh viên UIT đã xuất sắc giành giải nhất cuộc thi Khởi nghiệp Sinh viên 2023 với ý tưởng nền tảng tổ chức sự kiện thông minh.",
      downloadLink: "#",
    },
  ];

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
          <BreadcrumbLink>Bộ Công cụ Truyền thông</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Phần Giới thiệu */}
      <Box mb={16} textAlign="center">
        <Badge
          colorScheme={buttonColorScheme}
          fontSize="sm"
          px={3}
          py={1}
          mb={3}
          borderRadius="full"
        >
          Đồ án sinh viên UIT
        </Badge>
        <Heading as="h1" size="2xl" mb={6} color={headingColor}>
          Bộ Công cụ Truyền thông EventHub
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color={textColor}>
          Chào mừng đến với bộ công cụ truyền thông của EventHub - nền tảng kết
          nối người tổ chức sự kiện và người tham gia. Dưới đây là các tài
          nguyên cần thiết để sử dụng thương hiệu của chúng tôi.
        </Text>
      </Box>

      {/* Về chúng tôi */}
      <Box mb={16} bg={sectionBg} p={8} borderRadius="lg">
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Về EventHub
        </Heading>
        <Text fontSize="lg" mb={4} color={textColor}>
          EventHub là nền tảng kết nối người tổ chức sự kiện và người tham gia
          được phát triển bởi sinh viên Đại học Công nghệ Thông tin (UIT), Đại
          học Quốc gia TP.HCM. Dự án được thực hiện như một phần của học phần
          IE213 - Kỹ thuật phát triển hệ thống web.
        </Text>
        <Text fontSize="lg" mb={4} color={textColor}>
          Nền tảng của chúng tôi cung cấp giải pháp toàn diện giúp người dùng dễ
          dàng tạo, quản lý và tham gia các sự kiện. Sứ mệnh của chúng tôi là
          kết nối cộng đồng thông qua các sự kiện ý nghĩa và trải nghiệm tương
          tác.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
          <Box
            p={5}
            bg={cardBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={2} color={headingColor}>
              Sứ mệnh
            </Heading>
            <Text color={textColor}>
              Kết nối cộng đồng thông qua những sự kiện có ý nghĩa, tạo ra các
              cơ hội gặp gỡ và giao lưu.
            </Text>
          </Box>
          <Box
            p={5}
            bg={cardBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={2} color={headingColor}>
              Tầm nhìn
            </Heading>
            <Text color={textColor}>
              Trở thành nền tảng tổ chức sự kiện hàng đầu cho sinh viên và các
              tổ chức giáo dục.
            </Text>
          </Box>
          <Box
            p={5}
            bg={cardBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={2} color={headingColor}>
              Giá trị cốt lõi
            </Heading>
            <Text color={textColor}>
              Sáng tạo, Cộng đồng, Hợp tác, và Trao quyền cho người dùng.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Bảng màu thương hiệu */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Bảng màu thương hiệu
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Màu sắc thương hiệu của EventHub phản ánh sự chuyên nghiệp, đáng tin
          cậy và thân thiện. Vui lòng sử dụng các mã màu dưới đây để đảm bảo
          tính nhất quán.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {brandColors.map((color) => (
            <Box
              key={color.name}
              borderRadius="md"
              overflow="hidden"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Box
                h="120px"
                bg={color.hex}
                display="flex"
                alignItems="flex-end"
                p={4}
              >
                <Text
                  color="white"
                  fontWeight="bold"
                  textShadow="0px 0px 8px rgba(0,0,0,0.3)"
                >
                  {color.name}
                </Text>
              </Box>
              <Box p={4} bg={cardBg}>
                <Text fontWeight="bold" mb={1}>
                  {color.name}
                </Text>
                <Text fontSize="sm" mb={1}>
                  HEX: {color.hex}
                </Text>
                <Text fontSize="sm">RGB: {color.rgb}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Logo */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Logo
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Logo của EventHub có thể được sử dụng trong các ứng dụng khác nhau.
          Vui lòng không thay đổi tỷ lệ, màu sắc, hoặc bóp méo logo.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {logos.map((logo) => (
            <Box
              key={logo.name}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              overflow="hidden"
            >
              <Box
                h="200px"
                bg={logo.bg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={6}
              >
                <Image
                  src={logo.path}
                  alt={`EventHub ${logo.name}`}
                  maxH="150px"
                  fallbackSrc="https://via.placeholder.com/300x150?text=EventHub+Logo"
                />
              </Box>
              <Box p={4} bg={cardBg}>
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{logo.name}</Text>
                    <Text fontSize="sm" color={textColor}>
                      Format: {logo.type}
                    </Text>
                  </VStack>
                  <Button
                    rightIcon={<FaDownload />}
                    size="sm"
                    colorScheme={buttonColorScheme}
                    variant="outline"
                  >
                    Tải xuống
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Bộ truyền thông */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Bộ truyền thông
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Tài nguyên truyền thông bổ sung để hỗ trợ các hoạt động tiếp thị và
          truyền thông về EventHub.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {mediaKits.map((kit, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              p={6}
              bg={cardBg}
            >
              <HStack spacing={4} align="start">
                <Box
                  p={3}
                  bg={boxAccentBg}
                  borderRadius="md"
                  color={accentColor}
                >
                  <Icon as={FaFileDownload} boxSize={6} />
                </Box>
                <VStack align="start" spacing={2} flex="1">
                  <Heading as="h3" size="md">
                    {kit.title}
                  </Heading>
                  <Text fontSize="sm" color={textColor}>
                    {kit.description}
                  </Text>
                  <HStack>
                    <Badge>{kit.format}</Badge>
                    <Text fontSize="xs" color={textColor}>
                      {kit.fileSize}
                    </Text>
                  </HStack>
                  <Button
                    rightIcon={<FaDownload />}
                    size="sm"
                    colorScheme={buttonColorScheme}
                    mt={2}
                  >
                    Tải xuống
                  </Button>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Thông cáo báo chí */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Thông cáo báo chí
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Các thông cáo báo chí mới nhất về EventHub và hoạt động của chúng tôi.
        </Text>

        <VStack spacing={6} align="stretch">
          {pressReleases.map((release, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              p={6}
              bg={cardBg}
            >
              <VStack align="start" spacing={3}>
                <Text color={textColor} fontSize="sm">
                  {release.date}
                </Text>
                <Heading as="h3" size="md">
                  {release.title}
                </Heading>
                <Text color={textColor}>{release.summary}</Text>
                <Button
                  rightIcon={<FaFileAlt />}
                  colorScheme={buttonColorScheme}
                  variant="outline"
                  size="sm"
                >
                  Tải xuống PDF
                </Button>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Câu hỏi thường gặp */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Câu hỏi thường gặp
        </Heading>
        <Accordion allowToggle>
          <AccordionItem
            borderWidth="1px"
            mb={3}
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
          >
            <h3>
              <AccordionButton py={3} _expanded={{ bg: boxAccentBg }}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Có thể sử dụng logo EventHub trong bài viết của tôi không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Có, bạn có thể sử dụng logo EventHub trong các bài viết hoặc nội
                dung truyền thông về chúng tôi. Tuy nhiên, vui lòng không thay
                đổi màu sắc, tỷ lệ, hoặc các yếu tố thiết kế của logo. Chúng tôi
                cũng yêu cầu bạn không sử dụng logo để ngụ ý rằng chúng tôi tài
                trợ hoặc ủng hộ sản phẩm/dịch vụ của bạn nếu không có sự chấp
                thuận chính thức.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            borderWidth="1px"
            mb={3}
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
          >
            <h3>
              <AccordionButton py={3} _expanded={{ bg: boxAccentBg }}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Tôi có thể liên hệ với ai để biết thêm thông tin?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Nếu bạn cần thêm thông tin về EventHub hoặc có bất kỳ câu hỏi
                nào về bộ công cụ truyền thông này, vui lòng liên hệ với chúng
                tôi qua email: press@eventhub.example.com. Đội ngũ truyền thông
                của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Liên hệ */}
      <Box mb={12} p={8} borderRadius="lg" bg={sectionBg}>
        <Heading
          as="h2"
          size="xl"
          mb={6}
          color={headingColor}
          textAlign="center"
        >
          Liên hệ với đội ngũ truyền thông
        </Heading>
        <Text fontSize="lg" mb={8} textAlign="center" color={textColor}>
          Bạn cần hỗ trợ thêm về truyền thông hoặc có yêu cầu đặc biệt? Hãy liên
          hệ với chúng tôi.
        </Text>

        <Center>
          <Button
            leftIcon={<FaEnvelope />}
            colorScheme={buttonColorScheme}
            size="lg"
            as={ChakraLink}
            href="mailto:press@eventhub.example.com"
          >
            press@eventhub.example.com
          </Button>
        </Center>
      </Box>

      {/* Footer */}
      <Divider my={6} />
      <Text textAlign="center" fontSize="sm" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default PressKit;
