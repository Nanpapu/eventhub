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
} from "@chakra-ui/react";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
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
  return (
    <HStack spacing={4} align="flex-start">
      <Box
        p={3}
        bg="teal.500"
        borderRadius="full"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} w={5} h={5} />
      </Box>
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text color="gray.600">{content}</Text>
      </Box>
    </HStack>
  );
};

const ContactUs = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  // Xử lý thay đổi input
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
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Xác thực form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formValues.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formValues.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Giả lập gửi form
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        // Reset form
        setFormValues({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 1500);
    }
  };

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
          <BreadcrumbLink>Contact Us</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Heading */}
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Contact Us
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Contact Form */}
        <Box bg="white" p={6} boxShadow="md" borderRadius="lg">
          <Heading as="h2" size="lg" mb={6}>
            Send us a message
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.subject}>
                <FormLabel>Subject</FormLabel>
                <Input
                  type="text"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.subject}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.message}>
                <FormLabel>Message</FormLabel>
                <Textarea
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows={5}
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Contact Information */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Contact Information
          </Heading>
          <VStack spacing={6} align="stretch">
            <ContactInfo
              icon={FaMapMarkerAlt}
              title="Address"
              content="Khu phố 6, Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam"
            />
            <ContactInfo
              icon={FaPhone}
              title="Phone"
              content="+84 28 3725 2002"
            />
            <ContactInfo
              icon={FaEnvelope}
              title="Email"
              content="info@eventhub.example.com"
            />
          </VStack>

          {/* Google Maps */}
          <Box mt={8} h="300px" borderRadius="md" overflow="hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2311711962147!2d106.80086541546364!3d10.87001776040235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1676447624261!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="UIT Map"
            />
          </Box>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default ContactUs;
