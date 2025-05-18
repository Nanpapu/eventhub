import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import authService from "../../services/auth.service";
import { AxiosError } from "axios";

/**
 * Component hiển thị các cài đặt tài khoản người dùng
 */
const UserSettings = () => {
  // State để theo dõi form thay đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Toast notifications
  const toast = useToast();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Xử lý submit form đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!currentPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu hiện tại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu mới",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast({
        title: "Lỗi",
        description:
          "Mật khẩu không đủ mạnh. Vui lòng tuân thủ các yêu cầu về mật khẩu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // Gọi API để đổi mật khẩu
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau."
      );
      toast({
        title: "Lỗi",
        description:
          axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi thay đổi mật khẩu",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Accordion allowToggle defaultIndex={[0]} borderColor={borderColor}>
        {/* Phần đổi mật khẩu */}
        <AccordionItem border="none" mb={4}>
          <h2>
            <AccordionButton
              bg={bgColor}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
            >
              <Box flex="1" textAlign="left">
                <Heading as="h3" size="md">
                  Thay đổi mật khẩu
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            borderTop="none"
            borderTopRadius="0"
            mt="-1px"
          >
            <form onSubmit={handleChangePassword}>
              <VStack spacing={4} align="stretch">
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormControl isRequired>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <FormHelperText>
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                    thường và số.
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </FormControl>

                <Button
                  colorScheme="teal"
                  type="submit"
                  alignSelf="flex-end"
                  isLoading={isLoading}
                  loadingText="Đang xử lý"
                >
                  Thay đổi mật khẩu
                </Button>
              </VStack>
            </form>
          </AccordionPanel>
        </AccordionItem>

        {/* Phần xóa tài khoản */}
        <AccordionItem border="none">
          <h2>
            <AccordionButton
              bg={bgColor}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
            >
              <Box flex="1" textAlign="left">
                <Heading as="h3" size="md" color="red.500">
                  Xóa tài khoản
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            borderTop="none"
            borderTopRadius="0"
            mt="-1px"
          >
            <VStack spacing={4} align="stretch">
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Cảnh báo!</AlertTitle>
                  <AlertDescription>
                    Xóa tài khoản là hành động không thể khôi phục. Tất cả dữ
                    liệu của bạn sẽ bị xóa vĩnh viễn.
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isRequired>
                <FormLabel>Nhập mật khẩu để xác nhận</FormLabel>
                <Input type="password" placeholder="Nhập mật khẩu của bạn" />
              </FormControl>

              <Button colorScheme="red">Xóa tài khoản vĩnh viễn</Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default UserSettings;
