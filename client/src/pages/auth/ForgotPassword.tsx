import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  FormErrorMessage,
  useToast,
  Image,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import authService from "../../services/auth.service";
import { useState } from "react";
import logo from "../../assets/EventHub_alt_logo.png";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const formBg = useColorModeValue("white", "gray.700");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setPreviewURL(null); // Reset preview URL
    try {
      const response = await authService.forgotPassword(data);

      // Kiểm tra xem có URL xem trước không (cho môi trường phát triển)
      if (response.previewURL) {
        setPreviewURL(response.previewURL);
      }

      toast({
        title: "Đã gửi link đặt lại mật khẩu",
        description: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      let errorMessage = "Đã xảy ra lỗi không xác định";

      // Xử lý các trường hợp lỗi cụ thể từ API
      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.status === 404) {
          errorMessage = "Không tìm thấy email trong hệ thống.";
        } else if (errorObj.response?.status === 500) {
          errorMessage = "Lỗi máy chủ. Không thể gửi email đặt lại mật khẩu.";
        }
      } else if (error && typeof error === "object" && "request" in error) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      }

      toast({
        title: "Không thể gửi link đặt lại mật khẩu",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 24 }} px={{ base: 0, sm: 8 }}>
      <Stack spacing={8}>
        <Stack spacing={6}>
          <Center>
            <Image src={logo} alt="EventHub Logo" w="64px" h="64px" />
          </Center>
          <Stack spacing={3} textAlign="center">
            <Heading fontSize="2xl" fontWeight="bold">
              Quên mật khẩu
            </Heading>
            <Text color="gray.500">
              Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
            </Text>
          </Stack>
        </Stack>

        {previewURL && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mb={1}>Email xem trước</AlertTitle>
              <AlertDescription display="block">
                <Text mb={2}>
                  Đây là tính năng chỉ có trong môi trường phát triển. Trên môi
                  trường thực tế, email sẽ được gửi đến hộp thư của bạn.
                </Text>
                <Button
                  as="a"
                  href={previewURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="teal"
                  size="sm"
                  rightIcon={<FaArrowLeft transform="rotate(135deg)" />}
                >
                  Xem email đặt lại mật khẩu
                </Button>
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={() => setPreviewURL(null)}
            />
          </Alert>
        )}

        <Box
          py={{ base: 0, sm: 8 }}
          px={{ base: 4, sm: 10 }}
          bg={{ base: "transparent", sm: formBg }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "lg" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="medium">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  size="lg"
                  focusBorderColor="teal.400"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Địa chỉ email không hợp lệ",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
              >
                Gửi link đặt lại mật khẩu
              </Button>

              <Button
                as={Link}
                to="/login"
                variant="link"
                colorScheme="teal"
                size="sm"
                leftIcon={<FaArrowLeft />}
              >
                Quay lại đăng nhập
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default ForgotPassword;
