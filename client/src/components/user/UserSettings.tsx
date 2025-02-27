import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Switch,
  HStack,
  Select,
  RadioGroup,
  Radio,
  Stack,
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

/**
 * Component hiển thị các cài đặt tài khoản người dùng
 */
const UserSettings = () => {
  // State để theo dõi form thay đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho các cài đặt thông báo
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // State cho cài đặt riêng tư
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showAttendedEvents, setShowAttendedEvents] = useState(true);

  // Toast notifications
  const toast = useToast();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Xử lý submit form đổi mật khẩu
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Trong thực tế sẽ gọi API để đổi mật khẩu
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
  };

  // Xử lý lưu cài đặt thông báo
  const handleSaveNotificationSettings = () => {
    // Trong thực tế sẽ gọi API để lưu cài đặt
    toast({
      title: "Thành công",
      description: "Cài đặt thông báo đã được lưu",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý lưu cài đặt riêng tư
  const handleSavePrivacySettings = () => {
    // Trong thực tế sẽ gọi API để lưu cài đặt
    toast({
      title: "Thành công",
      description: "Cài đặt quyền riêng tư đã được lưu",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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

                <Button colorScheme="teal" type="submit" alignSelf="flex-end">
                  Thay đổi mật khẩu
                </Button>
              </VStack>
            </form>
          </AccordionPanel>
        </AccordionItem>

        {/* Phần cài đặt thông báo */}
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
                  Thông báo
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
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="email-notifications" mb="0">
                  Thông báo qua email
                </FormLabel>
                <Switch
                  id="email-notifications"
                  colorScheme="teal"
                  isChecked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="sms-notifications" mb="0">
                  Thông báo qua SMS
                </FormLabel>
                <Switch
                  id="sms-notifications"
                  colorScheme="teal"
                  isChecked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="push-notifications" mb="0">
                  Thông báo đẩy
                </FormLabel>
                <Switch
                  id="push-notifications"
                  colorScheme="teal"
                  isChecked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tần suất gửi thông báo</FormLabel>
                <Select defaultValue="daily">
                  <option value="realtime">Thời gian thực</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                </Select>
              </FormControl>

              <Button
                colorScheme="teal"
                alignSelf="flex-end"
                onClick={handleSaveNotificationSettings}
              >
                Lưu cài đặt
              </Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Phần cài đặt quyền riêng tư */}
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
                  Quyền riêng tư
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
              <FormControl>
                <FormLabel>Quyền xem trang cá nhân</FormLabel>
                <RadioGroup
                  value={profileVisibility}
                  onChange={setProfileVisibility}
                >
                  <Stack direction="column" spacing={2}>
                    <Radio value="public">Công khai</Radio>
                    <Radio value="friends">Chỉ bạn bè</Radio>
                    <Radio value="private">Riêng tư</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-attended-events" mb="0">
                  Hiển thị sự kiện đã tham gia
                </FormLabel>
                <Switch
                  id="show-attended-events"
                  colorScheme="teal"
                  isChecked={showAttendedEvents}
                  onChange={(e) => setShowAttendedEvents(e.target.checked)}
                />
              </FormControl>

              <Button
                colorScheme="teal"
                alignSelf="flex-end"
                onClick={handleSavePrivacySettings}
              >
                Lưu cài đặt
              </Button>
            </VStack>
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
