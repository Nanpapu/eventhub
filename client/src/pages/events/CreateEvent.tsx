import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaImage,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho form tạo sự kiện
interface CreateEventValues {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isPaid: boolean;
  price?: number;
  capacity: number;
  image: FileList | null;
  isOnline: boolean;
  onlineLink?: string;
}

// Mảng danh mục sự kiện
const CATEGORIES = [
  "Music",
  "Technology",
  "Business",
  "Food & Drink",
  "Arts",
  "Sports & Fitness",
  "Health",
  "Education",
  "Other",
];

const CreateEvent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cấu hình React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventValues>({
    defaultValues: {
      isPaid: false,
      isOnline: false,
      capacity: 100,
    },
  });

  // Xử lý tải lên hình ảnh và hiển thị preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo URL để preview ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Xử lý khi submit form
  const onSubmit = async (data: CreateEventValues) => {
    try {
      // Mô phỏng tạo sự kiện thành công - sẽ gọi API khi backend sẵn sàng
      console.log("Event data:", data);
      toast({
        title: "Event created successfully!",
        description: "Your event has been submitted.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      // Chuyển hướng về trang chủ sau khi tạo sự kiện thành công
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast({
        title: "Failed to create event",
        description:
          "There was an error creating your event. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Màu nền và box shadow dựa theo chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Container maxW="4xl" py={8}>
      <Box bg={bgColor} p={8} borderRadius="xl" boxShadow={boxShadow}>
        <Stack spacing={6}>
          <VStack spacing={2} align="center">
            <Heading size="xl">Create a New Event</Heading>
            <Text color="gray.500">
              Fill in the details to create your event
            </Text>
          </VStack>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              {/* Section: Basic Information */}
              <Box>
                <Heading size="md" mb={4}>
                  Basic Information
                </Heading>
                <Stack spacing={4}>
                  {/* Title */}
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel fontWeight="medium">Event Title</FormLabel>
                    <Input
                      placeholder="Enter a descriptive title"
                      size="lg"
                      focusBorderColor="teal.400"
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 5,
                          message: "Title must be at least 5 characters",
                        },
                      })}
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Description */}
                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel fontWeight="medium">Description</FormLabel>
                    <Textarea
                      placeholder="Describe your event, include all details attendees should know"
                      size="lg"
                      rows={6}
                      focusBorderColor="teal.400"
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.description?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Category */}
                  <FormControl isInvalid={!!errors.category}>
                    <FormLabel fontWeight="medium">Category</FormLabel>
                    <Select
                      placeholder="Select category"
                      size="lg"
                      focusBorderColor="teal.400"
                      {...register("category", {
                        required: "Please select a category",
                      })}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors.category?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              {/* Section: Date and Time */}
              <Box>
                <Heading size="md" mb={4}>
                  Date and Time
                </Heading>
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
                  gap={4}
                >
                  {/* Date */}
                  <GridItem>
                    <FormControl isInvalid={!!errors.date}>
                      <FormLabel fontWeight="medium">Date</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={<FaCalendarAlt />} />
                        <Input
                          type="date"
                          size="lg"
                          focusBorderColor="teal.400"
                          {...register("date", {
                            required: "Date is required",
                            validate: (value) => {
                              const selectedDate = new Date(value);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return (
                                selectedDate >= today ||
                                "Date cannot be in the past"
                              );
                            },
                          })}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.date?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  {/* Start Time */}
                  <GridItem>
                    <FormControl isInvalid={!!errors.startTime}>
                      <FormLabel fontWeight="medium">Start Time</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={<FaClock />} />
                        <Input
                          type="time"
                          size="lg"
                          focusBorderColor="teal.400"
                          {...register("startTime", {
                            required: "Start time is required",
                          })}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.startTime?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  {/* End Time */}
                  <GridItem>
                    <FormControl isInvalid={!!errors.endTime}>
                      <FormLabel fontWeight="medium">End Time</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={<FaClock />} />
                        <Input
                          type="time"
                          size="lg"
                          focusBorderColor="teal.400"
                          {...register("endTime", {
                            required: "End time is required",
                            validate: (value) => {
                              const startTime = watch("startTime");
                              if (!startTime) return true;
                              return (
                                value > startTime ||
                                "End time must be after start time"
                              );
                            },
                          })}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.endTime?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Section: Location */}
              <Box>
                <Heading size="md" mb={4}>
                  Location
                </Heading>
                <Stack spacing={4}>
                  {/* Online/Offline Toggle */}
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isOnline" mb="0" fontWeight="medium">
                      Online Event?
                    </FormLabel>
                    <Switch
                      id="isOnline"
                      colorScheme="teal"
                      onChange={(e) => {
                        setIsOnline(e.target.checked);
                        setValue("isOnline", e.target.checked);
                      }}
                    />
                  </FormControl>

                  {isOnline ? (
                    /* Online Link */
                    <FormControl isInvalid={!!errors.onlineLink}>
                      <FormLabel fontWeight="medium">
                        Online Event Link
                      </FormLabel>
                      <Input
                        placeholder="https://zoom.us/j/1234567890"
                        size="lg"
                        focusBorderColor="teal.400"
                        {...register("onlineLink", {
                          required: isOnline
                            ? "Online link is required"
                            : false,
                          pattern: {
                            value:
                              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                            message: "Please enter a valid URL",
                          },
                        })}
                      />
                      <FormErrorMessage>
                        {errors.onlineLink?.message}
                      </FormErrorMessage>
                    </FormControl>
                  ) : (
                    /* Offline location */
                    <>
                      <FormControl isInvalid={!!errors.location}>
                        <FormLabel fontWeight="medium">Venue Name</FormLabel>
                        <InputGroup>
                          <InputLeftAddon children={<FaMapMarkerAlt />} />
                          <Input
                            placeholder="e.g. Conference Center, Hotel Name"
                            size="lg"
                            focusBorderColor="teal.400"
                            {...register("location", {
                              required: !isOnline
                                ? "Venue name is required"
                                : false,
                            })}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.location?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.address}>
                        <FormLabel fontWeight="medium">Address</FormLabel>
                        <Input
                          placeholder="Full address with city and postal code"
                          size="lg"
                          focusBorderColor="teal.400"
                          {...register("address", {
                            required: !isOnline ? "Address is required" : false,
                          })}
                        />
                        <FormErrorMessage>
                          {errors.address?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </Stack>
              </Box>

              {/* Section: Ticket Information */}
              <Box>
                <Heading size="md" mb={4}>
                  Ticket Information
                </Heading>
                <Stack spacing={4}>
                  {/* Paid/Free Toggle */}
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isPaid" mb="0" fontWeight="medium">
                      Paid Event?
                    </FormLabel>
                    <Switch
                      id="isPaid"
                      colorScheme="teal"
                      onChange={(e) => {
                        setIsPaid(e.target.checked);
                        setValue("isPaid", e.target.checked);
                      }}
                    />
                  </FormControl>

                  {/* Price (if paid) */}
                  {isPaid && (
                    <FormControl isInvalid={!!errors.price}>
                      <FormLabel fontWeight="medium">
                        Ticket Price ($)
                      </FormLabel>
                      <NumberInput
                        min={1}
                        focusBorderColor="teal.400"
                        size="lg"
                      >
                        <NumberInputField
                          placeholder="0.00"
                          {...register("price", {
                            required: isPaid
                              ? "Price is required for paid events"
                              : false,
                            min: {
                              value: 1,
                              message: "Price must be at least $1",
                            },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.price?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}

                  {/* Capacity */}
                  <FormControl isInvalid={!!errors.capacity}>
                    <FormLabel fontWeight="medium">Capacity</FormLabel>
                    <NumberInput
                      min={1}
                      max={1000}
                      focusBorderColor="teal.400"
                      size="lg"
                      defaultValue={100}
                    >
                      <NumberInputField
                        placeholder="Number of attendees"
                        {...register("capacity", {
                          required: "Capacity is required",
                          min: {
                            value: 1,
                            message: "Capacity must be at least 1",
                          },
                          max: {
                            value: 1000,
                            message: "Capacity cannot exceed 1000",
                          },
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.capacity?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              {/* Section: Event Image */}
              <Box>
                <Heading size="md" mb={4}>
                  Event Image
                </Heading>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.image}>
                    <FormLabel fontWeight="medium">Upload Image</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children={<FaImage />} />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="event-image"
                        {...register("image", {
                          required: "Event image is required",
                          onChange: handleImageChange,
                        })}
                      />
                      <Input
                        as="div"
                        h="50px"
                        pl={4}
                        pt={3}
                        cursor="pointer"
                        onClick={() =>
                          document.getElementById("event-image")?.click()
                        }
                      >
                        {imagePreview
                          ? "Image uploaded successfully"
                          : "Click to upload event image"}
                      </Input>
                    </InputGroup>
                    <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Image Preview */}
                  {imagePreview && (
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      width="100%"
                      height="200px"
                      position="relative"
                    >
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Submit Button */}
              <Flex justify="center" mt={6}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  isLoading={isSubmitting}
                  width={{ base: "full", md: "50%" }}
                >
                  Create Event
                </Button>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  );
};

export default CreateEvent;
