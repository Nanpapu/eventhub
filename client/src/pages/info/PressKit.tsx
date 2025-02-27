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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaDownload,
  FaFileDownload,
  FaEnvelope,
  FaFileAlt,
  FaUserTie,
  FaPalette,
  FaImages,
  FaNewspaper,
} from "react-icons/fa";

/**
 * Trang Bộ Công cụ Truyền thông (Press Kit)
 * Cung cấp tài nguyên truyền thông cho đơn vị báo chí và đối tác
 */
const PressKit = () => {
  // Màu sắc đồng bộ với HelpCenter nhưng sử dụng tông màu blue
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const boxShadow = useColorModeValue("sm", "none");
  const boxAccentBg = useColorModeValue("blue.50", "blue.900");
  const buttonColorScheme = "blue";

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
      <Box mb={10} textAlign="center">
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
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Bộ Công cụ Truyền thông EventHub
        </Heading>
        <Text fontSize="lg" maxW="3xl" mx="auto" color={textColor}>
          Chào mừng đến với bộ công cụ truyền thông của EventHub - nền tảng kết
          nối người tổ chức sự kiện và người tham gia. Dưới đây là các tài
          nguyên cần thiết để sử dụng thương hiệu của chúng tôi.
        </Text>
      </Box>

      {/* Highlights */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Box
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
            <Icon as={FaUserTie} boxSize={5} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Về chúng tôi
          </Heading>
          <Text color={textColor}>
            Tìm hiểu về dự án EventHub, sứ mệnh, tầm nhìn và đội ngũ phát triển
            đằng sau dự án này.
          </Text>
        </Box>
        <Box
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
            <Icon as={FaPalette} boxSize={5} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Thương hiệu
          </Heading>
          <Text color={textColor}>
            Hướng dẫn sử dụng logo, bảng màu, và các yếu tố thương hiệu chính
            thức của EventHub.
          </Text>
        </Box>
        <Box
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
            <Icon as={FaImages} boxSize={5} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Tài nguyên
          </Heading>
          <Text color={textColor}>
            Truy cập và tải xuống hình ảnh, logo, và các tài liệu truyền thông
            của EventHub.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Về chúng tôi */}
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
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
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
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
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
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
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
          Bảng màu thương hiệu
        </Heading>
        <Text fontSize="lg" mb={8} color={textColor}>
          Màu sắc chính thức của EventHub. Sử dụng chúng để đảm bảo tính nhất
          quán khi trình bày về thương hiệu của chúng tôi.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {brandColors.map((color) => (
            <Box
              key={color.name}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
            >
              <Box h="100px" bg={color.hex} />
              <Box p={4} bg={bgColor}>
                <Text fontWeight="bold" mb={1}>
                  {color.name}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  HEX: {color.hex}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  RGB: {color.rgb}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Logo */}
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
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
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
              <Box p={4} bg={bgColor}>
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
              bg={bgColor}
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
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
                    <Badge colorScheme={buttonColorScheme}>{kit.format}</Badge>
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
      <Box
        mb={10}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <Heading
          as="h2"
          size="xl"
          mb={6}
          color={headingColor}
          id="press-releases"
        >
          <Flex align="center">
            <Icon as={FaNewspaper} mr={3} color={accentColor} />
            Thông cáo báo chí
          </Flex>
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
              bg={bgColor}
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
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
          Các câu hỏi thường gặp về việc sử dụng thương hiệu và tài sản của
          EventHub.
        </Text>

        <Accordion allowToggle>
          <AccordionItem borderTopWidth="0" borderBottomWidth="1px">
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Tôi có thể sử dụng logo EventHub trong bài báo của mình không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} color={textColor}>
              Có, bạn có thể sử dụng logo EventHub trong các bài báo, bài viết
              và bài đăng trên blog với điều kiện bạn tuân thủ hướng dẫn sử dụng
              thương hiệu của chúng tôi. Vui lòng không thay đổi màu sắc, tỷ lệ
              hoặc bố cục của logo.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem borderBottomWidth="1px">
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Tôi có cần xin phép trước khi sử dụng tài sản thương hiệu
                  không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} color={textColor}>
              Không cần xin phép trước nếu bạn sử dụng tài sản thương hiệu theo
              đúng hướng dẫn của chúng tôi và cho mục đích báo chí, giáo dục
              hoặc phi thương mại. Tuy nhiên, đối với các mục đích thương mại
              hoặc quảng cáo, vui lòng liên hệ với chúng tôi để được chấp thuận.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem borderBottomWidth="0">
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Tôi có thể sử dụng lại nội dung từ trang web EventHub không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} color={textColor}>
              Bạn có thể trích dẫn thông tin từ trang web của chúng tôi miễn là
              bạn cung cấp nguồn thích hợp và liên kết đến trang web của chúng
              tôi. Việc sao chép hoặc sử dụng lại một lượng lớn nội dung có thể
              yêu cầu sự cho phép rõ ràng.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Liên hệ */}
      <Box mb={10} p={8} bg={boxAccentBg} borderRadius="lg" textAlign="center">
        <Heading as="h2" size="lg" mb={4} color={headingColor}>
          Bạn cần thêm thông tin?
        </Heading>
        <Text fontSize="lg" mb={6} color={textColor}>
          Nếu bạn có câu hỏi thêm về bộ công cụ truyền thông hoặc cần hỗ trợ,
          vui lòng liên hệ với bộ phận truyền thông của chúng tôi.
        </Text>
        <Button
          colorScheme={buttonColorScheme}
          size="lg"
          leftIcon={<FaEnvelope />}
          as={Link}
          to="/contact-us"
        >
          Liên hệ với chúng tôi
        </Button>
      </Box>

      {/* Tài liệu liên quan */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={headingColor}>
          Tài liệu liên quan
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <VStack
            as={Link}
            to="/about-us"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaUserTie} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Về chúng tôi</Text>
          </VStack>
          <VStack
            as={Link}
            to="/contact-us"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaEnvelope} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Liên hệ</Text>
          </VStack>
          <VStack
            as={Link}
            to="/help-center"
            p={5}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ textDecor: "none", shadow: "md" }}
          >
            <Icon as={FaFileAlt} boxSize={6} color={accentColor} />
            <Text fontWeight="medium">Trung tâm trợ giúp</Text>
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

export default PressKit;
