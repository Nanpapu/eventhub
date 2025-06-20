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
  Link as ChakraLink,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  useColorModeValue,
  Checkbox,
  Flex,
  Image,
  Center,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import authService from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../app/hooks";
import { login } from "../../app/features/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Lấy đường dẫn chuyển hướng từ sessionStorage nếu có
  useEffect(() => {
    const storedPath = sessionStorage.getItem("redirectAfterLogin");
    if (storedPath) {
      setRedirectPath(storedPath);
    }

    // Kiểm tra nếu người dùng đến từ trang reset password thành công
    if (location.state && location.state.from === "reset-password-success") {
      toast({
        title: "Đặt lại mật khẩu thành công!",
        description: "Vui lòng đăng nhập bằng mật khẩu mới của bạn.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [location, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Sử dụng Redux action thay vì gọi authService trực tiếp
      const resultAction = await dispatch(
        login({
          email: data.email,
          password: data.password,
        })
      );

      // Kiểm tra kết quả của action
      if (login.fulfilled.match(resultAction)) {
        // Đăng nhập thành công
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn trở lại với EventHub!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        // Chuyển hướng sau khi đăng nhập thành công
        setTimeout(() => {
          // Nếu có đường dẫn chuyển hướng, sử dụng nó và xóa khỏi sessionStorage
          if (redirectPath) {
            sessionStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
          } else {
            // Nếu không, chuyển về trang chủ
            navigate("/");
          }
        }, 1500);
      } else {
        // Đăng nhập thất bại (kết quả rejected)
        // Thông báo lỗi đã được xử lý trong authSlice.rejected
        const errorMessage = resultAction.payload || "Đăng nhập thất bại";
        toast({
          title: "Đăng nhập thất bại!",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      toast({
        title: "Đăng nhập thất bại!",
        description: "Vui lòng kiểm tra email và mật khẩu của bạn.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const socialBtnBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="container.md" py={10}>
      <Flex
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
        bg={bgColor}
        borderRadius="xl"
        boxShadow={boxShadow}
      >
        {/* Left side - Form */}
        <Box p={8} width={{ base: "100%", md: "60%" }}>
          <Stack spacing={6}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              alignSelf="flex-start"
              size="sm"
              onClick={() => navigate("/")}
            >
              Quay lại Trang chủ
            </Button>

            <Heading textAlign="center" size="xl">
              Chào mừng quay lại
            </Heading>

            <Text textAlign="center" color="gray.500" fontSize="md">
              Đăng nhập để tiếp tục hành trình với EventHub
            </Text>

            {/* Social login buttons - temporarily hidden
            <Stack direction="row" spacing={4}>
              <Button
                w="full"
                variant="outline"
                leftIcon={<FaGoogle />}
                bg={socialBtnBg}
                _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
              >
                Google
              </Button>
              <Button
                w="full"
                variant="outline"
                leftIcon={<FaFacebook />}
                bg={socialBtnBg}
                _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
              >
                Facebook
              </Button>
            </Stack>

            <Flex align="center" my={4}>
              <Divider borderColor={dividerColor} />
              <Text px={3} color="gray.500" fontSize="sm">
                HOẶC
              </Text>
              <Divider borderColor={dividerColor} />
            </Flex>
            */}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="medium">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="email.cua.ban@example.com"
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

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="medium">Mật khẩu</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
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
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <Flex justify="space-between" align="center">
                  <Checkbox colorScheme="teal" {...register("rememberMe")}>
                    Ghi nhớ đăng nhập
                  </Checkbox>
                  <ChakraLink
                    as={Link}
                    to="/auth/forgot-password"
                    color="teal.500"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Quên mật khẩu?
                  </ChakraLink>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  fontSize="md"
                  isLoading={isSubmitting}
                  mt={4}
                  w="full"
                >
                  Đăng nhập
                </Button>
              </Stack>
            </form>

            <Flex justify="center" align="center">
              <Text>
                Chưa có tài khoản?{" "}
                <ChakraLink
                  as={Link}
                  to="/register"
                  color="teal.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: "underline" }}
                >
                  Đăng ký ngay
                </ChakraLink>
              </Text>
            </Flex>
          </Stack>
        </Box>

        {/* Right side - Image */}
        <Box
          display={{ base: "none", md: "block" }}
          width="40%"
          position="relative"
          bg="teal.500"
          overflow="hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Event scene"
            objectFit="cover"
            width="100%"
            height="100%"
            opacity="0.8"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bgGradient="linear(to-t, rgba(0,128,128,0.9), rgba(0,128,128,0.6))"
          />
          <Center
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            p={8}
          >
            <Stack spacing={6} color="white" textAlign="center">
              <Heading size="xl" color="white">
                Đăng nhập để tham gia sự kiện
              </Heading>
              <Text fontSize="lg">
                Khám phá và tận hưởng hàng nghìn sự kiện đa dạng trên EventHub
              </Text>
            </Stack>
          </Center>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
