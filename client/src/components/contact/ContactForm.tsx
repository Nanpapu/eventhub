import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Textarea,
  FormErrorMessage,
  useToast,
  FormHelperText,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import api from "../../utils/api";

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

interface ContactFormProps {
  onSuccess?: () => void;
  colorScheme?: string;
  accentColor?: string;
}

/**
 * Component form liên hệ tích hợp với API
 */
const ContactForm = ({
  onSuccess,
  colorScheme = "teal",
  accentColor,
}: ContactFormProps) => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Xóa thông báo thành công/lỗi khi người dùng tiếp tục nhập
    if (submitSuccess || submitError) {
      setSubmitSuccess(null);
      setSubmitError(null);
    }
  };

  // Kiểm tra form hợp lệ
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formValues.name.trim()) {
      errors.name = "Vui lòng nhập tên của bạn";
      isValid = false;
    } else if (formValues.name.trim().length < 2) {
      errors.name = "Tên phải có ít nhất 2 ký tự";
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
    } else if (formValues.subject.trim().length < 2) {
      errors.subject = "Tiêu đề phải có ít nhất 2 ký tự";
      isValid = false;
    }

    if (!formValues.message.trim()) {
      errors.message = "Vui lòng nhập nội dung tin nhắn";
      isValid = false;
    } else if (formValues.message.trim().length < 10) {
      errors.message = "Nội dung phải có ít nhất 10 ký tự";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      try {
        // Gọi API thực
        const response = await api.post("/contact", formValues);

        // Xử lý kết quả
        if (response.data.success) {
          setSubmitSuccess(
            response.data.message || "Tin nhắn của bạn đã được gửi thành công"
          );

          // Reset form
          setFormValues({
            name: "",
            email: "",
            subject: "",
            message: "",
          });

          // Thông báo thành công
          toast({
            title: "Gửi tin nhắn thành công!",
            description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Gọi callback nếu có
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error: any) {
        console.error("Error sending contact message:", error);

        // Hiển thị lỗi
        const errorMessage =
          error.response?.data?.message ||
          "Không thể gửi tin nhắn. Vui lòng thử lại sau.";

        setSubmitError(errorMessage);

        toast({
          title: "Lỗi khi gửi tin nhắn",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <VStack as="form" spacing={6} align="stretch" onSubmit={handleSubmit}>
      {/* Thông báo thành công */}
      {submitSuccess && (
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          py={4}
        >
          <AlertIcon boxSize={6} mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Đã gửi thành công!
          </AlertTitle>
          <AlertDescription maxWidth="md">{submitSuccess}</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setSubmitSuccess(null)}
          />
        </Alert>
      )}

      {/* Thông báo lỗi */}
      {submitError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Lỗi!</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Box>
          <CloseButton
            onClick={() => setSubmitError(null)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}

      <FormControl isRequired isInvalid={Boolean(formErrors.name)}>
        <FormLabel>Tên của bạn</FormLabel>
        <Input
          type="text"
          name="name"
          placeholder="Nhập tên của bạn"
          value={formValues.name}
          onChange={handleChange}
          focusBorderColor={accentColor || `${colorScheme}.500`}
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
          focusBorderColor={accentColor || `${colorScheme}.500`}
        />
        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
        <FormHelperText>
          Chúng tôi sẽ không bao giờ chia sẻ email của bạn.
        </FormHelperText>
      </FormControl>

      <FormControl isRequired isInvalid={Boolean(formErrors.subject)}>
        <FormLabel>Tiêu đề</FormLabel>
        <Input
          type="text"
          name="subject"
          placeholder="Nhập tiêu đề tin nhắn"
          value={formValues.subject}
          onChange={handleChange}
          focusBorderColor={accentColor || `${colorScheme}.500`}
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
          focusBorderColor={accentColor || `${colorScheme}.500`}
        />
        <FormErrorMessage>{formErrors.message}</FormErrorMessage>
      </FormControl>

      <Button
        colorScheme={colorScheme}
        size="lg"
        type="submit"
        isLoading={isSubmitting}
        loadingText="Đang gửi..."
        disabled={isSubmitting}
      >
        Gửi Tin nhắn
      </Button>
    </VStack>
  );
};

export default ContactForm;
