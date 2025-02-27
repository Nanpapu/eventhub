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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaEnvelope,
} from "react-icons/fa";
import { IconType } from "react-icons";

// Định nghĩa cấu trúc dữ liệu cho các chủ đề trợ giúp
interface HelpTopic {
  title: string;
  description: string;
  icon: IconType;
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Tinh gọn Help Center thành trang FAQ đơn giản
const HelpCenter = () => {
  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Dữ liệu mẫu cho các chủ đề trợ giúp
  const helpTopics: HelpTopic[] = [
    {
      title: "Tài khoản & Hồ sơ",
      description: "Quản lý tài khoản, đăng nhập và thông tin cá nhân",
      icon: FaUserCircle,
      faqs: [
        {
          question: "Làm thế nào để đăng ký tài khoản mới?",
          answer:
            "Để đăng ký tài khoản mới, hãy nhấp vào nút 'Đăng ký' trên thanh điều hướng. Nhập thông tin của bạn bao gồm họ tên, email và mật khẩu, sau đó xác nhận email để hoàn tất quá trình đăng ký.",
        },
        {
          question: "Tôi quên mật khẩu, phải làm sao?",
          answer:
            "Nếu bạn quên mật khẩu, hãy nhấp vào liên kết 'Quên mật khẩu' trên trang đăng nhập. Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu. Kiểm tra hộp thư đến của bạn và làm theo hướng dẫn được gửi.",
        },
        {
          question: "Làm cách nào để thay đổi thông tin cá nhân?",
          answer:
            "Để cập nhật thông tin cá nhân, hãy đăng nhập vào tài khoản của bạn, truy cập trang Hồ sơ từ menu người dùng. Tại đây, bạn có thể chỉnh sửa thông tin cá nhân, cập nhật ảnh hồ sơ và thay đổi cài đặt thông báo.",
        },
      ],
    },
    {
      title: "Sự kiện & Đăng ký",
      description: "Tìm kiếm, đăng ký và quản lý sự kiện",
      icon: FaCalendarAlt,
      faqs: [
        {
          question: "Làm thế nào để tìm kiếm sự kiện?",
          answer:
            "Bạn có thể tìm kiếm sự kiện bằng cách sử dụng thanh tìm kiếm trên trang chủ. Lọc sự kiện theo ngày, địa điểm, hoặc danh mục để tìm sự kiện phù hợp với bạn. Bạn cũng có thể duyệt qua các sự kiện nổi bật hoặc sắp diễn ra trên trang chủ.",
        },
        {
          question: "Làm cách nào để đăng ký tham gia sự kiện?",
          answer:
            "Để đăng ký tham gia sự kiện, hãy mở trang chi tiết sự kiện bạn muốn tham gia và nhấp vào nút 'Đăng ký'. Làm theo các bước để hoàn tất đăng ký. Nếu là sự kiện trả phí, bạn sẽ được chuyển hướng đến trang thanh toán.",
        },
        {
          question: "Làm thế nào để hủy đăng ký tham gia sự kiện?",
          answer:
            "Để hủy đăng ký, hãy vào trang Sự kiện của tôi trong hồ sơ người dùng. Tìm sự kiện bạn muốn hủy và nhấp vào 'Hủy đăng ký'. Lưu ý rằng một số sự kiện có thể có chính sách hoàn tiền khác nhau, vì vậy hãy kiểm tra điều khoản trước khi hủy.",
        },
      ],
    },
    {
      title: "Thanh toán & Hoàn tiền",
      description:
        "Thông tin về phương thức thanh toán và chính sách hoàn tiền",
      icon: FaCreditCard,
      faqs: [
        {
          question: "EventHub chấp nhận những phương thức thanh toán nào?",
          answer:
            "EventHub chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm thẻ tín dụng/ghi nợ (Visa, MasterCard, American Express), ví điện tử (MoMo, ZaloPay, VNPay) và chuyển khoản ngân hàng cho một số sự kiện.",
        },
        {
          question: "Làm thế nào để yêu cầu hoàn tiền?",
          answer:
            "Để yêu cầu hoàn tiền, hãy vào phần Sự kiện của tôi trong hồ sơ người dùng, tìm sự kiện cần hoàn tiền và nhấp vào 'Yêu cầu hoàn tiền'. Điền thông tin cần thiết và gửi yêu cầu. Thời gian xử lý hoàn tiền thường mất 5-7 ngày làm việc.",
        },
        {
          question: "Chính sách hoàn tiền của EventHub như thế nào?",
          answer:
            "Chính sách hoàn tiền tùy thuộc vào từng sự kiện và do người tổ chức quyết định. Thông thường, bạn có thể được hoàn tiền đầy đủ nếu hủy trong vòng 48 giờ sau khi đăng ký hoặc ít nhất 7 ngày trước sự kiện. Hãy kiểm tra chính sách hoàn tiền cụ thể của mỗi sự kiện trước khi đăng ký.",
        },
      ],
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
          <BreadcrumbLink>Trung tâm Trợ giúp</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Trung tâm Trợ giúp
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto">
          Tìm câu trả lời nhanh chóng cho các câu hỏi của bạn về EventHub
        </Text>
      </Box>

      {/* Search Box */}
      <Box
        maxW="2xl"
        mx="auto"
        mb={16}
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
          />
        </InputGroup>
        <HStack mt={4} spacing={4} justify="center">
          <Button leftIcon={<Icon as={FaQuestionCircle} />} variant="ghost">
            Câu hỏi phổ biến
          </Button>
          <Button leftIcon={<Icon as={FaEnvelope} />} variant="ghost">
            Liên hệ hỗ trợ
          </Button>
        </HStack>
      </Box>

      {/* FAQ Categories */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
        {helpTopics.map((topic, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            overflow="hidden"
            _hover={{ shadow: "md" }}
            transition="all 0.3s"
          >
            <Box p={6}>
              <HStack spacing={4} mb={3}>
                <Icon as={topic.icon} boxSize={8} color={accentColor} />
                <Heading as="h3" size="md">
                  {topic.title}
                </Heading>
              </HStack>
              <Text mb={4}>{topic.description}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* FAQ Accordion */}
      {helpTopics.map((topic, topicIndex) => (
        <Box key={topicIndex} mb={10}>
          <Heading as="h3" size="lg" mb={6} id={`topic-${topicIndex}`}>
            {topic.title}
          </Heading>
          <Accordion allowMultiple>
            {topic.faqs.map((faq, faqIndex) => (
              <AccordionItem
                key={faqIndex}
                mb={3}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
                overflow="hidden"
              >
                <h4>
                  <AccordionButton
                    p={4}
                    _hover={{ bg: hoverBg }}
                    _expanded={{ bg: hoverBg, fontWeight: "medium" }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h4>
                <AccordionPanel pb={4} px={4}>
                  <Text>{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      ))}

      {/* Contact Us Section */}
      <Box mt={16} p={8} bg={hoverBg} borderRadius="lg" textAlign="center">
        <Heading as="h3" size="lg" mb={4}>
          Vẫn cần trợ giúp?
        </Heading>
        <Text mb={6}>
          Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, hãy liên hệ
          với đội ngũ hỗ trợ của chúng tôi.
        </Text>
        <Button
          as={Link}
          to="/info/contact-us"
          colorScheme="blue"
          size="lg"
          px={8}
        >
          Liên hệ Hỗ trợ
        </Button>
      </Box>

      {/* Footer note */}
      <Divider my={10} />
      <Text fontSize="sm" textAlign="center" color="gray.500">
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default HelpCenter;
