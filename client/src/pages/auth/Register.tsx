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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
}

const Register = () => {
  const toast = useToast();
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

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Simulate successful registration - will call API when backend is ready
      console.log("Register data:", data);
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Registration failed!",
        description: "An error occurred during registration.",
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
            Create Account
          </Heading>
          <Text textAlign="center" color="gray.600">
            Create an account to experience all features of EventHub
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="Your full name"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

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

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>I want to</FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio value="user">Attend events</Radio>
                        <Radio value="organizer">Organize events</Radio>
                      </Stack>
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
                mt={2}
              >
                Register
              </Button>
            </Stack>
          </form>

          <Text textAlign="center">
            Already have an account?{" "}
            <ChakraLink
              as={Link}
              to="/login"
              color="teal.500"
              sx={{ textDecoration: "none" }}
            >
              Login
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default Register;
