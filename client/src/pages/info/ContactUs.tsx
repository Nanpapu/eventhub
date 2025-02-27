import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
  SimpleGrid,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaQuestion,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Component hiển thị thông tin liên hệ
const ContactInfo = ({
  icon,
  title,
  content,
}: {
  icon: IconType;
  title: string;
  content: string | React.ReactNode;
}) => {
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("sm", "none");

  return (
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
      <Flex justifyContent="start" alignItems="center" mb={4}>
        <Box borderRadius="full" bg={accentColor} p={3} mr={4} color="white">
          <Icon as={icon} boxSize={5} />
        </Box>
        <Heading as="h3" size="md">
          {title}
        </Heading>
      </Flex>
      <Text>{content}</Text>
    </Box>
  );
};

const ContactUs = () => {
  // Colors cho dark/light mode - đồng bộ theo HelpCenter
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formValues.name.trim()) {
      errors.name = "Vui lòng nhập tên của bạn";
      isValid = false;
    }

    if (!formValues.email.trim()) {
      errors.email = "Vui lòng nhập địa chỉ email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Địa chỉ email không hợp lệ";
      isValid = false;
    }

    if (!formValues.subject.trim()) {
      errors.subject = "Vui lòng nhập tiêu đề";
      isValid = false;
    }

    if (!formValues.message.trim()) {
      errors.message = "Vui lòng nhập nội dung tin nhắn";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Mô phỏng việc gửi form
      setTimeout(() => {
        toast({
          title: "Gửi tin nhắn thành công!",
          description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setFormValues({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setIsSubmitting(false);
      }, 1500);
    }
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
          <BreadcrumbLink>Liên hệ</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Liên hệ với Chúng tôi
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
          Hãy cho chúng tôi biết bạn cần gì. Đội ngũ của chúng tôi sẽ phản hồi
          sớm nhất có thể.
        </Text>
      </Box>

      {/* Contact Information */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
        <ContactInfo
          icon={FaMapMarkerAlt}
          title="Địa chỉ"
          content={
            <>
              Khu phố 6, Phường Linh Trung, TP.Thủ Đức,
              <br />
              TP.Hồ Chí Minh, Việt Nam
            </>
          }
        />
        <ContactInfo
          icon={FaPhone}
          title="Điện thoại"
          content={
            <>
              +84 123 456 789
              <br />
              +84 987 654 321
            </>
          }
        />
        <ContactInfo
          icon={FaEnvelope}
          title="Email"
          content={
            <>
              support@eventhub.example.com
              <br />
              info@eventhub.example.com
            </>
          }
        />
      </SimpleGrid>

      {/* Contact Form */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={16}>
        <Box>
          <Heading as="h2" size="xl" mb={4} color={headingColor}>
            Gửi Tin nhắn
          </Heading>
          <Text mb={6} color={textColor}>
            Vui lòng điền đầy đủ thông tin bên dưới và chúng tôi sẽ liên hệ lại
            với bạn trong thời gian sớm nhất.
          </Text>

          <VStack as="form" spacing={6} onSubmit={handleSubmit} align="stretch">
            <FormControl isRequired isInvalid={Boolean(formErrors.name)}>
              <FormLabel>Tên của bạn</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Nhập tên của bạn"
                value={formValues.name}
                onChange={handleChange}
                focusBorderColor={accentColor}
              />
              <FormErrorMessage>{formErrors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={Boolean(formErrors.email)}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Nhập địa chỉ email"
                value={formValues.email}
                onChange={handleChange}
                focusBorderColor={accentColor}
              />
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={Boolean(formErrors.subject)}>
              <FormLabel>Tiêu đề</FormLabel>
              <Input
                type="text"
                name="subject"
                placeholder="Nhập tiêu đề tin nhắn"
                value={formValues.subject}
                onChange={handleChange}
                focusBorderColor={accentColor}
              />
              <FormErrorMessage>{formErrors.subject}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={Boolean(formErrors.message)}>
              <FormLabel>Tin nhắn</FormLabel>
              <Textarea
                name="message"
                placeholder="Nhập nội dung tin nhắn"
                value={formValues.message}
                onChange={handleChange}
                rows={6}
                focusBorderColor={accentColor}
              />
              <FormErrorMessage>{formErrors.message}</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="teal"
              size="lg"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Đang gửi..."
            >
              Gửi Tin nhắn
            </Button>
          </VStack>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4} color={headingColor}>
            Câu hỏi Thường gặp
          </Heading>
          <Text mb={6} color={textColor}>
            Trước khi liên hệ, bạn có thể tìm thấy câu trả lời cho các câu hỏi
            phổ biến trong Trung tâm trợ giúp của chúng tôi.
          </Text>
          <Box p={6} bg={hoverBg} borderRadius="lg" mb={8}>
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={FaQuestion} color={accentColor} />
                <Text fontWeight="bold">Làm thế nào để tạo sự kiện?</Text>
              </HStack>
              <Text color={textColor}>
                Để tạo sự kiện, đăng nhập vào tài khoản của bạn, nhấp vào "Tạo
                sự kiện" và làm theo hướng dẫn.
              </Text>
            </VStack>
          </Box>
          <Box p={6} bg={hoverBg} borderRadius="lg" mb={8}>
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={FaQuestion} color={accentColor} />
                <Text fontWeight="bold">
                  Làm thế nào để trở thành nhà tổ chức?
                </Text>
              </HStack>
              <Text color={textColor}>
                Để trở thành nhà tổ chức, hãy truy cập trang "Trở thành nhà tổ
                chức" và hoàn tất quy trình đăng ký.
              </Text>
            </VStack>
          </Box>
          <Button
            as={Link}
            to="/help"
            size="lg"
            variant="outline"
            colorScheme="teal"
            width="100%"
          >
            Xem tất cả các câu hỏi
          </Button>
        </Box>
      </SimpleGrid>

      {/* Call to Action */}
      <Box mt={16} p={8} bg={hoverBg} borderRadius="lg" textAlign="center">
        <Heading as="h3" size="lg" mb={4} color={headingColor}>
          Cần trợ giúp khẩn cấp?
        </Heading>
        <Text mb={6} color={textColor} maxW="2xl" mx="auto">
          Đối với các vấn đề khẩn cấp hoặc hỗ trợ ngay lập tức, hãy gọi cho
          chúng tôi theo số +84 123 456 789 trong giờ làm việc (8:00 - 17:00,
          Thứ 2 - Thứ 6).
        </Text>
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

export default ContactUs;
