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
        title: "Registration successful!",
        description: "Your account has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast({
        title: "Registration failed!",
        description: "An error occurred during registration.",
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
            Back to Home
          </Button>

          <Heading textAlign="center" size="xl">
            Create Account
          </Heading>

          <Text textAlign="center" color="gray.500" fontSize="md">
            Create an account to experience all features of EventHub
          </Text>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel fontWeight="medium">Full Name</FormLabel>
                <Input
                  placeholder="Your full name"
                  size="lg"
                  focusBorderColor="teal.400"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="medium">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  size="lg"
                  focusBorderColor="teal.400"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    size="lg"
                    focusBorderColor="teal.400"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
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
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    size="lg"
                    focusBorderColor="teal.400"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
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
                <FormLabel fontWeight="medium">I want to</FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <HStack spacing={6}>
                        <Radio value="user" colorScheme="teal">
                          Attend events
                        </Radio>
                        <Radio value="organizer" colorScheme="teal">
                          Organize events
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
                Create Account
              </Button>
            </Stack>
          </form>

          <Flex justify="center" align="center">
            <Text>
              Already have an account?{" "}
              <ChakraLink
                as={Link}
                to="/login"
                color="teal.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                Login
              </ChakraLink>
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Container>
  );
};

export default Register;
