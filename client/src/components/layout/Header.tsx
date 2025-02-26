import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
} from "@chakra-ui/react";
import {
  MdAdd as AddIcon,
  MdMenu as HamburgerIcon,
  MdClose as CloseIcon,
  MdKeyboardArrowDown as ChevronDownIcon,
  MdKeyboardArrowRight as ChevronRightIcon,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationBell } from "../notification";
import ColorModeToggle from "../common/ColorModeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";

// Giả lập trạng thái đăng nhập (sẽ được thay thế bằng context/redux sau này)
const useAuth = () => {
  // Trong thực tế, thông tin này sẽ được lấy từ localStorage/context/redux
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: "user" | "organizer";
  } | null>(null);

  // Chỉ để demo
  const login = () => {
    setIsAuthenticated(true);
    setUser({
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://bit.ly/3Q3eQvj",
      role: "user",
    });
  };

  // Thêm hàm login với vai trò organizer
  const loginAsOrganizer = () => {
    setIsAuthenticated(true);
    setUser({
      name: "Event Manager",
      email: "organizer@example.com",
      avatar: "https://bit.ly/3R7HRgG",
      role: "organizer",
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, login, loginAsOrganizer, logout };
};

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user, login, loginAsOrganizer, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const logoColor = useColorModeValue("teal.600", "teal.300");

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  // Demo đăng nhập nhanh (chỉ để test UI)
  const quickLogin = () => {
    login();
    toast({
      title: "Đăng nhập thành công (Demo)",
      description: "Chào mừng đến với EventHub",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Demo đăng nhập nhanh với vai trò organizer
  const quickLoginAsOrganizer = () => {
    loginAsOrganizer();
    toast({
      title: "Đăng nhập thành công - Bảng điều khiển tổ chức (Demo)",
      description: "Chào mừng đến với EventHub",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box position="sticky" top={0} zIndex={10}>
      <Flex
        bg={bgColor}
        color={textColor}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={borderColor}
        align={"center"}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <ChakraLink
            as={Link}
            to="/"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={logoColor}
            fontWeight="bold"
            fontSize="xl"
            _hover={{
              textDecoration: "none",
            }}
          >
            EventHub
          </ChakraLink>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          align="center"
        >
          <LanguageSwitcher />
          <ColorModeToggle />

          {isAuthenticated ? (
            <>
              <Button
                as={Link}
                to="/create-event"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                leftIcon={<AddIcon />}
                colorScheme="teal"
                variant="outline"
              >
                Tạo sự kiện
              </Button>

              <Box display={{ base: "none", md: "flex" }}>
                <NotificationBell />
              </Box>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                  _hover={{ boxShadow: "none" }}
                  _focus={{ boxShadow: "none" }}
                >
                  <Avatar
                    size={"sm"}
                    src={user?.avatar}
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "all 0.2s ease",
                    }}
                  />
                </MenuButton>
                <MenuList>
                  <Text px={3} py={2} fontWeight="bold">
                    {user?.name}
                  </Text>
                  <Text px={3} pb={2} fontSize="sm" color={secondaryTextColor}>
                    {user?.email}
                  </Text>
                  <MenuDivider />
                  <MenuItem as={Link} to="/profile">
                    Hồ sơ
                  </MenuItem>
                  {user?.role === "organizer" && (
                    <MenuItem as={Link} to="/dashboard">
                      Bảng điều khiển tổ chức
                    </MenuItem>
                  )}
                  <MenuItem as={Link} to="/my-events">
                    Sự kiện của tôi
                  </MenuItem>
                  <MenuItem as={Link} to="/my-tickets">
                    Vé của tôi
                  </MenuItem>
                  <MenuItem as={Link} to="/notifications">
                    Thông báo
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                as={Link}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                to={"/login"}
              >
                Đăng nhập
              </Button>
              <Button
                as={Link}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                to={"/register"}
                colorScheme="teal"
              >
                Đăng ký
              </Button>

              {/* UI Demo: Nút đăng nhập nhanh - Chỉ để test, sẽ bị xóa khi tích hợp auth thực tế */}
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  colorScheme="gray"
                  variant="ghost"
                >
                  Đăng nhập Demo
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={quickLogin}>
                    Đăng nhập dưới dạng người dùng
                  </MenuItem>
                  <MenuItem onClick={quickLoginAsOrganizer}>
                    Đăng nhập dưới dạng nhà tổ chức
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  // Màu sắc theo theme
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const linkHoverColor = useColorModeValue("teal.600", "teal.300");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        // Sử dụng tên Tiếng Việt trực tiếp
        const displayLabel = navItem.label;

        return (
          <Box key={navItem.label}>
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <ChakraLink
                  as={Link}
                  p={2}
                  to={navItem.href ?? "#"}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {displayLabel}
                </ChakraLink>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                  minW={"sm"}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack>
                    {navItem.children.map((child) => {
                      // Sử dụng tên Tiếng Việt trực tiếp
                      const childDisplayLabel = child.label;

                      return (
                        <DesktopSubNav
                          key={child.label}
                          {...child}
                          displayLabel={childDisplayLabel}
                        />
                      );
                    })}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

interface DesktopSubNavProps
  extends Omit<NavItem, "label" | "labelKey" | "subLabelKey"> {
  displayLabel: string;
}

const DesktopSubNav = ({
  displayLabel,
  href,
  subLabel,
}: DesktopSubNavProps) => {
  // Sử dụng subLabel trực tiếp thay vì qua i18n
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const subLabelText = subLabel;

  return (
    <ChakraLink
      as={Link}
      to={href ?? "#"}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: hoverBg }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "teal.500" }}
            fontWeight={500}
          >
            {displayLabel}
          </Text>
          <Text fontSize={"sm"}>{subLabelText}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"teal.500"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </ChakraLink>
  );
};

const MobileNav = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack
      bg={bgColor}
      p={4}
      display={{ md: "none" }}
      borderWidth="0 0 1px 0"
      borderStyle="solid"
      borderColor={borderColor}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
}: Omit<NavItem, "labelKey" | "subLabel" | "subLabelKey">) => {
  const { isOpen, onToggle } = useDisclosure();
  // Sử dụng label trực tiếp thay vì qua i18n
  const itemLabel = label;
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={textColor}>
          {itemLabel}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
            color={textColor}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={borderColor}
          align={"start"}
        >
          {children &&
            children.map((child) => {
              const childLabel = child.label;
              return (
                <ChakraLink
                  key={child.label}
                  as={Link}
                  py={2}
                  to={child.href ?? "#"}
                  color={textColor}
                  _hover={{
                    color: "teal.500",
                  }}
                >
                  {childLabel}
                </ChakraLink>
              );
            })}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  labelKey?: string;
  subLabel?: string;
  subLabelKey?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Sự kiện",
    labelKey: "events.events",
    children: [
      {
        label: "Tất cả sự kiện",
        labelKey: "common.all",
        subLabel: "Tìm sự kiện gần bạn",
        subLabelKey: "events.searchEvents",
        href: "/events",
      },
      {
        label: "Danh mục",
        labelKey: "events.category",
        subLabel: "Duyệt sự kiện theo danh mục",
        href: "/events/categories",
      },
    ],
  },
  {
    label: "Tạo sự kiện",
    labelKey: "events.createEvent",
    href: "/create-event",
  },
  {
    label: "Về chúng tôi",
    labelKey: "footer.about",
    children: [
      {
        label: "Về chúng tôi",
        labelKey: "footer.about",
        subLabel: "Tìm hiểu thêm về EventHub",
        href: "/about",
      },
      {
        label: "Liên hệ",
        labelKey: "footer.contact",
        subLabel: "Gửi câu hỏi hoặc ý kiến đóng góp",
        href: "/contact",
      },
      {
        label: "Bộ hồ sơ báo chí",
        labelKey: "footer.press",
        subLabel: "Thông tin cho báo chí",
        href: "/press",
      },
    ],
  },
  {
    label: "Chính sách",
    labelKey: "footer.policies",
    children: [
      {
        label: "Chính sách bảo mật",
        labelKey: "footer.privacy",
        subLabel: "Cách chúng tôi bảo vệ dữ liệu của bạn",
        href: "/privacy",
      },
      {
        label: "Điều khoản dịch vụ",
        labelKey: "footer.terms",
        subLabel: "Quy định sử dụng dịch vụ",
        href: "/terms",
      },
    ],
  },
  {
    label: "Trợ giúp",
    labelKey: "footer.faq",
    children: [
      {
        label: "Câu hỏi thường gặp",
        labelKey: "footer.help",
        subLabel: "Giải đáp các câu hỏi phổ biến",
        href: "/help",
      },
      {
        label: "Trung tâm trợ giúp",
        labelKey: "footer.faq",
        subLabel: "Hướng dẫn chi tiết về EventHub",
        href: "/faq",
      },
      {
        label: "Trở thành nhà tổ chức",
        labelKey: "footer.becomeOrganizer",
        subLabel: "Tạo và quản lý sự kiện của riêng bạn",
        href: "/become-organizer",
      },
      {
        label: "Cộng đồng",
        labelKey: "footer.community",
        subLabel: "Tham gia cộng đồng EventHub",
        href: "/community",
      },
    ],
  },
];
