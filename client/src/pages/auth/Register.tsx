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
      // Gi? l?p dang k� th�nh c�ng - khi c� backend th� g?i API ? d�y
      console.log('Register data:', data);
      toast({
        title: '�ang k� th�nh c�ng!',
        description: 'B?n d� dang k� t�i kho?n th�nh c�ng.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '�ang k� th?t b?i!',
        description: 'C� l?i x?y ra trong qu� tr�nh dang k�.',
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
            �ang k� t�i kho?n
          </Heading>
          <Text textAlign="center" color="gray.600">
            T?o t�i kho?n d? tr?i nghi?m t?t c? t�nh nang c?a EventHub
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>H? v� t�n</FormLabel>
                <Input
                  placeholder="H? v� t�n c?a b?n"
                  {...register('fullName', {
                    required: 'H? v� t�n l� b?t bu?c',
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
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>X�c nh?n m?t kh?u</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register('confirmPassword', {
                    required: 'Vui l�ng x�c nh?n m?t kh?u',
                    validate: (value) =>
                      value === password || 'M?t kh?u x�c nh?n kh�ng kh?p',
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
                �ang k�
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            �� c� t�i kho?n?{' '}
            <ChakraLink as={Link} to="/login" color="teal.500">
              �ang nh?p
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};
export default Register;
