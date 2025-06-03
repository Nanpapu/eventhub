import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import authService from "../../services/auth.service";
import logo from "../../assets/EventHub_logo.png";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lấy màu nền cho Box dựa trên color mode
  const formBg = useColorModeValue("white", "gray.700");

  // Lấy token từ query parameters
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // Lưu token vào state và xóa nó khỏi URL để tăng bảo mật
  useEffect(() => {
    if (token) {
      // Thay thế URL hiện tại bằng URL không có token
      window.history.replaceState({}, document.title, "/auth/reset-password");
    }
  }, [token]);

  // Nếu không có token, chuyển hướng về trang quên mật khẩu
  if (!token) {
    navigate("/auth/forgot-password");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>();

  const password = watch("password");

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
      });

      toast({
        title: "Đặt lại mật khẩu thành công",
        description:
          "Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Chuyển hướng đến trang đăng nhập sau 2 giây để người dùng có thể đọc thông báo
      setTimeout(() => {
        navigate("/login", { state: { from: "reset-password-success" } });
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "Đã xảy ra lỗi không xác định";

      // Xử lý các trường hợp lỗi cụ thể từ API
      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.status === 400) {
          errorMessage = "Token không hợp lệ hoặc đã hết hạn.";
        } else if (errorObj.response?.status === 500) {
          errorMessage = "Lỗi máy chủ. Không thể đặt lại mật khẩu.";
        }
      } else if (error && typeof error === "object" && "request" in error) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      }

      toast({
        title: "Đặt lại mật khẩu thất bại",
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
            <Image
              src={logo}
              alt="EventHub Logo"
              w="160px"
              objectFit="contain"
            />
          </Center>
          <Stack spacing={3} textAlign="center">
            <Heading fontSize="2xl" fontWeight="bold">
              Đặt lại mật khẩu
            </Heading>
          </Stack>
        </Stack>

        <Box
          py={{ base: 0, sm: 8 }}
          px={{ base: 4, sm: 10 }}
          bg={{ base: "transparent", sm: formBg }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "lg" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontWeight="medium">Mật khẩu mới</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    size="lg"
                    focusBorderColor="teal.400"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      onClick={togglePassword}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontWeight="medium">Xác nhận mật khẩu</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    size="lg"
                    focusBorderColor="teal.400"
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu của bạn",
                      validate: (value) =>
                        value === password || "Mật khẩu không khớp",
                    })}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      onClick={toggleConfirmPassword}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
              >
                Đặt lại mật khẩu
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

export default ResetPassword;
