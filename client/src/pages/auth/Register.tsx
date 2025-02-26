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
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Divider,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
}

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      role: "user",
    },
  });

  const password = watch("password");

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      console.log("Register data:", data);
      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản của bạn đã được tạo.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast({
        title: "Đăng ký thất bại!",
        description: "Đã xảy ra lỗi trong quá trình đăng ký.",
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
            Tạo tài khoản
          </Heading>

          <Text textAlign="center" color="gray.500" fontSize="md">
            Tạo tài khoản để trải nghiệm tất cả tính năng của EventHub
          </Text>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel fontWeight="medium">Họ và tên</FormLabel>
                <Input
                  placeholder="Họ tên đầy đủ của bạn"
                  size="lg"
                  focusBorderColor="teal.400"
                  {...register("fullName", {
                    required: "Họ tên là bắt buộc",
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

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

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontWeight="medium">Xác nhận mật khẩu</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
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

              <FormControl>
                <FormLabel fontWeight="medium">Tôi muốn</FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <HStack spacing={6}>
                        <Radio value="user" colorScheme="teal">
                          Tham gia sự kiện
                        </Radio>
                        <Radio value="organizer" colorScheme="teal">
                          Tổ chức sự kiện
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
                mt={4}
                w="full"
              >
                Tạo tài khoản
              </Button>
            </Stack>
          </form>

          <Flex justify="center" align="center">
            <Text>
              Đã có tài khoản?{" "}
              <ChakraLink
                as={Link}
                to="/login"
                color="teal.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                Đăng nhập
              </ChakraLink>
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Container>
  );
};

export default Register;
