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
  FormErrorMessage,
  useToast,
  Image,
  Center,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import authService from "../../services/auth.service";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const formBg = useColorModeValue("white", "gray.700");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setPreviewURL(null); // Reset preview URL
    try {
      const response = await authService.forgotPassword(data);

      // Kiểm tra xem có URL xem trước không (cho môi trường phát triển)
      if (response.previewURL) {
        setPreviewURL(response.previewURL);
      }

      toast({
        title: t("auth.forgotPassword.resetLinkSent"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: t("auth.forgotPassword.resetLinkFailed"),
        description: error.response?.data?.message || t("common.unknownError"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 24 }} px={{ base: 0, sm: 8 }}>
      <Stack spacing={8}>
        <Stack spacing={6}>
          <Center>
            <Image src="/logo.svg" alt="EventHub Logo" w="64px" h="64px" />
          </Center>
          <Stack spacing={3} textAlign="center">
            <Heading fontSize="2xl" fontWeight="bold">
              {t("auth.forgotPassword.title")}
            </Heading>
            <Text color="gray.500">{t("auth.forgotPassword.instruction")}</Text>
          </Stack>
        </Stack>

        {previewURL && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mb={1}>Email preview available</AlertTitle>
              <AlertDescription display="block">
                <Text>
                  This is a development feature. In production, the email would
                  be sent to your inbox.
                </Text>
                <ChakraLink
                  href={previewURL}
                  isExternal
                  color="teal.500"
                  textDecoration="underline"
                >
                  Click here to view the reset password email
                </ChakraLink>
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={() => setPreviewURL(null)}
            />
          </Alert>
        )}

        <Box
          py={{ base: 0, sm: 8 }}
          px={{ base: 4, sm: 10 }}
          bg={{ base: "transparent", sm: formBg }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "lg" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="medium">Email</FormLabel>
                <Input
                  type="email"
                  placeholder={t("auth.forgotPassword.emailPlaceholder")}
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

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
              >
                {t("common.submit")}
              </Button>

              <Button
                as={Link}
                to="/auth/login"
                variant="link"
                colorScheme="teal"
                size="sm"
                leftIcon={<FaArrowLeft />}
              >
                {t("common.back")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default ForgotPassword;
