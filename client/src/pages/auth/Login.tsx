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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Simulate successful login - will call API when backend is ready
      console.log("Login data:", data);
      toast({
        title: "Login successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Login failed!",
        description: "Please check your email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <Stack spacing={6}>
          <Heading textAlign="center" size="xl">
            Login
          </Heading>
          <Text textAlign="center" color="gray.600">
            Welcome back to EventHub
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
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
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </Stack>
          </form>

          <Text textAlign="center">
            Don't have an account?{" "}
            <ChakraLink
              as={Link}
              to="/register"
              color="teal.500"
              sx={{ textDecoration: "none" }}
            >
              Register now
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
