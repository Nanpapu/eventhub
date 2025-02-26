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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'organizer';
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
      role: 'user',
    },
  });
  const password = watch('password');
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Gi? l?p dang ký thành công - khi có backend thì g?i API ? dây
      console.log('Register data:', data);
      toast({
        title: 'Ðang ký thành công!',
        description: 'B?n dã dang ký tài kho?n thành công.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ðang ký th?t b?i!',
        description: 'Có l?i x?y ra trong quá trình dang ký.',
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
            Ðang ký tài kho?n
          </Heading>
          <Text textAlign="center" color="gray.600">
            T?o tài kho?n d? tr?i nghi?m t?t c? tính nang c?a EventHub
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>H? và tên</FormLabel>
                <Input
                  placeholder="H? và tên c?a b?n"
                  {...register('fullName', {
                    required: 'H? và tên là b?t bu?c',
                  })}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>
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
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Xác nh?n m?t kh?u</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nh?n m?t kh?u',
                    validate: (value) =>
                      value === password || 'M?t kh?u xác nh?n không kh?p',
                  })}
                />
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>B?n mu?n</FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row">
                        <Radio value="user">Tham gia s? ki?n</Radio>
                        <Radio value="organizer">T? ch?c s? ki?n</Radio>
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
                Ðang ký
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Ðã có tài kho?n?{' '}
            <ChakraLink as={Link} to="/login" color="teal.500">
              Ðang nh?p
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};
export default Register;
