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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      console.log("Login data:", data);
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn trở lại với EventHub!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
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

  return (
    <Container maxW="md" py={8}>
      <Box bg={bgColor} p={8} borderRadius="xl" boxShadow={boxShadow}>
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

          <Divider />

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
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Flex justify="space-between" align="center">
                <Checkbox colorScheme="teal" {...register("rememberMe")}>
                  Ghi nhớ đăng nhập
                </Checkbox>
                <ChakraLink
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
    </Container>
  );
};

export default Login;
