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
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Center,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import authService from "../../services/auth.service";
import { useTranslation } from "react-i18next";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        title: t("auth.resetPassword.resetSuccess"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Chuyển hướng đến trang đăng nhập
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: t("auth.resetPassword.resetFailed"),
        description: error.response?.data?.message || t("common.unknownError"),
        status: "error",
        duration: 3000,
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
            <Image src="/logo.svg" alt="EventHub Logo" w="64px" h="64px" />
          </Center>
          <Stack spacing={3} textAlign="center">
            <Heading fontSize="2xl" fontWeight="bold">
              {t("auth.resetPassword.title")}
            </Heading>
          </Stack>
        </Stack>

        <Box
          py={{ base: 0, sm: 8 }}
          px={{ base: 4, sm: 10 }}
          bg={{ base: "transparent", sm: "white" }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "lg" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontWeight="medium">{t("auth.password")}</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
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
                <FormLabel fontWeight="medium">
                  {t("auth.confirmPassword")}
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t(
                      "auth.resetPassword.confirmPasswordPlaceholder"
                    )}
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
                {t("common.submit")}
              </Button>

              <Button
                as={Link}
                to="/auth/login"
                variant="link"
                colorScheme="teal"
                size="sm"
                leftIcon={<FaArrowLeft />}
              >
                {t("common.back")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default ResetPassword;
