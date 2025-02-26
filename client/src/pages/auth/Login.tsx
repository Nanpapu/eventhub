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
        title: "Login successful!",
        description: "Welcome back to EventHub!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast({
        title: "Login failed!",
        description: "Please check your email and password.",
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
            Welcome Back
          </Heading>

          <Text textAlign="center" color="gray.500" fontSize="md">
            Log in to continue your journey with EventHub
          </Text>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
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

              <Flex justify="space-between" align="center">
                <Checkbox colorScheme="teal" {...register("rememberMe")}>
                  Remember me
                </Checkbox>
                <ChakraLink
                  color="teal.500"
                  fontSize="sm"
                  fontWeight="medium"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot password?
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
                Sign In
              </Button>
            </Stack>
          </form>

          <Flex justify="center" align="center">
            <Text>
              Don't have an account?{" "}
              <ChakraLink
                as={Link}
                to="/register"
                color="teal.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                Register now
              </ChakraLink>
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
