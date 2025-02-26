import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Switch,
  FormErrorMessage,
  VStack,
  HStack,
  Divider,
  useToast,
  Image,
  Text,
  IconButton,
  Badge,
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
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiImage,
  FiTag,
  FiUsers,
  FiInfo,
  FiX,
  FiPlus,
  FiUpload,
  FiSave,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";

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
  isPaid: boolean;
  price?: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  image: string;
  tags: string[];
}

// Dữ liệu cho các lựa chọn form
const categoryOptions = [
  "Conference",
  "Workshop",
  "Seminar",
  "Meetup",
  "Concert",
  "Exhibition",
  "Sport",
  "Party",
  "Other",
];

// Component tạo và chỉnh sửa sự kiện
const CreateEvent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Parse URL query params để xác định chế độ chỉnh sửa hay tạo mới
  const queryParams = new URLSearchParams(location.search);
  const editMode = queryParams.has("edit");
  const eventId = queryParams.get("edit");

  // Form data state
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
    capacity: 100,
    isPaid: false,
    ticketTypes: [
      { id: "standard", name: "Standard", price: 0, quantity: 100 },
    ],
    image: "https://via.placeholder.com/800x400?text=Event+Image",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(!editMode);

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Load sự kiện hiện có nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (editMode && eventId) {
      // Trong thực tế, sẽ gọi API để lấy dữ liệu sự kiện
      // Mô phỏng API call để lấy dữ liệu sự kiện
      const loadEventData = async () => {
        try {
          // Mô phỏng thời gian tải dữ liệu
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Dữ liệu mẫu cho một sự kiện hiện có
          const mockEventData: EventFormData = {
            id: eventId,
            title: "Tech Conference 2023",
            description:
              "Join us for a hands-on workshop where you'll learn the fundamentals of UI/UX design and modern web development techniques.",
            category: "Conference",
            date: "2023-12-15",
            startTime: "09:00",
            endTime: "16:00",
            location: "Convention Center",
            address: "123 Main St, New York, NY",
            isOnline: false,
            capacity: 500,
            isPaid: true,
            price: 25.99,
            ticketTypes: [
              {
                id: "early-bird",
                name: "Early Bird",
                price: 19.99,
                quantity: 100,
              },
              { id: "standard", name: "Standard", price: 29.99, quantity: 300 },
              { id: "vip", name: "VIP", price: 49.99, quantity: 100 },
            ],
            image:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
            tags: ["tech", "web development", "design", "networking"],
          };

          setFormData(mockEventData);
          setIsDataLoaded(true);

          toast({
            title: "Event data loaded",
            description: "You can now edit the event details",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "Error loading event",
            description: "Could not load event data for editing",
            status: "error",
            duration: 4000,
            isClosable: true,
          });

          // Redirect back to dashboard if data cannot be loaded
          navigate("/dashboard");
        }
      };

      loadEventData();
    }
  }, [editMode, eventId, toast, navigate]);

  // Xử lý thay đổi form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Xử lý thay đổi price
  const handlePriceChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseFloat(value),
    }));
  };

  // Xử lý thay đổi capacity
  const handleCapacityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      capacity: parseInt(value, 10),
    }));
  };

  // Thêm tag mới
  const addTag = () => {
    if (newTag.trim() !== "" && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  // Xóa tag
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Thêm ticket type
  const addTicketType = () => {
    const newId = `ticket-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { id: newId, name: "New Ticket", price: 0, quantity: 50 },
      ],
    }));
  };

  // Xóa ticket type
  const removeTicketType = (id: string) => {
    if (formData.ticketTypes.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "Event must have at least one ticket type",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((ticket) => ticket.id !== id),
    }));
  };

  // Cập nhật ticket type
  const updateTicketType = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      ),
    }));
  };

  // Xác nhận xóa sự kiện
  const confirmDeleteEvent = () => {
    onOpen();
  };

  // Xóa sự kiện (sau khi xác nhận)
  const handleDeleteEvent = () => {
    // Trong thực tế, sẽ gọi API để xóa sự kiện
    toast({
      title: "Event deleted",
      description: "The event has been permanently deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    navigate("/dashboard");
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    if (!formData.isOnline && !formData.location.trim()) {
      newErrors.location = "Location is required for in-person events";
    }

    if (formData.isOnline && !formData.onlineUrl?.trim()) {
      newErrors.onlineUrl = "Online URL is required for virtual events";
    }

    if (formData.isPaid && (!formData.price || formData.price <= 0)) {
      newErrors.price = "Valid price is required for paid events";
    }

    // Validate if all ticket types have names
    formData.ticketTypes.forEach((ticket, index) => {
      if (!ticket.name.trim()) {
        newErrors[`ticketName-${index}`] = "Ticket name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Trong thực tế, sẽ gọi API để lưu sự kiện
      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: editMode ? "Event updated" : "Event created",
        description: editMode
          ? "Your event has been updated successfully"
          : "Your event has been created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Chuyển hướng đến dashboard sau khi thành công
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your event",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu đang tải dữ liệu sự kiện (chế độ chỉnh sửa)
  if (!isDataLoaded) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            alignSelf="flex-start"
            onClick={() => navigate(-1)}
          >
            Back to Dashboard
          </Button>
          <Heading>
            {editMode ? "Loading Event..." : "Create New Event"}
          </Heading>
          <Text>Please wait while we load the event data...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/dashboard")}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              {editMode ? "Edit Event" : "Create Event"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading>{editMode ? "Edit Event" : "Create New Event"}</Heading>

          <HStack spacing={4}>
            {editMode && (
              <Button
                colorScheme="red"
                variant="outline"
                leftIcon={<FiTrash2 />}
                onClick={confirmDeleteEvent}
              >
                Delete Event
              </Button>
            )}
            <Button
              colorScheme="teal"
              leftIcon={<FiSave />}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              {editMode ? "Save Changes" : "Create Event"}
            </Button>
          </HStack>
        </Flex>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={8}>
            {/* Event Basic Information */}
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Basic Information</Heading>

                <FormControl isRequired isInvalid={!!errors.title}>
                  <FormLabel>Event Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event"
                    rows={5}
                  />
                  {errors.description && (
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  )}
                </FormControl>

                <HStack spacing={6} align="flex-start">
                  <FormControl isRequired isInvalid={!!errors.category}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Select category"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tags</FormLabel>
                    <HStack>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add event tags"
                      />
                      <IconButton
                        aria-label="Add tag"
                        icon={<FiPlus />}
                        onClick={addTag}
                      />
                    </HStack>
                    <Box mt={2}>
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          m={1}
                          py={1}
                          px={2}
                          borderRadius="full"
                          colorScheme="teal"
                        >
                          {tag}
                          <Icon
                            as={FiX}
                            ml={1}
                            cursor="pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </Box>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Event Image</FormLabel>
                  <VStack spacing={3} align="stretch">
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Image URL"
                    />
                    <HStack>
                      <Button leftIcon={<FiUpload />} size="sm">
                        Upload Image
                      </Button>
                      <Text fontSize="sm" color="gray.500">
                        Or paste image URL above
                      </Text>
                    </HStack>
                    {formData.image && (
                      <Image
                        src={formData.image}
                        alt="Event preview"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/800x400?text=Preview+Image"
                        maxH="200px"
                        objectFit="cover"
                      />
                    )}
                  </VStack>
                </FormControl>
              </VStack>
            </Box>

            {/* Date & Time */}
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Date & Time</Heading>

                <FormControl isRequired isInvalid={!!errors.date}>
                  <FormLabel>Date</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiCalendar color="gray.300" />
                    </InputLeftElement>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.date && (
                    <FormErrorMessage>{errors.date}</FormErrorMessage>
                  )}
                </FormControl>

                <HStack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.startTime}>
                    <FormLabel>Start Time</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiClock color="gray.300" />
                      </InputLeftElement>
                      <Input
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.startTime && (
                      <FormErrorMessage>{errors.startTime}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.endTime}>
                    <FormLabel>End Time</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiClock color="gray.300" />
                      </InputLeftElement>
                      <Input
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.endTime && (
                      <FormErrorMessage>{errors.endTime}</FormErrorMessage>
                    )}
                  </FormControl>
                </HStack>
              </VStack>
            </Box>

            {/* Location */}
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Location</Heading>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Is this an online event?</FormLabel>
                  <Switch
                    name="isOnline"
                    isChecked={formData.isOnline}
                    onChange={handleCheckboxChange}
                  />
                </FormControl>

                {formData.isOnline ? (
                  <FormControl isRequired isInvalid={!!errors.onlineUrl}>
                    <FormLabel>Online Event URL</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMapPin color="gray.300" />
                      </InputLeftElement>
                      <Input
                        name="onlineUrl"
                        value={formData.onlineUrl || ""}
                        onChange={handleChange}
                        placeholder="https://zoom.us/j/your-meeting-id"
                      />
                    </InputGroup>
                    <FormHelperText>
                      Add the URL where attendees can join the event
                    </FormHelperText>
                    {errors.onlineUrl && (
                      <FormErrorMessage>{errors.onlineUrl}</FormErrorMessage>
                    )}
                  </FormControl>
                ) : (
                  <>
                    <FormControl isRequired isInvalid={!!errors.location}>
                      <FormLabel>Venue Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiMapPin color="gray.300" />
                        </InputLeftElement>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Enter venue name"
                        />
                      </InputGroup>
                      {errors.location && (
                        <FormErrorMessage>{errors.location}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter venue address"
                      />
                    </FormControl>
                  </>
                )}
              </VStack>
            </Box>

            {/* Capacity & Tickets */}
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Capacity & Tickets</Heading>

                <FormControl>
                  <FormLabel>Total Capacity</FormLabel>
                  <NumberInput
                    value={formData.capacity}
                    onChange={handleCapacityChange}
                    min={1}
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiUsers color="gray.300" />
                      </InputLeftElement>
                      <NumberInputField pl={10} />
                    </InputGroup>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Maximum number of attendees</FormHelperText>
                </FormControl>

                <Divider />

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Is this a paid event?</FormLabel>
                  <Switch
                    name="isPaid"
                    isChecked={formData.isPaid}
                    onChange={handleCheckboxChange}
                  />
                </FormControl>

                {formData.isPaid && (
                  <VStack spacing={5} align="stretch">
                    <Heading size="sm" mt={2}>
                      Ticket Types
                    </Heading>

                    {formData.ticketTypes.map((ticket, index) => (
                      <HStack key={ticket.id} spacing={4}>
                        <FormControl
                          isRequired
                          isInvalid={!!errors[`ticketName-${index}`]}
                        >
                          <FormLabel>Name</FormLabel>
                          <Input
                            value={ticket.name}
                            onChange={(e) =>
                              updateTicketType(
                                ticket.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Ticket name"
                          />
                          {errors[`ticketName-${index}`] && (
                            <FormErrorMessage>
                              {errors[`ticketName-${index}`]}
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Price ($)</FormLabel>
                          <NumberInput
                            value={ticket.price}
                            onChange={(value) =>
                              updateTicketType(
                                ticket.id,
                                "price",
                                parseFloat(value)
                              )
                            }
                            min={0}
                            precision={2}
                          >
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <FiDollarSign color="gray.300" />
                              </InputLeftElement>
                              <NumberInputField pl={10} />
                            </InputGroup>
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Quantity</FormLabel>
                          <NumberInput
                            value={ticket.quantity}
                            onChange={(value) =>
                              updateTicketType(
                                ticket.id,
                                "quantity",
                                parseInt(value, 10)
                              )
                            }
                            min={1}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <IconButton
                          aria-label="Remove ticket type"
                          icon={<FiTrash2 />}
                          onClick={() => removeTicketType(ticket.id)}
                          alignSelf="flex-end"
                          mb="2"
                        />
                      </HStack>
                    ))}

                    <Button
                      leftIcon={<FiPlus />}
                      onClick={addTicketType}
                      alignSelf="flex-start"
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                    >
                      Add Ticket Type
                    </Button>
                  </VStack>
                )}

                {!formData.isPaid && (
                  <Text color="gray.500">Event is free for all attendees</Text>
                )}
              </VStack>
            </Box>

            {/* Submit Buttons */}
            <Flex justify="space-between" mt={4}>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                rightIcon={<FiSave />}
                type="submit"
                isLoading={isSubmitting}
              >
                {editMode ? "Save Changes" : "Create Event"}
              </Button>
            </Flex>
          </Stack>
        </form>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CreateEvent;
