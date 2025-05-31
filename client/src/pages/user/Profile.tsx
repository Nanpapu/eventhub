import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Avatar,
  IconButton,
  VStack,
  useColorModeValue,
  useToast,
  Switch,
  Flex,
  HStack,
  Tooltip,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaBell,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import authService from "../../services/auth.service";
import { getDefaultAvatar } from "../../utils/userUtils";

// Interface cho lỗi API
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Interface cho thông tin cá nhân
interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

// Interface cho đổi mật khẩu
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface cho cài đặt (đã đơn giản hóa)
interface PreferencesFormData {
  // Thông báo
  emailNotifications: boolean;
  eventReminders: boolean;

  // Ngôn ngữ và định dạng
  language: string;
  dateFormat: string;
}

const Profile = () => {
  const toast = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Thêm trạng thái mode cho từng tab
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [preferencesEditMode, setPreferencesEditMode] = useState(false);

  // Form cho thông tin cá nhân
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfileForm,
  } = useForm<ProfileFormData>();

  // Form cho đổi mật khẩu
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>();

  // Form cho tùy chọn
  const {
    register: registerPreferences,
    handleSubmit: handleSubmitPreferences,
    formState: { isSubmitting: isPreferencesSubmitting },
    reset: resetPreferencesForm,
  } = useForm<PreferencesFormData>();

  // Theo dõi mật khẩu mới để xác thực confirm password
  const newPassword = watchPassword("newPassword");

  // Chức năng toggle hiển thị/ẩn mật khẩu
  const toggleCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Giả lập dữ liệu tùy chọn người dùng
  const mockPreferencesData = {
    // Thông báo
    emailNotifications: true,
    eventReminders: true,

    // Ngôn ngữ và định dạng
    language: "en",
    dateFormat: "DD/MM/YYYY",
  };

  // Lấy thông tin người dùng từ API khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin người dùng từ API
        const userData = await authService.getCurrentUser();

        if (!userData) {
          setError("Không thể tải thông tin người dùng");
          return;
        }

        // Cập nhật form với dữ liệu người dùng
        resetProfileForm({
          fullName: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
        });

        // Cập nhật avatar
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }

        // Cập nhật form cài đặt (vẫn giữ dữ liệu mẫu cho phần này)
        resetPreferencesForm(mockPreferencesData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [resetProfileForm, resetPreferencesForm]);

  // Xử lý upload ảnh đại diện
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);

        // Trong thực tế, đây sẽ là API call để upload ảnh
        // Ví dụ:
        // const formData = new FormData();
        // formData.append('avatar', file);
        // const response = await api.post('/upload/avatar', formData);
        // Sau đó cập nhật thông tin người dùng với URL avatar mới
        // await authService.updateProfile({ avatar: response.data.url });

        // Tạm thời chỉ hiển thị avatar mới
        toast({
          title: "Ảnh đại diện đã cập nhật",
          description: "Ảnh đại diện của bạn đã được cập nhật thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi nhấp vào avatar để mở hộp thoại chọn file
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý cập nhật thông tin cá nhân
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // Gọi API cập nhật thông tin người dùng
      await authService.updateProfile({
        name: data.fullName,
        bio: data.bio,
        // Các thông tin khác như location và phone cần thêm vào backend
      });

      // Hiển thị thông báo thành công
      toast({
        title: "Cập nhật hồ sơ",
        description: "Thông tin hồ sơ của bạn đã được cập nhật thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Tắt chế độ chỉnh sửa
      setProfileEditMode(false);
    } catch (error: unknown) {
      // Xử lý lỗi
      console.error("Error updating profile:", error);
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError?.response?.data?.message ||
        "Đã xảy ra lỗi khi cập nhật hồ sơ của bạn";

      toast({
        title: "Cập nhật thất bại",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý đổi mật khẩu
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Gọi API đổi mật khẩu
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Hiển thị thông báo thành công
      toast({
        title: "Đổi mật khẩu",
        description: "Mật khẩu của bạn đã được thay đổi thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      resetPasswordForm();
    } catch (error: unknown) {
      // Xử lý lỗi
      console.error("Error updating password:", error);
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError?.response?.data?.message ||
        "Đã xảy ra lỗi khi thay đổi mật khẩu của bạn";

      toast({
        title: "Đổi mật khẩu thất bại",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý cập nhật tùy chọn
  const onPreferencesSubmit = async (data: PreferencesFormData) => {
    try {
      // Giả lập cập nhật tùy chọn (sẽ thay thế bằng API call)
      console.log("Preferences data to update:", data);

      // Hiển thị thông báo thành công
      toast({
        title: "Cập nhật tùy chọn",
        description: "Tùy chọn của bạn đã được cập nhật thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Tắt chế độ chỉnh sửa
      setPreferencesEditMode(false);
    } catch (err) {
      // Xử lý lỗi
      console.error("Error updating preferences:", err);
      toast({
        title: "Cập nhật thất bại",
        description: "Đã xảy ra lỗi khi cập nhật tùy chọn của bạn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hủy chỉnh sửa profile
  const handleCancelProfileEdit = () => {
    const fetchAndResetUserProfile = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          resetProfileForm({
            fullName: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            location: userData.location || "",
            bio: userData.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAndResetUserProfile();
    setProfileEditMode(false);
  };

  // Hủy chỉnh sửa tùy chọn
  const handleCancelPreferencesEdit = () => {
    resetPreferencesForm(mockPreferencesData);
    setPreferencesEditMode(false);
  };

  // Lấy thông tin người dùng hiện tại
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const user = getCurrentUser();

  // Màu sắc dựa trên chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");
  const highlightColor = useColorModeValue("gray.100", "gray.700");

  if (loading) {
    return (
      <Container maxW="4xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="4xl" py={8}>
        <Flex direction="column" justify="center" align="center" minH="60vh">
          <Heading size="lg" mb={4} color="red.500">
            {error}
          </Heading>
          <Button colorScheme="teal" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={8}>
        {/* Phần Avatar và thông tin ngắn gọn */}
        <GridItem>
          <Box bg={bgColor} p={6} borderRadius="xl" boxShadow={boxShadow}>
            <VStack spacing={4}>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  src={avatarPreview || getDefaultAvatar(user?.name)}
                  name={user?.name || "User"}
                  cursor="pointer"
                  onClick={handleAvatarClick}
                />
                <Tooltip label="Đổi ảnh đại diện" placement="top">
                  <IconButton
                    aria-label="Đổi ảnh đại diện"
                    icon={<FaCamera />}
                    size="sm"
                    colorScheme="teal"
                    borderRadius="full"
                    position="absolute"
                    bottom="0"
                    right="0"
                    onClick={handleAvatarClick}
                  />
                </Tooltip>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </Box>
              <Heading size="md">{user?.name || "User"}</Heading>
              <Text color="gray.500">{user?.email || ""}</Text>
              <Divider />
              <VStack align="start" spacing={2} w="full">
                <Text fontWeight="bold">Vai trò</Text>
                <Text>
                  {user?.role === "organizer"
                    ? "Nhà tổ chức"
                    : user?.role === "admin"
                    ? "Quản trị viên"
                    : "Người dùng"}
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        {/* Tabs cho thông tin cá nhân, đổi mật khẩu và cài đặt */}
        <GridItem>
          <Box bg={bgColor} p={6} borderRadius="xl" boxShadow={boxShadow}>
            <Tabs colorScheme="teal" isFitted>
              <TabList mb={4}>
                <Tab fontWeight="medium">Thông tin cá nhân</Tab>
                <Tab fontWeight="medium">Đổi mật khẩu</Tab>
                <Tab fontWeight="medium">Tùy chọn</Tab>
              </TabList>

              <TabPanels>
                {/* Tab thông tin cá nhân */}
                <TabPanel>
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">Thông tin cá nhân</Heading>
                      {!profileEditMode ? (
                        <Tooltip label="Chỉnh sửa thông tin">
                          <Button
                            leftIcon={<FaEdit />}
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => setProfileEditMode(true)}
                          >
                            Chỉnh sửa
                          </Button>
                        </Tooltip>
                      ) : (
                        <HStack>
                          <Button
                            leftIcon={<FaTimes />}
                            colorScheme="gray"
                            variant="outline"
                            onClick={handleCancelProfileEdit}
                          >
                            Hủy
                          </Button>
                          <Button
                            leftIcon={<FaSave />}
                            colorScheme="teal"
                            form="profile-form"
                            type="submit"
                            isLoading={isProfileSubmitting}
                          >
                            Lưu thay đổi
                          </Button>
                        </HStack>
                      )}
                    </Flex>

                    <form
                      id="profile-form"
                      onSubmit={handleSubmitProfile(onProfileSubmit)}
                    >
                      <VStack spacing={4} align="start">
                        <FormControl isInvalid={!!profileErrors.fullName}>
                          <FormLabel fontWeight="medium">Họ và tên</FormLabel>
                          {profileEditMode ? (
                            <Input
                              {...registerProfile("fullName", {
                                required: "Họ và tên là bắt buộc",
                              })}
                              size="md"
                              focusBorderColor="teal.400"
                            />
                          ) : (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={highlightColor}
                              w="full"
                            >
                              {user?.name || ""}
                            </Box>
                          )}
                          <FormErrorMessage>
                            {profileErrors.fullName?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!profileErrors.email}>
                          <FormLabel fontWeight="medium">Email</FormLabel>
                          {profileEditMode ? (
                            <Input
                              {...registerProfile("email", {
                                required: "Email là bắt buộc",
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Địa chỉ email không hợp lệ",
                                },
                              })}
                              type="email"
                              size="md"
                              focusBorderColor="teal.400"
                              readOnly={true}
                              disabled={true}
                            />
                          ) : (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={highlightColor}
                              w="full"
                            >
                              {user?.email || ""}
                            </Box>
                          )}
                          <FormErrorMessage>
                            {profileErrors.email?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!profileErrors.phone}>
                          <FormLabel fontWeight="medium">
                            Số điện thoại
                          </FormLabel>
                          {profileEditMode ? (
                            <Input
                              {...registerProfile("phone")}
                              size="md"
                              focusBorderColor="teal.400"
                              placeholder="Nhập số điện thoại của bạn"
                            />
                          ) : (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={highlightColor}
                              w="full"
                            >
                              {user?.phone || "Chưa cập nhật"}
                            </Box>
                          )}
                          <FormErrorMessage>
                            {profileErrors.phone?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!profileErrors.location}>
                          <FormLabel fontWeight="medium">Địa điểm</FormLabel>
                          {profileEditMode ? (
                            <Input
                              {...registerProfile("location")}
                              size="md"
                              focusBorderColor="teal.400"
                              placeholder="Thành phố, Quốc gia"
                            />
                          ) : (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={highlightColor}
                              w="full"
                            >
                              {user?.location || "Chưa cập nhật"}
                            </Box>
                          )}
                          <FormErrorMessage>
                            {profileErrors.location?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!profileErrors.bio}>
                          <FormLabel fontWeight="medium">Giới thiệu</FormLabel>
                          {profileEditMode ? (
                            <Input
                              {...registerProfile("bio")}
                              as="textarea"
                              size="md"
                              focusBorderColor="teal.400"
                              rows={4}
                              placeholder="Mô tả ngắn về bản thân"
                            />
                          ) : (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={highlightColor}
                              w="full"
                              minH="100px"
                            >
                              {user?.bio || "Chưa cập nhật"}
                            </Box>
                          )}
                          <FormErrorMessage>
                            {profileErrors.bio?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </VStack>
                    </form>
                  </Box>
                </TabPanel>

                {/* Tab đổi mật khẩu - giữ nguyên vì đã sử dụng API */}
                <TabPanel>
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
                    <VStack spacing={4} align="start">
                      <Heading size="md" mb={2}>
                        Đổi mật khẩu
                      </Heading>

                      <FormControl isInvalid={!!passwordErrors.currentPassword}>
                        <FormLabel fontWeight="medium">
                          Mật khẩu hiện tại
                        </FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("currentPassword", {
                              required: "Mật khẩu hiện tại là bắt buộc",
                            })}
                            type={showCurrentPassword ? "text" : "password"}
                            size="md"
                            focusBorderColor="teal.400"
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={
                                showCurrentPassword
                                  ? "Ẩn mật khẩu"
                                  : "Hiện mật khẩu"
                              }
                              icon={
                                showCurrentPassword ? <FaEyeSlash /> : <FaEye />
                              }
                              variant="ghost"
                              onClick={toggleCurrentPassword}
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {passwordErrors.currentPassword?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!passwordErrors.newPassword}>
                        <FormLabel fontWeight="medium">Mật khẩu mới</FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("newPassword", {
                              required: "Mật khẩu mới là bắt buộc",
                              minLength: {
                                value: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự",
                              },
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message:
                                  "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số",
                              },
                            })}
                            type={showNewPassword ? "text" : "password"}
                            size="md"
                            focusBorderColor="teal.400"
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={
                                showNewPassword
                                  ? "Ẩn mật khẩu"
                                  : "Hiện mật khẩu"
                              }
                              icon={
                                showNewPassword ? <FaEyeSlash /> : <FaEye />
                              }
                              variant="ghost"
                              onClick={toggleNewPassword}
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {passwordErrors.newPassword?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!passwordErrors.confirmPassword}>
                        <FormLabel fontWeight="medium">
                          Xác nhận mật khẩu mới
                        </FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("confirmPassword", {
                              required: "Vui lòng xác nhận mật khẩu của bạn",
                              validate: (value) =>
                                value === newPassword || "Mật khẩu không khớp",
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            size="md"
                            focusBorderColor="teal.400"
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={
                                showConfirmPassword
                                  ? "Ẩn mật khẩu"
                                  : "Hiện mật khẩu"
                              }
                              icon={
                                showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                              }
                              variant="ghost"
                              onClick={toggleConfirmPassword}
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {passwordErrors.confirmPassword?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isPasswordSubmitting}
                        type="submit"
                      >
                        Cập nhật mật khẩu
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                {/* Tab tùy chọn (đơn giản hóa từ Settings) - giữ nguyên vì vẫn dùng dữ liệu mẫu */}
                <TabPanel>
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">Tùy chọn thông báo</Heading>
                      {!preferencesEditMode ? (
                        <Tooltip label="Chỉnh sửa tùy chọn">
                          <Button
                            leftIcon={<FaEdit />}
                            colorScheme="teal"
                            variant="outline"
                            onClick={() => setPreferencesEditMode(true)}
                          >
                            Chỉnh sửa
                          </Button>
                        </Tooltip>
                      ) : (
                        <HStack>
                          <Button
                            leftIcon={<FaTimes />}
                            colorScheme="gray"
                            variant="outline"
                            onClick={handleCancelPreferencesEdit}
                          >
                            Hủy
                          </Button>
                          <Button
                            leftIcon={<FaSave />}
                            colorScheme="teal"
                            form="preferences-form"
                            type="submit"
                            isLoading={isPreferencesSubmitting}
                          >
                            Lưu thay đổi
                          </Button>
                        </HStack>
                      )}
                    </Flex>

                    <form
                      id="preferences-form"
                      onSubmit={handleSubmitPreferences(onPreferencesSubmit)}
                    >
                      <VStack spacing={6} align="start">
                        {/* Phần tùy chọn thông báo */}
                        <Box w="full">
                          <Flex align="center" mb={4}>
                            <Box
                              bg="blue.50"
                              p={2}
                              borderRadius="md"
                              color="blue.600"
                              mr={2}
                            >
                              <FaBell size={20} />
                            </Box>
                            <Heading size="md">Thông báo</Heading>
                          </Flex>

                          <VStack spacing={4} align="start" pl={10}>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="email-notifications" mb="0">
                                Thông báo qua email
                              </FormLabel>
                              {preferencesEditMode ? (
                                <Switch
                                  id="email-notifications"
                                  colorScheme="blue"
                                  {...registerPreferences("emailNotifications")}
                                />
                              ) : (
                                <Badge
                                  colorScheme={
                                    mockPreferencesData.emailNotifications
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {mockPreferencesData.emailNotifications
                                    ? "Bật"
                                    : "Tắt"}
                                </Badge>
                              )}
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="event-reminders" mb="0">
                                Nhắc nhở sự kiện
                              </FormLabel>
                              {preferencesEditMode ? (
                                <Switch
                                  id="event-reminders"
                                  colorScheme="blue"
                                  {...registerPreferences("eventReminders")}
                                />
                              ) : (
                                <Badge
                                  colorScheme={
                                    mockPreferencesData.eventReminders
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {mockPreferencesData.eventReminders
                                    ? "Bật"
                                    : "Tắt"}
                                </Badge>
                              )}
                            </FormControl>

                            <Text fontSize="sm" color="gray.500" mt={2}>
                              Nhắc nhở sự kiện sẽ được gửi 24 giờ trước khi sự
                              kiện diễn ra.
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    </form>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Profile;
