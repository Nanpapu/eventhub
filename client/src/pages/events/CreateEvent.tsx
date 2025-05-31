import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormErrorMessage,
  VStack,
  HStack,
  Divider,
  useToast,
  Image,
  Text,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Spinner,
  Badge,
  InputRightElement,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiPlus,
  FiUpload,
  FiSave,
  FiArrowLeft,
  FiTrash2,
  FiInfo,
  FiList,
  FiSettings,
  FiCheckCircle,
  FiHome,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createEvent,
  selectEventLoading,
  selectEventError,
  selectCreateSuccess,
  resetEventState,
  fetchEventForEdit,
  deleteEvent,
} from "../../app/features/eventSlice";
import eventService from "../../services/event.service";
import {
  selectUser,
  selectIsAuthenticated,
} from "../../app/features/authSlice";
import { vietnamProvinces } from "../../utils/locationUtils";
import { categories } from "../../utils/categoryUtils";
import { FaTrash } from "react-icons/fa";

// Interface cho dữ liệu sự kiện
interface EventFormData {
  id?: string; // ID chỉ có khi chỉnh sửa sự kiện
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  capacity: number;
  maxTicketsPerPerson: number; // Số vé tối đa mỗi người được mua
  isPaid: boolean;
  price?: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }[];
  image: string;
  imageFile?: File | null; // Thêm imageFile để xử lý upload
  tags: string[];
}

// Interface cho TicketType từ API
interface ApiTicketType {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  availableQuantity?: number;
}

// Props chung cho các Step components
interface StepProps {
  formData: EventFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: Record<string, string>;
  // Thêm các props khác nếu cần cho từng step
}

// Bước 1: Thông tin cơ bản
const BasicInfoStep: React.FC<StepProps> = ({
  formData,
  handleChange,
  setFormData,
  errors,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Kiểm tra kích thước file
      if (file.size > maxSize) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi",
          description: "Chỉ chấp nhận file hình ảnh (jpg, jpeg, png, gif)",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Hiển thị preview ảnh ngay lập tức
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
        imageFile: file,
      }));

      try {
        setIsUploading(true);

        // Upload ảnh lên Cloudinary
        const response = await eventService.uploadEventImage(file);

        if (response.success) {
          // Cập nhật URL ảnh thật từ Cloudinary
          setFormData((prev) => ({
            ...prev,
            image: response.data.imageUrl,
            imageFile: null, // Không cần lưu file nữa sau khi đã upload
          }));

          toast({
            title: "Thành công",
            description: "Ảnh bìa sự kiện đã được tải lên",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error uploading event image:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải ảnh lên, vui lòng thử lại",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Thêm hàm xử lý xóa ảnh
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "https://via.placeholder.com/800x400?text=Event+Image",
      imageFile: null,
    }));

    toast({
      title: "Đã xóa ảnh",
      description: "Bạn có thể tải lên ảnh mới",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl isInvalid={!!errors.title} isRequired>
        <FormLabel htmlFor="title">Tên sự kiện</FormLabel>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          borderColor={borderColor}
          placeholder="VD: Hội thảo Công nghệ Blockchain 2024"
        />
        {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={!!errors.description} isRequired>
        <FormLabel htmlFor="description">Mô tả sự kiện</FormLabel>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          borderColor={borderColor}
          minH="120px"
          placeholder="Mô tả chi tiết về nội dung, lịch trình, diễn giả của sự kiện..."
        />
        {errors.description && (
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.category} isRequired>
        <FormLabel htmlFor="category">Danh mục</FormLabel>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Chọn danh mục cho sự kiện"
          borderColor={borderColor}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        {errors.category && (
          <FormErrorMessage>{errors.category}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.imageFile}>
        <FormLabel htmlFor="imageFile">Ảnh bìa sự kiện</FormLabel>
        <Box mb={2}>
          <Text fontSize="sm" color="gray.500">
            Kích thước đề xuất: 1200 x 630 pixels (tỷ lệ 16:9). Tối đa 5MB.
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Hãy đảm bảo phần quan trọng của ảnh (logo, văn bản) nằm ở trung tâm
            để tránh bị cắt xén trên các thiết bị khác nhau.
          </Text>
        </Box>

        {/* Hiển thị khung kéo thả CHỈ KHI chưa có ảnh được upload thành công */}
        {(!formData.image || !formData.image.includes("cloudinary")) && (
          <Box
            borderWidth="2px"
            borderRadius="md"
            borderStyle="dashed"
            borderColor={borderColor}
            py={4}
            px={2}
            mb={3}
            position="relative"
            _hover={{ borderColor: "teal.300" }}
            transition="all 0.3s"
            cursor="pointer"
            textAlign="center"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageChange({
                  target: { files: e.dataTransfer.files },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            onClick={() => {
              const fileInput = document.getElementById("imageFile");
              if (fileInput) fileInput.click();
            }}
          >
            <Input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
              isDisabled={isUploading}
            />

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiUpload} w={8} h={8} mb={2} color="teal.500" />
              <Text fontWeight="medium" color={textColor}>
                {formData.imageFile
                  ? formData.imageFile.name
                  : "Kéo thả ảnh vào đây hoặc nhấp để chọn ảnh"}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Hỗ trợ định dạng JPG, PNG hoặc GIF
              </Text>
            </Flex>
          </Box>
        )}

        {isUploading && (
          <Flex align="center" mt={2}>
            <Spinner size="sm" mr={2} color="teal.500" />
            <Text fontSize="sm">Đang tải ảnh lên...</Text>
          </Flex>
        )}

        {formData.image &&
          formData.image !==
            "https://via.placeholder.com/800x400?text=Event+Image" && (
            <Box position="relative" mt={4}>
              {/* Hiển thị badge "Đã tải lên" ở trên hình, phía bên trái */}
              {formData.image.includes("cloudinary") && (
                <Box mb={2}>
                  <Badge colorScheme="green" p={1}>
                    Đã tải lên
                  </Badge>
                </Box>
              )}

              <Image
                src={formData.image}
                alt="Xem trước ảnh bìa"
                maxH="250px"
                borderRadius="md"
                objectFit="cover"
                borderWidth="1px"
                borderColor={borderColor}
              />

              {/* Nút xóa ở dưới hình, phía bên trái */}
              <Box mt={2} textAlign="left">
                <IconButton
                  aria-label="Xóa ảnh"
                  icon={<FaTrash />}
                  size="sm"
                  bg="red.500"
                  color="white"
                  onClick={handleRemoveImage}
                  _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                  boxShadow="md"
                />
              </Box>
            </Box>
          )}
        <FormHelperText>
          Chọn ảnh đại diện cho sự kiện của bạn. Nên sử dụng ảnh ngang, tỷ lệ
          16:9 để hiển thị tốt nhất.
        </FormHelperText>
        {errors.imageFile && (
          <FormErrorMessage>{errors.imageFile}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

// Bước 2: Thời gian & Địa điểm
const DateTimeLocationStep: React.FC<StepProps> = ({
  formData,
  handleChange,
  errors,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <VStack spacing={6} align="stretch">
      <FormControl isInvalid={!!errors.date} isRequired>
        <FormLabel htmlFor="date">Ngày diễn ra</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiCalendar} color="gray.500" />
          </InputLeftElement>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            borderColor={borderColor}
          />
        </InputGroup>
        {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
      </FormControl>

      <HStack spacing={6} align="flex-start">
        <FormControl isInvalid={!!errors.startTime} isRequired flex={1}>
          <FormLabel htmlFor="startTime">Thời gian bắt đầu</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiClock} color="gray.500" />
            </InputLeftElement>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              borderColor={borderColor}
            />
          </InputGroup>
          {errors.startTime && (
            <FormErrorMessage>{errors.startTime}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.endTime} isRequired flex={1}>
          <FormLabel htmlFor="endTime">Thời gian kết thúc</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiClock} color="gray.500" />
            </InputLeftElement>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              borderColor={borderColor}
            />
          </InputGroup>
          {errors.endTime && (
            <FormErrorMessage>{errors.endTime}</FormErrorMessage>
          )}
        </FormControl>
      </HStack>

      <Divider />

      {/* Tạm thời comment phần sự kiện online */}
      {/* 
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="isOnline" mb="0">
          Sự kiện trực tuyến (Online)?
        </FormLabel>
        <Switch
          id="isOnline"
          name="isOnline"
          isChecked={formData.isOnline}
          onChange={handleCheckboxChange}
          colorScheme="teal"
        />
      </FormControl>
      */}

      {/* Phần nhập địa điểm cho sự kiện (hiện luôn vì đã vô hiệu hóa isOnline) */}
      <FormControl isInvalid={!!errors.location} isRequired>
        <FormLabel htmlFor="location">Tỉnh/Thành phố</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiMapPin} color="gray.500" />
          </InputLeftElement>
          <Select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Chọn tỉnh/thành phố"
            borderColor={borderColor}
            pl={10}
          >
            {vietnamProvinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </Select>
        </InputGroup>
        {errors.location && (
          <FormErrorMessage>{errors.location}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.address} isRequired>
        <FormLabel htmlFor="address">Địa chỉ chi tiết</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiHome} color="gray.500" />
          </InputLeftElement>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="VD: 04 Phạm Ngọc Thạch, Quận 1, Phường Bến Nghé"
            borderColor={borderColor}
          />
        </InputGroup>
        {errors.address && (
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        )}
      </FormControl>

      {/* Phần nhập URL cho sự kiện online - đã comment
      {formData.isOnline ? (
        <FormControl isInvalid={!!errors.onlineUrl} isRequired>
          <FormLabel htmlFor="onlineUrl">URL sự kiện trực tuyến</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiLink} color="gray.500" />
            </InputLeftElement>
            <Input
              id="onlineUrl"
              name="onlineUrl"
              value={formData.onlineUrl || ""}
              onChange={handleChange}
              placeholder="VD: https://zoom.us/j/your-meeting-id"
              borderColor={borderColor}
            />
          </InputGroup>
          <FormHelperText>
            Cung cấp đường dẫn để người tham gia có thể truy cập sự kiện.
          </FormHelperText>
          {errors.onlineUrl && (
            <FormErrorMessage>{errors.onlineUrl}</FormErrorMessage>
          )}
        </FormControl>
      ) : (
        <>
          <FormControl isInvalid={!!errors.location} isRequired>
            <FormLabel htmlFor="location">Tên địa điểm</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiMapPin} color="gray.500" />
              </InputLeftElement>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="VD: Nhà Văn hóa Thanh niên"
                borderColor={borderColor}
              />
            </InputGroup>
            {errors.location && (
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.address} isRequired>
            <FormLabel htmlFor="address">Địa chỉ chi tiết</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiHome} color="gray.500" />
              </InputLeftElement>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="VD: 04 Phạm Ngọc Thạch, Quận 1, TP.HCM"
                borderColor={borderColor}
              />
            </InputGroup>
            {errors.address && (
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            )}
          </FormControl>
        </>
      )}
      */}
    </VStack>
  );
};

interface TicketsPricingStepProps
  extends Omit<StepProps, "handleChange" | "setFormData"> {
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addTicketType: () => void;
  removeTicketType: (id: string) => void;
  updateTicketType: (id: string, field: string, value: string | number) => void;
}

// Bước 3: Vé & Giá
const TicketsPricingStep: React.FC<TicketsPricingStepProps> = ({
  formData,
  errors,
  handleCheckboxChange,
  addTicketType,
  removeTicketType,
  updateTicketType,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <VStack spacing={6} align="stretch">
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="isPaid" mb="0">
          Đây là sự kiện có thu phí?
        </FormLabel>
        <Switch
          id="isPaid"
          name="isPaid"
          isChecked={formData.isPaid}
          onChange={handleCheckboxChange}
          colorScheme="teal"
        />
      </FormControl>

      <VStack
        spacing={6}
        align="stretch"
        pl={0}
        borderWidth="1px"
        borderColor={borderColor}
        p={5}
        borderRadius="md"
      >
        <Heading size="sm" mb={0}>
          {formData.isPaid ? "Quản lý các loại vé" : "Vé miễn phí"}
        </Heading>
        {formData.ticketTypes.map((ticket) => (
          <Box
            key={ticket.id}
            p={4}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            _hover={{ shadow: "md" }}
          >
            <VStack spacing={4} align="stretch">
              <FormControl
                isInvalid={!!errors[`ticketName-${ticket.id}`]}
                isRequired
              >
                <FormLabel htmlFor={`ticketName-${ticket.id}`}>
                  Tên loại vé
                </FormLabel>
                <Input
                  id={`ticketName-${ticket.id}`}
                  value={ticket.name}
                  onChange={(e) =>
                    updateTicketType(ticket.id, "name", e.target.value)
                  }
                  placeholder="VD: Vé VIP, Vé thường, Early Bird"
                  borderColor={borderColor}
                  isDisabled={!formData.isPaid && ticket.price === 0}
                />
                {errors[`ticketName-${ticket.id}`] && (
                  <FormErrorMessage>
                    {errors[`ticketName-${ticket.id}`]}
                  </FormErrorMessage>
                )}
              </FormControl>

              <HStack spacing={4}>
                <FormControl
                  isInvalid={!!errors[`ticketPrice-${ticket.id}`]}
                  isRequired
                  flex={1}
                >
                  <FormLabel htmlFor={`ticketPrice-${ticket.id}`}>
                    Giá vé
                  </FormLabel>
                  <NumberInput
                    id={`ticketPrice-${ticket.id}`}
                    value={ticket.price}
                    onChange={(valueString, valueNumber) =>
                      updateTicketType(ticket.id, "price", valueNumber || 0)
                    }
                    min={0}
                    borderColor={borderColor}
                    isDisabled={!formData.isPaid && ticket.price === 0}
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Text fontSize="sm" fontWeight="bold" ml={2}>
                          đ
                        </Text>
                      </InputLeftElement>
                      <NumberInputField
                        borderColor={borderColor}
                        pl={10}
                        placeholder="VD: 100.000"
                      />
                      <InputRightElement width="4.5rem">
                        <Text pr={1} color="gray.500">
                          VNĐ
                        </Text>
                      </InputRightElement>
                    </InputGroup>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors[`ticketPrice-${ticket.id}`] && (
                    <FormErrorMessage>
                      {errors[`ticketPrice-${ticket.id}`]}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={!!errors[`ticketQuantity-${ticket.id}`]}
                  isRequired
                  flex={1}
                >
                  <FormLabel htmlFor={`ticketQuantity-${ticket.id}`}>
                    Số lượng vé
                  </FormLabel>
                  <NumberInput
                    id={`ticketQuantity-${ticket.id}`}
                    value={ticket.quantity}
                    onChange={(valueString) =>
                      updateTicketType(
                        ticket.id,
                        "quantity",
                        parseInt(valueString, 10) || 0
                      )
                    }
                    min={1}
                    borderColor={borderColor}
                  >
                    <NumberInputField borderColor={borderColor} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors[`ticketQuantity-${ticket.id}`] && (
                    <FormErrorMessage>
                      {errors[`ticketQuantity-${ticket.id}`]}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </HStack>
              <FormControl
                isInvalid={!!errors[`ticketDescription-${ticket.id}`]}
              >
                <FormLabel htmlFor={`ticketDescription-${ticket.id}`}>
                  Mô tả loại vé (tùy chọn)
                </FormLabel>
                <Textarea
                  id={`ticketDescription-${ticket.id}`}
                  value={ticket.description || ""}
                  onChange={(e) =>
                    updateTicketType(ticket.id, "description", e.target.value)
                  }
                  placeholder="VD: Vé này bao gồm quyền lợi đặc biệt..."
                  borderColor={borderColor}
                  size="sm"
                  isDisabled={!formData.isPaid && ticket.price === 0}
                />
                {errors[`ticketDescription-${ticket.id}`] && (
                  <FormErrorMessage>
                    {errors[`ticketDescription-${ticket.id}`]}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Flex justify="flex-end">
                <IconButton
                  aria-label="Xóa loại vé"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeTicketType(ticket.id)}
                  isDisabled={
                    formData.ticketTypes.length <= 1 ||
                    (!formData.isPaid && ticket.price === 0)
                  }
                />
              </Flex>
            </VStack>
          </Box>
        ))}
        {formData.isPaid && (
          <Button
            leftIcon={<FiPlus />}
            onClick={addTicketType}
            colorScheme="teal"
            variant="outline"
            size="sm"
            alignSelf="flex-start"
          >
            Thêm loại vé
          </Button>
        )}
      </VStack>

      {!formData.isPaid && (
        <Text color="gray.500" fontStyle="italic">
          Sự kiện này miễn phí cho tất cả người tham dự. Hệ thống sẽ tự động tạo
          một loại vé miễn phí.
        </Text>
      )}
    </VStack>
  );
};

// Định nghĩa lại AdvancedSettingsStepProps một cách tường minh
interface AdvancedSettingsStepProps {
  formData: EventFormData;
  errors: Record<string, string>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  addTag: () => void;
  removeTag: (tag: string) => void;
  handleCapacityChange: (value: string) => void;
  handleMaxTicketsChange: (value: string) => void;
}

// Bước 4: Cài đặt khác
const AdvancedSettingsStep: React.FC<AdvancedSettingsStepProps> = ({
  formData,
  errors,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  handleCapacityChange,
  handleMaxTicketsChange,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  // Biến xác định việc hiển thị phần tags - đặt false để ẩn
  const showTagsUI = false;

  return (
    <VStack spacing={6} align="stretch">
      <FormControl isInvalid={!!errors.capacity}>
        <FormLabel htmlFor="capacity">Sức chứa của sự kiện</FormLabel>
        <NumberInput
          id="capacity"
          value={formData.capacity}
          onChange={handleCapacityChange}
          min={1}
          borderColor={borderColor}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {errors.capacity && (
          <FormErrorMessage>{errors.capacity}</FormErrorMessage>
        )}
        <FormHelperText>
          Tổng số người có thể tham dự sự kiện này.
        </FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!errors.maxTicketsPerPerson}>
        <FormLabel htmlFor="maxTicketsPerPerson">
          Số vé tối đa mỗi người có thể mua
        </FormLabel>
        <NumberInput
          id="maxTicketsPerPerson"
          name="maxTicketsPerPerson"
          value={formData.maxTicketsPerPerson}
          onChange={handleMaxTicketsChange}
          min={1}
          borderColor={borderColor}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {errors.maxTicketsPerPerson && (
          <FormErrorMessage>{errors.maxTicketsPerPerson}</FormErrorMessage>
        )}
        <FormHelperText>
          Giới hạn số lượng vé một người tham gia có thể mua cho sự kiện này.
        </FormHelperText>
      </FormControl>

      {/* Ẩn phần UI tags nhưng vẫn giữ code */}
      {showTagsUI && (
        <FormControl>
          <FormLabel htmlFor="tags">Thẻ (Tags)</FormLabel>
          <InputGroup>
            <Input
              id="tags"
              placeholder="Nhập tag và nhấn Thêm"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              borderColor={borderColor}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button onClick={addTag} ml={2} colorScheme="teal">
              Thêm Tag
            </Button>
          </InputGroup>
          {formData.tags.length > 0 && (
            <Wrap mt={4} spacing={2}>
              {formData.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag
                    size="lg"
                    variant="solid"
                    colorScheme="teal"
                    borderRadius="full"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
          <FormHelperText>
            Gắn thẻ để phân loại và giúp sự kiện dễ tìm kiếm hơn. Nhấn Enter
            hoặc click "Thêm Tag".
          </FormHelperText>
        </FormControl>
      )}
    </VStack>
  );
};

interface ReviewConfirmStepProps {
  formData: EventFormData;
}

// Bước 5: Xem trước & Xác nhận
const ReviewConfirmStep: React.FC<ReviewConfirmStepProps> = ({ formData }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("teal.500", "teal.300");
  // Biến xác định việc hiển thị phần tags trong review - đặt false để ẩn
  const showTagsInReview = false;

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" mb={4} textAlign="center">
        Xem Lại Thông Tin Sự Kiện
      </Heading>

      {/* Phần hình ảnh và thông tin cơ bản */}
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        shadow="sm"
      >
        <Heading size="md" mb={4}>
          1. Thông Tin Cơ Bản
        </Heading>
        <VStack spacing={4} align="stretch">
          {formData.image &&
            formData.image !==
              "https://via.placeholder.com/800x400?text=Event+Image" && (
              <Image
                src={formData.image}
                alt={formData.title}
                maxH="300px"
                borderRadius="md"
                objectFit="cover"
                mb={4}
              />
            )}
          <Flex>
            <Text fontWeight="bold" minW="120px">
              Tên sự kiện:
            </Text>
            <Text>{formData.title}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold" minW="120px">
              Mô tả:
            </Text>
            <Text whiteSpace="pre-wrap">{formData.description}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold" minW="120px">
              Danh mục:
            </Text>
            <Badge colorScheme="teal" px={2} py={1} borderRadius="md">
              {formData.category}
            </Badge>
          </Flex>
        </VStack>
      </Box>

      {/* Thời gian & Địa điểm */}
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        shadow="sm"
      >
        <Heading size="md" mb={4}>
          2. Thời Gian & Địa Điểm
        </Heading>
        <VStack spacing={3} align="stretch">
          <Flex align="center" gap={2}>
            <Icon as={FiCalendar} color={iconColor} />
            <Text fontWeight="medium">
              {new Date(formData.date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Icon as={FiClock} color={iconColor} />
            <Text>
              {formData.startTime} - {formData.endTime}
            </Text>
          </Flex>
          {/* Bỏ phần hiển thị thông tin sự kiện online
          {formData.isOnline ? (
            <Flex align="center" gap={2}>
              <Icon as={FiLink} color={iconColor} />
              <Text>
                Trực tuyến tại:{" "}
                <a
                  href={formData.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: onlineLinkColor,
                    textDecoration: "underline",
                  }}
                >
                  {formData.onlineUrl}
                </a>
              </Text>
            </Flex>
          ) : (
          */}
          <Flex align="start" gap={2}>
            <Icon as={FiMapPin} color={iconColor} mt={1} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">{formData.location}</Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                {formData.address}
              </Text>
            </VStack>
          </Flex>
          {/*)}*/}
        </VStack>
      </Box>

      {/* Vé & Giá */}
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        shadow="sm"
      >
        <Heading size="md" mb={4}>
          3. Thông Tin Vé & Giá
        </Heading>
        <VStack spacing={3} align="stretch">
          <Flex>
            <Text fontWeight="bold" minW="120px">
              Hình thức:
            </Text>
            <Badge
              colorScheme={formData.isPaid ? "purple" : "green"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {formData.isPaid ? "Có Phí" : "Miễn Phí"}
            </Badge>
          </Flex>
          {!formData.isPaid && formData.price === 0 && (
            <Text color={secondaryTextColor} fontStyle="italic">
              Sự kiện này miễn phí tham dự.
            </Text>
          )}
          {formData.isPaid && formData.ticketTypes.length > 0 && (
            <VStack align="stretch" spacing={3} mt={2}>
              <Text fontWeight="bold">Các loại vé:</Text>
              {formData.ticketTypes.map((ticket) => (
                <Box
                  key={ticket.id}
                  p={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={bgColor}
                >
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">{ticket.name}</Text>
                    <IconButton
                      aria-label="Ticket Info"
                      icon={<FiInfo />}
                      size="sm"
                      variant="ghost"
                      isRound
                      onClick={() =>
                        alert(
                          `Thông tin chi tiết vé ${ticket.name} (chưa có UI)`
                        )
                      }
                    />
                  </Flex>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Giá: {ticket.price.toLocaleString("vi-VN")} VNĐ - Số lượng:{" "}
                    {ticket.quantity}
                  </Text>
                  {ticket.description && (
                    <Text
                      fontSize="xs"
                      color={secondaryTextColor}
                      mt={1}
                      whiteSpace="pre-wrap"
                    >
                      Mô tả: {ticket.description}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          )}
          {formData.isPaid && formData.ticketTypes.length === 0 && (
            <Text color="red.500">
              Sự kiện được đánh dấu là có phí nhưng chưa có loại vé nào được
              thêm.
            </Text>
          )}
        </VStack>
      </Box>

      {/* Cài đặt khác */}
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        shadow="sm"
      >
        <Heading size="md" mb={4}>
          4. Cài Đặt Khác
        </Heading>
        <VStack spacing={3} align="stretch">
          <Flex>
            <Text fontWeight="bold" minW="180px">
              Sức chứa tối đa:
            </Text>
            <Text>{formData.capacity} người</Text>
          </Flex>
          <Flex>
            <Text fontWeight="bold" minW="180px">
              Vé tối đa/người:
            </Text>
            <Text>{formData.maxTicketsPerPerson} vé</Text>
          </Flex>
          {/* Ẩn hiển thị tags trong review nhưng vẫn giữ code */}
          {showTagsInReview && formData.tags.length > 0 && (
            <Flex align="start">
              <Text fontWeight="bold" minW="180px" mt={1}>
                Tags:
              </Text>
              <Wrap spacing={2}>
                {formData.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="md"
                      variant="solid"
                      colorScheme="blue"
                      borderRadius="full"
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Flex>
          )}
        </VStack>
      </Box>

      <Divider my={6} />
      <Text textAlign="center" color={secondaryTextColor} fontStyle="italic">
        Vui lòng kiểm tra kỹ tất cả thông tin trước khi hoàn tất.
      </Text>
    </VStack>
  );
};

// Xây dựng một component Link tùy chỉnh để xử lý điều hướng
const ProtectedLink = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  [x: string]: unknown;
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

// Component tạo và chỉnh sửa sự kiện
const CreateEvent = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectEventLoading);
  const errorStore = useAppSelector(selectEventError);
  const createSuccess = useAppSelector(selectCreateSuccess);
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const toast = useToast();
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stepperSteps = [
    { title: "Thông tin", description: "Cơ bản", icon: FiInfo },
    {
      title: "Thời gian & Địa điểm",
      description: "Lịch trình",
      icon: FiCalendar,
    },
    { title: "Vé & Giá", description: "Chi phí", icon: FiList },
    { title: "Cài đặt", description: "Nâng cao", icon: FiSettings },
    { title: "Xem trước", description: "Hoàn tất", icon: FiCheckCircle },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: stepperSteps.length,
  });

  const queryParams = new URLSearchParams(locationHook.search);
  const editMode = queryParams.has("edit");
  const eventId = queryParams.get("edit");

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    isOnline: false,
    onlineUrl: "",
    capacity: 100,
    maxTicketsPerPerson: 1,
    isPaid: false,
    price: undefined,
    ticketTypes: [
      // { id: `ticket-${Date.now()}`, name: "Tiêu chuẩn", price: 0, quantity: 100, description: "" }, // Sẽ thêm vé khi isPaid = true
    ],
    image: "https://via.placeholder.com/800x400?text=Event+Image",
    imageFile: null,
    tags: [],
  });

  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(!editMode);
  const [authChecked, setAuthChecked] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const stepperHoverBg = useColorModeValue("gray.100", "gray.700");

  const [newTag, setNewTag] = useState("");

  // Hàm điều hướng an toàn với xác nhận nếu form đã thay đổi
  const navigateSafely = useCallback(
    (to: string, options?: { replace?: boolean; state?: unknown }) => {
      navigate(to, options);
    },
    [navigate]
  );

  useEffect(() => {
    if (createSuccess) {
      navigateSafely(
        editMode && eventId ? `/events/${eventId}` : "/user/events"
      );
    }
  }, [createSuccess, editMode, navigateSafely, eventId]);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role !== "organizer") {
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn cần là nhà tổ chức để tạo hoặc chỉnh sửa sự kiện.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigateSafely("/");
    } else if (isAuthenticated === false && authChecked) {
      toast({
        title: "Yêu cầu đăng nhập",
        description:
          "Bạn cần đăng nhập với tư cách nhà tổ chức để truy cập trang này.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigateSafely("/login");
    }
  }, [currentUser, isAuthenticated, navigateSafely, toast, authChecked]);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setAuthChecked(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      dispatch(resetEventState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formData.isPaid && formData.ticketTypes.length === 0) {
      setFormData((prev) => ({
        ...prev,
        ticketTypes: [
          {
            id: `ticket-${Date.now()}`,
            name: "Tiêu chuẩn",
            price: 0,
            quantity: prev.capacity || 100,
            description: "",
          },
        ],
      }));
    } else if (!formData.isPaid) {
      // Optionally clear ticket types or set a default free one if needed when switching to not paid
      // setFormData(prev => ({ ...prev, ticketTypes: [] }));
    }
  }, [formData.isPaid, formData.capacity]);

  useEffect(() => {
    if (errorStore) {
      toast({
        title: "Lỗi",
        description: errorStore,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [errorStore, toast]);

  useEffect(() => {
    if (editMode && eventId && !isDataLoaded) {
      const loadEventData = async () => {
        try {
          dispatch(fetchEventForEdit(eventId))
            .unwrap()
            .then((eventData) => {
              // Chuyển đổi dữ liệu từ API sang định dạng form
              const formattedData: EventFormData = {
                id: eventData._id || eventData.id,
                title: eventData.title || "",
                description: eventData.description || "",
                category: eventData.category || "",
                date: eventData.date
                  ? new Date(eventData.date).toISOString().split("T")[0]
                  : "",
                startTime: eventData.startTime || "",
                endTime: eventData.endTime || "",
                location: eventData.location || "",
                address: eventData.address || "",
                isOnline: eventData.isOnline || false,
                onlineUrl: eventData.onlineUrl || "",
                capacity: eventData.capacity || 100,
                maxTicketsPerPerson: eventData.maxTicketsPerPerson || 1,
                isPaid: eventData.isPaid || false,
                price: eventData.price,
                ticketTypes: Array.isArray(eventData.ticketTypes)
                  ? eventData.ticketTypes.map((ticket: ApiTicketType) => ({
                      id:
                        ticket._id ||
                        ticket.id ||
                        `ticket-${Date.now()}-${Math.random()}`,
                      name: ticket.name || "",
                      price: ticket.price || 0,
                      quantity: ticket.quantity || 0,
                      description: ticket.description || "",
                    }))
                  : [],
                image:
                  eventData.imageUrl ||
                  "https://via.placeholder.com/800x400?text=Event+Image",
                imageFile: null,
                tags: eventData.tags || [],
              };

              setFormData(formattedData);
              setIsDataLoaded(true);

              // Xóa toast ở đây - không cần hiển thị thêm thông báo
            })
            .catch((error) => {
              console.error("Error loading event data:", error);
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Không thể tải dữ liệu sự kiện";

              toast({
                title: "Lỗi khi tải sự kiện",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              navigateSafely("/create-event");
            });
        } catch (error: unknown) {
          console.error("Error dispatching fetchEventForEdit:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Không thể tải dữ liệu";

          toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          navigateSafely("/create-event");
        }
      };
      loadEventData();
    } else if (!editMode) {
      setIsDataLoaded(true);
      if (formData.isPaid && formData.ticketTypes.length === 0) {
        setFormData((prev) => ({
          ...prev,
          ticketTypes: [
            {
              id: `ticket-${Date.now()}`,
              name: "Tiêu chuẩn",
              price: 0,
              quantity: 100,
              description: "",
            },
          ],
        }));
      }
    }
  }, [
    editMode,
    eventId,
    toast,
    navigateSafely,
    isDataLoaded,
    formData.isPaid,
    dispatch,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Xóa lỗi khi người dùng sửa trường đó
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Xử lý sự kiện thay đổi của các input checkbox.
   * @eslint-disable-next-line @typescript-eslint/no-unused-vars
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // Xử lý đặc biệt cho isPaid: đặt giá vé 0 khi là sự kiện miễn phí
    if (name === "isPaid") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        // Khi chuyển thành sự kiện miễn phí, tạo một loại vé miễn phí mặc định
        ...(!checked && {
          ticketTypes: [
            {
              id: `ticket-${Date.now()}`,
              name: "Vé miễn phí",
              price: 0,
              quantity: prev.capacity || 100,
              description: "Vé tham dự sự kiện miễn phí",
            },
          ],
          price: 0,
        }),
        // Khi chuyển thành sự kiện có phí, không đặt price
        ...(checked && { price: undefined }),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }

    // Xử lý lỗi cho isPaid
    if (name === "isPaid") {
      setErrors((prevEditorErrors) => {
        const newEditorErrors = { ...prevEditorErrors };
        delete newEditorErrors.ticketTypes;
        Object.keys(newEditorErrors).forEach((key) => {
          if (
            key.startsWith("ticketName-") ||
            key.startsWith("ticketPrice-") ||
            key.startsWith("ticketQuantity-")
          ) {
            delete newEditorErrors[key];
          }
        });
        return newEditorErrors;
      });
    }
  };

  const handleCapacityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, capacity: parseInt(value, 10) || 0 }));
  };

  const handleMaxTicketsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      maxTicketsPerPerson: parseInt(value, 10) || 0,
    }));
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          id: `ticket-${Date.now()}`,
          name: "",
          price: 0,
          quantity: 10,
          description: "",
        },
      ],
    }));
  };

  const removeTicketType = (id: string) => {
    if (formData.ticketTypes.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter((tt) => tt.id !== id),
      }));
    } else {
      toast({
        title: "Không thể xóa",
        description: "Sự kiện có phí phải có ít nhất một loại vé.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateTicketType = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((tt) =>
        tt.id === id ? { ...tt, [field]: value } : tt
      ),
    }));
  };

  const addTag = () => {
    if (newTag.trim() !== "" && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const getErrorKeysForStep = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0:
        return ["title", "description", "category", "imageFile"];
      case 1:
        return [
          "date",
          "startTime",
          "endTime",
          "onlineUrl",
          "location",
          "address",
        ];
      case 2: {
        const ticketErrorKeys = formData.ticketTypes.flatMap((t) => [
          `ticketName-${t.id}`,
          `ticketPrice-${t.id}`,
          `ticketQuantity-${t.id}`,
        ]);
        return ["ticketTypes", ...ticketErrorKeys];
      }
      case 3:
        return ["capacity", "maxTicketsPerPerson"];
      default:
        return [];
    }
  };

  const validateStep = (stepIndex: number): Record<string, string> => {
    const newStepErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0:
        if (!formData.title.trim()) {
          newStepErrors.title = "Tên sự kiện là bắt buộc.";
        }
        if (!formData.description.trim()) {
          newStepErrors.description = "Mô tả sự kiện là bắt buộc.";
        }
        if (!formData.category) {
          newStepErrors.category = "Danh mục sự kiện là bắt buộc.";
        }
        break;
      case 1:
        if (!formData.date) {
          newStepErrors.date = "Ngày diễn ra là bắt buộc.";
        }
        if (!formData.startTime) {
          newStepErrors.startTime = "Thời gian bắt đầu là bắt buộc.";
        }
        if (!formData.endTime) {
          newStepErrors.endTime = "Thời gian kết thúc là bắt buộc.";
        }
        // Bỏ validation cho isOnline
        /*
        if (formData.isOnline) {
          if (!formData.onlineUrl?.trim()) {
            newStepErrors.onlineUrl = "URL sự kiện trực tuyến là bắt buộc.";
          }
        } else {
        */
        if (!formData.location.trim()) {
          newStepErrors.location =
            "Tên địa điểm là bắt buộc cho sự kiện offline.";
        }
        if (!formData.address.trim()) {
          newStepErrors.address =
            "Địa chỉ cụ thể là bắt buộc cho sự kiện offline.";
        }
        //}
        break;
      case 2:
        if (formData.isPaid) {
          if (formData.ticketTypes.length === 0) {
            newStepErrors.ticketTypes =
              "Sự kiện có phí phải có ít nhất một loại vé. Vui lòng thêm loại vé.";
          }
          formData.ticketTypes.forEach((ticket) => {
            if (!ticket.name.trim()) {
              newStepErrors[`ticketName-${ticket.id}`] =
                "Tên loại vé là bắt buộc.";
            }
            if (ticket.price < 0) {
              newStepErrors[`ticketPrice-${ticket.id}`] =
                "Giá vé không thể âm.";
            }
            if (ticket.quantity <= 0) {
              newStepErrors[`ticketQuantity-${ticket.id}`] =
                "Số lượng vé phải lớn hơn 0.";
            }
          });
        }
        break;
      case 3:
        if (formData.capacity <= 0) {
          newStepErrors.capacity = "Sức chứa của sự kiện phải lớn hơn 0.";
        }
        if (formData.maxTicketsPerPerson <= 0) {
          newStepErrors.maxTicketsPerPerson =
            "Số vé tối đa mỗi người phải lớn hơn 0.";
        }
        break;
    }

    setErrors((prevErrors) => {
      const currentStepErrorKeys = getErrorKeysForStep(stepIndex);
      const cleanedErrors = { ...prevErrors };
      currentStepErrorKeys.forEach((key) => {
        delete cleanedErrors[key];
      });
      if (stepIndex === 2) {
        Object.keys(cleanedErrors).forEach((key) => {
          if (
            key.startsWith("ticketName-") ||
            key.startsWith("ticketPrice-") ||
            key.startsWith("ticketQuantity-")
          ) {
            delete cleanedErrors[key];
          }
        });
      }
      return { ...cleanedErrors, ...newStepErrors };
    });
    return newStepErrors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      address,
      // isOnline, // Comment lại biến không sử dụng
      // onlineUrl, // Comment lại biến không sử dụng
      capacity,
      maxTicketsPerPerson,
      isPaid,
      // price, // Comment lại biến không sử dụng
      image,
      tags,
    } = formData;

    // Kiểm tra nếu ảnh chưa được upload lên Cloudinary
    if (
      image &&
      !image.includes("cloudinary") &&
      image !== "https://via.placeholder.com/800x400?text=Event+Image"
    ) {
      toast({
        title: "Lưu ý",
        description:
          "Ảnh sự kiện đang được tải lên. Vui lòng đợi hoàn tất trước khi lưu.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Chuẩn bị dữ liệu thống nhất cho cả tạo mới và cập nhật
    const eventBaseData = {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      address,
      isOnline: false, // Luôn đặt là false
      // onlineUrl: undefined, // Không cần gửi vì isOnline = false
      capacity,
      maxTicketsPerPerson,
      isPaid,
      price:
        formData.isPaid && formData.ticketTypes.length > 0
          ? undefined
          : formData.price,
      imageUrl: image,
      tags,
      published: true,
    };

    // Tạo ticketTypes phù hợp với schema server
    const preparedTicketTypes = formData.ticketTypes.map((t) => ({
      name: t.name,
      price: t.price,
      quantity: t.quantity,
      availableQuantity: t.quantity,
      description: t.description || "",
    }));

    // Sửa try/catch để tắt cảnh báo any ở phần xử lý lỗi
    try {
      if (editMode && formData.id) {
        console.log("Updating event:", formData.id);

        // Khi cập nhật, sử dụng eventService.updateEvent trực tiếp, không qua Redux
        // để tránh vấn đề với schema validation
        const updateData = {
          ...eventBaseData,
          ticketTypes: preparedTicketTypes,
        };

        await eventService.updateEvent(formData.id, updateData);

        toast({
          title: "Đã cập nhật sự kiện!",
          description: "Sự kiện của bạn đã được cập nhật thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigateSafely(`/events/${formData.id}`);
      } else {
        console.log("Creating event");

        // Khi tạo mới, sử dụng dispatch và action createEvent
        const createData = {
          ...eventBaseData,
          ticketTypes: preparedTicketTypes,
        };

        const result = await dispatch(createEvent(createData)).unwrap();

        toast({
          title: "Đã tạo sự kiện!",
          description: "Sự kiện của bạn đã được tạo thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigateSafely(`/events/${result.event.id}`);
      }
    } catch (error: unknown) {
      console.error("Error saving event:", error);
      toast({
        title: "Lỗi lưu sự kiện",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu sự kiện, vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteEvent = () => onOpen();
  const handleDeleteEvent = async () => {
    if (!formData.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID sự kiện để xóa",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(deleteEvent(formData.id)).unwrap();
      toast({
        title: "Sự kiện đã được xóa",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      navigateSafely("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể xóa sự kiện. Vui lòng thử lại sau.";

      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNextStep = () => {
    // Nếu đang ở chế độ chỉnh sửa, cho phép chuyển giữa các bước mà không cần validate
    if (editMode) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
      return;
    }

    // Ở chế độ tạo mới, yêu cầu validate từng bước
    const stepErrors = validateStep(activeStep);

    if (Object.keys(stepErrors).length === 0) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setErrors(stepErrors);
      toast({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng hoàn tất các trường bắt buộc ở bước này.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const renderStepContent = () => {
    const commonProps = { formData, setFormData, errors };
    switch (activeStep) {
      case 0:
        return <BasicInfoStep {...commonProps} handleChange={handleChange} />;
      case 1:
        return (
          <DateTimeLocationStep {...commonProps} handleChange={handleChange} />
        );
      case 2:
        return (
          <TicketsPricingStep
            formData={commonProps.formData}
            errors={commonProps.errors}
            handleCheckboxChange={handleCheckboxChange}
            addTicketType={addTicketType}
            removeTicketType={removeTicketType}
            updateTicketType={updateTicketType}
          />
        );
      case 3:
        return (
          <AdvancedSettingsStep
            formData={commonProps.formData}
            errors={commonProps.errors}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
            handleCapacityChange={handleCapacityChange}
            handleMaxTicketsChange={handleMaxTicketsChange}
          />
        );
      case 4:
        return <ReviewConfirmStep formData={formData} />;
      default:
        return <Box>Unknown Step</Box>;
    }
  };

  // Cập nhật maxVisitedStep mỗi khi activeStep thay đổi
  useEffect(() => {
    if (activeStep > maxVisitedStep) {
      setMaxVisitedStep(activeStep);
    }
  }, [activeStep, maxVisitedStep]);

  if (!isDataLoaded && editMode) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex justify="center" align="center" minH="300px">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" />
            <Text>Đang tải dữ liệu sự kiện...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Breadcrumb fontWeight="medium" fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={ProtectedLink} to="/">
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={ProtectedLink} to="/user/events">
              Quản lý sự kiện
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {editMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="xl" textAlign="center">
          {editMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        </Heading>

        <Box
          bg={bgColor}
          p={{ base: 4, md: 8 }}
          borderRadius="xl"
          shadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Stepper
            index={activeStep}
            colorScheme="teal"
            mb={10}
            display={{ base: "none", md: "flex" }}
          >
            {stepperSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Step key={index}>
                  <Flex
                    as="button"
                    onClick={() => {
                      if (editMode) {
                        setActiveStep(index);
                      } else if (index <= maxVisitedStep) {
                        // Cho phép nhấp vào các bước đã từng đi qua
                        setActiveStep(index);
                      } else if (index <= activeStep) {
                        setActiveStep(index);
                      } else {
                        toast({
                          title: "Vui lòng hoàn thành các bước trước",
                          description:
                            "Bạn cần hoàn thành các bước theo thứ tự.",
                          status: "info",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }}
                    cursor={
                      editMode || index <= maxVisitedStep || index <= activeStep
                        ? "pointer"
                        : "not-allowed"
                    }
                    alignItems="center"
                    textAlign="left"
                    p={2}
                    borderRadius="md"
                    _hover={
                      editMode || index <= maxVisitedStep || index <= activeStep
                        ? { bg: stepperHoverBg }
                        : {}
                    }
                    border="none"
                    background="none"
                    w="100%"
                  >
                    <StepIndicator>
                      <StepStatus
                        complete={<IconComponent />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0" ml={3}>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                  </Flex>
                  <StepSeparator />
                </Step>
              );
            })}
          </Stepper>

          <Box display={{ md: "none" }} mb={6}>
            <Text fontWeight="bold" textAlign="center" mb={1}>
              Bước {activeStep + 1} / {stepperSteps.length}:{" "}
              {stepperSteps[activeStep].title}
            </Text>
            <Progress
              value={(activeStep + 1) * (100 / stepperSteps.length)}
              size="sm"
              colorScheme="teal"
              borderRadius="md"
            />
          </Box>

          <Box minH="400px">{renderStepContent()}</Box>

          <Flex mt={10} justify="space-between">
            <Button
              onClick={handlePrevStep}
              isDisabled={activeStep === 0 || isLoading}
              leftIcon={<FiArrowLeft />}
              variant="outline"
            >
              Quay lại
            </Button>
            {activeStep === stepperSteps.length - 1 ? (
              <Button
                colorScheme="teal"
                onClick={() => handleSubmit()}
                isLoading={isLoading}
                leftIcon={<FiSave />}
              >
                {editMode ? "Cập nhật sự kiện" : "Hoàn tất & Tạo sự kiện"}
              </Button>
            ) : (
              <Button
                colorScheme="teal"
                onClick={handleNextStep}
                isLoading={isLoading}
              >
                Tiếp theo
              </Button>
            )}
          </Flex>
        </Box>

        {editMode && formData.id && (
          <Flex justify="flex-end" mt={4}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={confirmDeleteEvent}
              leftIcon={<FiTrash2 />}
              isLoading={isLoading}
            >
              Xóa sự kiện này
            </Button>
          </Flex>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa sự kiện</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Bạn có chắc chắn muốn xóa sự kiện "
              <strong>{formData.title}</strong>"? Hành động này không thể hoàn
              tác.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleDeleteEvent}>
              Xóa sự kiện
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CreateEvent;
