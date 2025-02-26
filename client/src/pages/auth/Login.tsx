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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
      // Gi? l?p dang nh?p thành công - khi có backend thì g?i API ? dây
      console.log('Login data:', data);
      toast({
        title: 'Ðang nh?p thành công!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ðang nh?p th?t b?i!',
        description: 'Vui lòng ki?m tra l?i email và m?t kh?u.',
        status: 'error',
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
            Ðang nh?p
          </Heading>
          <Text textAlign="center" color="gray.600">
            Chào m?ng b?n tr? l?i v?i EventHub
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email', {
                    required: 'Email là b?t bu?c',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không h?p l?',
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>M?t kh?u</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register('password', {
                    required: 'M?t kh?u là b?t bu?c',
                    minLength: {
                      value: 6,
                      message: 'M?t kh?u ph?i có ít nh?t 6 ký t?',
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
                Ðang nh?p
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Chua có tài kho?n?{' '}
            <ChakraLink as={Link} to="/register" color="teal.500">
              Ðang ký ngay
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};
export default Login;
