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
  Image,
  Textarea,
  Center,
  Collapse,
  Select,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { useAppDispatch } from "../../app/hooks";
import { register as registerAction } from "../../app/features/authSlice";
import authService, { RegisterData } from "../../services/auth.service";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
  organizationName?: string;
  organizationType?: string;
  description?: string;
  phone?: string;
}

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "organizer">(
    "user"
  );
  const dispatch = useAppDispatch();

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
      const registerData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === "organizer") {
        registerData.organizationName = data.organizationName;
        registerData.organizationType = data.organizationType;
        registerData.description = data.description;
        registerData.phone = data.phone;
      }

      const resultAction = await dispatch(registerAction(registerData));

      if (registerAction.fulfilled.match(resultAction)) {
        toast({
          title: "Đăng ký thành công!",
          description: "Tài khoản của bạn đã được tạo.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorMessage = resultAction.payload || "Đăng ký thất bại";
        toast({
          title: "Đăng ký thất bại!",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
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
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  const socialBtnBg = useColorModeValue("gray.100", "gray.700");
  const collapseBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Container maxW="container.lg" py={10}>
      <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 0, lg: 6 }}>
        {/* Form Section */}
        <Box
          p={8}
          bg={bgColor}
          borderRadius="xl"
          boxShadow={boxShadow}
          width={{ base: "100%", lg: "65%" }}
          overflow="hidden"
        >
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

            <Flex align="center">
              <Divider borderColor={dividerColor} />
              <Text px={3} color="gray.500" fontSize="sm">
                HOẶC
              </Text>
              <Divider borderColor={dividerColor} />
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel fontWeight="medium">Họ và tên</FormLabel>
                  <Input
                    placeholder="Họ tên đầy đủ của bạn"
                    size="lg"
                    focusBorderColor="teal.400"
                    {...register("name", {
                      required: "Họ tên là bắt buộc",
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
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
                      <RadioGroup
                        {...field}
                        onChange={(val) => {
                          field.onChange(val);
                          setSelectedRole(val as "user" | "organizer");
                        }}
                      >
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

                {/* Thông tin bổ sung cho tổ chức */}
                <Collapse in={selectedRole === "organizer"} animateOpacity>
                  <Box
                    p={4}
                    mt={4}
                    bg={collapseBg}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="teal.400"
                  >
                    <Heading size="sm" mb={4}>
                      Thông tin tổ chức
                    </Heading>

                    <Stack spacing={4}>
                      <FormControl isInvalid={!!errors.organizationName}>
                        <FormLabel fontSize="sm">Tên tổ chức</FormLabel>
                        <Input
                          placeholder="VD: Công ty Sự kiện XYZ"
                          {...register("organizationName", {
                            required:
                              selectedRole === "organizer"
                                ? "Tên tổ chức là bắt buộc"
                                : false,
                          })}
                        />
                        <FormErrorMessage>
                          {errors.organizationName?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.organizationType}>
                        <FormLabel fontSize="sm">Loại tổ chức</FormLabel>
                        <Select
                          placeholder="Chọn loại tổ chức"
                          {...register("organizationType", {
                            required:
                              selectedRole === "organizer"
                                ? "Loại tổ chức là bắt buộc"
                                : false,
                          })}
                        >
                          <option value="company">Công ty/Doanh nghiệp</option>
                          <option value="association">Hiệp hội/Đoàn thể</option>
                          <option value="school">Trường học/Đại học</option>
                          <option value="individual">Cá nhân</option>
                          <option value="other">Khác</option>
                        </Select>
                        <FormErrorMessage>
                          {errors.organizationType?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.phone}>
                        <FormLabel fontSize="sm">
                          Số điện thoại liên hệ
                        </FormLabel>
                        <Input
                          placeholder="VD: 0901234567"
                          {...register("phone", {
                            required:
                              selectedRole === "organizer"
                                ? "Số điện thoại là bắt buộc"
                                : false,
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          })}
                        />
                        <FormErrorMessage>
                          {errors.phone?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.description}>
                        <FormLabel fontSize="sm">Mô tả tổ chức</FormLabel>
                        <Textarea
                          placeholder="Mô tả ngắn về tổ chức của bạn và các loại sự kiện bạn muốn tổ chức..."
                          rows={3}
                          {...register("description")}
                        />
                        <FormErrorMessage>
                          {errors.description?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </Box>
                </Collapse>

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

        {/* Image Section */}
        <Box
          display={{ base: "none", lg: "block" }}
          width={{ base: "100%", lg: "35%" }}
          position="relative"
          bg="teal.400"
          borderRadius="xl"
          overflow="hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
            alt="Event organizing"
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
            bgGradient="linear(to-b, rgba(0,128,128,0.7), rgba(0,128,128,0.9))"
          />
          <Center
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            p={8}
          >
            <Stack spacing={8} color="white" textAlign="center">
              <Heading size="xl">
                {selectedRole === "user"
                  ? "Tham gia hàng nghìn sự kiện thú vị"
                  : "Bắt đầu tổ chức sự kiện của riêng bạn"}
              </Heading>
              <Text fontSize="lg">
                {selectedRole === "user"
                  ? "Tạo tài khoản để đăng ký tham gia các sự kiện từ hội thảo đến lễ hội âm nhạc."
                  : "Dễ dàng tạo, quản lý và thu hút người tham dự cho các sự kiện của bạn."}
              </Text>
              {selectedRole === "organizer" && (
                <Box borderRadius="md" p={4} bg="white" color="teal.500">
                  <Heading size="md" mb={2}>
                    Lợi ích cho nhà tổ chức:
                  </Heading>
                  <Stack spacing={2} fontSize="sm" textAlign="left">
                    <Flex align="center">
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="teal.500"
                        mr={2}
                      />
                      <Text>Quản lý danh sách tham dự và check-in</Text>
                    </Flex>
                    <Flex align="center">
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="teal.500"
                        mr={2}
                      />
                      <Text>Phân tích thống kê chi tiết về sự kiện</Text>
                    </Flex>
                    <Flex align="center">
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="teal.500"
                        mr={2}
                      />
                      <Text>Công cụ tiếp thị và quảng bá sự kiện</Text>
                    </Flex>
                    <Flex align="center">
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="teal.500"
                        mr={2}
                      />
                      <Text>Hỗ trợ thanh toán và bán vé trực tuyến</Text>
                    </Flex>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Center>
        </Box>
      </Flex>
    </Container>
  );
};

export default Register;
