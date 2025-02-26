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
      // Gi? l?p dang nh?p th�nh c�ng - khi c� backend th� g?i API ? d�y
      console.log('Login data:', data);
      toast({
        title: '�ang nh?p th�nh c�ng!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '�ang nh?p th?t b?i!',
        description: 'Vui l�ng ki?m tra l?i email v� m?t kh?u.',
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
            �ang nh?p
          </Heading>
          <Text textAlign="center" color="gray.600">
            Ch�o m?ng b?n tr? l?i v?i EventHub
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email', {
                    required: 'Email l� b?t bu?c',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email kh�ng h?p l?',
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
                    required: 'M?t kh?u l� b?t bu?c',
                    minLength: {
                      value: 6,
                      message: 'M?t kh?u ph?i c� �t nh?t 6 k� t?',
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
                �ang nh?p
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Chua c� t�i kho?n?{' '}
            <ChakraLink as={Link} to="/register" color="teal.500">
              �ang k� ngay
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};
export default Login;
