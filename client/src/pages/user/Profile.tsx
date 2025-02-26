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
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaCamera, FaGlobe, FaBell } from "react-icons/fa";

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

  // Giả lập dữ liệu người dùng (sẽ được thay thế bằng API call)
  const mockUserData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    bio: "Software developer with 5 years of experience in web development.",
    avatar: "https://bit.ly/3Q3eQvj",
  };

  // Giả lập dữ liệu tùy chọn người dùng
  const mockPreferencesData = {
    // Thông báo
    emailNotifications: true,
    eventReminders: true,

    // Ngôn ngữ và định dạng
    language: "en",
    dateFormat: "DD/MM/YYYY",
  };

  // Cập nhật form với dữ liệu người dùng khi component được mount
  useEffect(() => {
    // Trong thực tế, đây sẽ là một API call để lấy thông tin người dùng
    resetProfileForm({
      fullName: mockUserData.fullName,
      email: mockUserData.email,
      phone: mockUserData.phone,
      location: mockUserData.location,
      bio: mockUserData.bio,
    });

    // Cập nhật form cài đặt
    resetPreferencesForm(mockPreferencesData);

    setAvatarPreview(mockUserData.avatar);
  }, [
    resetProfileForm,
    resetPreferencesForm,
    mockUserData.fullName,
    mockUserData.email,
    mockUserData.phone,
    mockUserData.location,
    mockUserData.bio,
    mockUserData.avatar,
  ]);

  // Xử lý upload ảnh đại diện
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Trong thực tế, đây sẽ là nơi để upload ảnh lên server
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý khi nhấp vào avatar để mở hộp thoại chọn file
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý cập nhật thông tin cá nhân
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // Giả lập cập nhật thông tin người dùng (sẽ thay thế bằng API call)
      console.log("Profile data to update:", data);

      // Hiển thị thông báo thành công
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      // Xử lý lỗi
      console.error("Error updating profile:", err);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý đổi mật khẩu
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Giả lập đổi mật khẩu (sẽ thay thế bằng API call)
      console.log("Password data to update:", data);

      // Hiển thị thông báo thành công
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      resetPasswordForm();
    } catch (err) {
      // Xử lý lỗi
      console.error("Error updating password:", err);
      toast({
        title: "Password update failed",
        description: "There was an error changing your password",
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
        title: "Preferences updated",
        description: "Your preferences have been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      // Xử lý lỗi
      console.error("Error updating preferences:", err);
      toast({
        title: "Update failed",
        description: "There was an error updating your preferences",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Màu sắc dựa trên chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");

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
                  src={avatarPreview || undefined}
                  name={mockUserData.fullName}
                  cursor="pointer"
                  onClick={handleAvatarClick}
                />
                <IconButton
                  aria-label="Change profile picture"
                  icon={<FaCamera />}
                  size="sm"
                  colorScheme="teal"
                  borderRadius="full"
                  position="absolute"
                  bottom="0"
                  right="0"
                  onClick={handleAvatarClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </Box>
              <Heading size="md">{mockUserData.fullName}</Heading>
              <Text color="gray.500">{mockUserData.email}</Text>
              <Divider />
              <VStack align="start" spacing={2} w="full">
                <Text fontWeight="bold">Location</Text>
                <Text>{mockUserData.location}</Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        {/* Tabs cho thông tin cá nhân, đổi mật khẩu và cài đặt */}
        <GridItem>
          <Box bg={bgColor} p={6} borderRadius="xl" boxShadow={boxShadow}>
            <Tabs colorScheme="teal" isFitted>
              <TabList mb={4}>
                <Tab fontWeight="medium">Profile Information</Tab>
                <Tab fontWeight="medium">Change Password</Tab>
                <Tab fontWeight="medium">Preferences</Tab>
              </TabList>

              <TabPanels>
                {/* Tab thông tin cá nhân */}
                <TabPanel>
                  <form onSubmit={handleSubmitProfile(onProfileSubmit)}>
                    <VStack spacing={4} align="start">
                      <Heading size="md" mb={2}>
                        Edit Profile
                      </Heading>

                      <FormControl isInvalid={!!profileErrors.fullName}>
                        <FormLabel fontWeight="medium">Full Name</FormLabel>
                        <Input
                          {...registerProfile("fullName", {
                            required: "Full name is required",
                          })}
                          size="md"
                          focusBorderColor="teal.400"
                        />
                        <FormErrorMessage>
                          {profileErrors.fullName?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.email}>
                        <FormLabel fontWeight="medium">Email</FormLabel>
                        <Input
                          {...registerProfile("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          size="md"
                          focusBorderColor="teal.400"
                        />
                        <FormErrorMessage>
                          {profileErrors.email?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.phone}>
                        <FormLabel fontWeight="medium">Phone Number</FormLabel>
                        <Input
                          {...registerProfile("phone")}
                          size="md"
                          focusBorderColor="teal.400"
                        />
                        <FormErrorMessage>
                          {profileErrors.phone?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.location}>
                        <FormLabel fontWeight="medium">Location</FormLabel>
                        <Input
                          {...registerProfile("location")}
                          size="md"
                          focusBorderColor="teal.400"
                          placeholder="City, Country"
                        />
                        <FormErrorMessage>
                          {profileErrors.location?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!profileErrors.bio}>
                        <FormLabel fontWeight="medium">Bio</FormLabel>
                        <Input
                          {...registerProfile("bio")}
                          as="textarea"
                          size="md"
                          focusBorderColor="teal.400"
                          rows={4}
                          placeholder="A short bio about yourself"
                        />
                        <FormErrorMessage>
                          {profileErrors.bio?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isProfileSubmitting}
                        type="submit"
                        alignSelf="flex-end"
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                {/* Tab đổi mật khẩu */}
                <TabPanel>
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
                    <VStack spacing={4} align="start">
                      <Heading size="md" mb={2}>
                        Change Password
                      </Heading>

                      <FormControl isInvalid={!!passwordErrors.currentPassword}>
                        <FormLabel fontWeight="medium">
                          Current Password
                        </FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("currentPassword", {
                              required: "Current password is required",
                            })}
                            type={showCurrentPassword ? "text" : "password"}
                            size="md"
                            focusBorderColor="teal.400"
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={
                                showCurrentPassword
                                  ? "Hide password"
                                  : "Show password"
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
                        <FormLabel fontWeight="medium">New Password</FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("newPassword", {
                              required: "New password is required",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must be at least 8 characters",
                              },
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message:
                                  "Password must contain at least one uppercase letter, one lowercase letter and one number",
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
                                  ? "Hide password"
                                  : "Show password"
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
                          Confirm New Password
                        </FormLabel>
                        <InputGroup>
                          <Input
                            {...registerPassword("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === newPassword ||
                                "Passwords do not match",
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            size="md"
                            focusBorderColor="teal.400"
                          />
                          <InputRightElement h="full">
                            <IconButton
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
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
                        alignSelf="flex-end"
                      >
                        Update Password
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                {/* Tab tùy chọn (đơn giản hóa từ Settings) */}
                <TabPanel>
                  <form onSubmit={handleSubmitPreferences(onPreferencesSubmit)}>
                    <VStack spacing={6} align="start">
                      {/* Phần tùy chọn ngôn ngữ và định dạng */}
                      <Box w="full">
                        <Flex align="center" mb={4}>
                          <Box
                            bg="purple.50"
                            p={2}
                            borderRadius="md"
                            color="purple.600"
                            mr={2}
                          >
                            <FaGlobe size={20} />
                          </Box>
                          <Heading size="md">Language & Format</Heading>
                        </Flex>

                        <VStack spacing={4} align="start" pl={10}>
                          <FormControl>
                            <FormLabel fontWeight="medium">Language</FormLabel>
                            <Select
                              {...registerPreferences("language")}
                              focusBorderColor="purple.400"
                            >
                              <option value="en">English</option>
                              <option value="vi">Tiếng Việt</option>
                              <option value="fr">Français</option>
                              <option value="es">Español</option>
                              <option value="zh">中文</option>
                            </Select>
                          </FormControl>

                          <FormControl>
                            <FormLabel fontWeight="medium">
                              Date Format
                            </FormLabel>
                            <Select
                              {...registerPreferences("dateFormat")}
                              focusBorderColor="purple.400"
                            >
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </Box>

                      <Divider />

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
                          <Heading size="md">Notifications</Heading>
                        </Flex>

                        <VStack spacing={4} align="start" pl={10}>
                          <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="email-notifications" mb="0">
                              Email notifications
                            </FormLabel>
                            <Switch
                              id="email-notifications"
                              colorScheme="blue"
                              {...registerPreferences("emailNotifications")}
                            />
                          </FormControl>

                          <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="event-reminders" mb="0">
                              Event reminders
                            </FormLabel>
                            <Switch
                              id="event-reminders"
                              colorScheme="blue"
                              {...registerPreferences("eventReminders")}
                            />
                          </FormControl>

                          <Text fontSize="sm" color="gray.500" mt={2}>
                            Event reminders will be sent 24 hours before your
                            registered events.
                          </Text>
                        </VStack>
                      </Box>

                      <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isPreferencesSubmitting}
                        type="submit"
                        alignSelf="flex-end"
                      >
                        Save Preferences
                      </Button>
                    </VStack>
                  </form>
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
