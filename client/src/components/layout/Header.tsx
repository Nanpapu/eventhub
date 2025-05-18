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
  MdAdd,
  MdMenu as HamburgerIcon,
  MdClose as CloseIcon,
  MdKeyboardArrowDown as ChevronDownIcon,
  MdKeyboardArrowRight as ChevronRightIcon,
  MdPerson,
  MdDashboard,
  MdEvent,
  MdConfirmationNumber,
  MdBookmark,
  MdStars,
  MdNotifications,
  MdExitToApp,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationBell } from "../notification";
import ColorModeToggle from "../common/ColorModeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logout,
  selectIsAuthenticated,
  selectUser,
} from "../../app/features/authSlice";

// Demo login function (sẽ bị xóa khi tích hợp auth hoàn toàn)
const useDemoAuth = () => {
  // Đây là một hook tạm thời chỉ cho mục đích demo
  const [demoUser, setDemoUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: "user" | "organizer" | "admin";
  } | null>(null);

  const login = () => {
    setDemoUser({
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://bit.ly/3Q3eQvj",
      role: "user",
    });
  };

  const loginAsOrganizer = () => {
    setDemoUser({
      name: "Event Manager",
      email: "organizer@example.com",
      avatar: "https://bit.ly/3R7HRgG",
      role: "organizer",
    });
  };

  return { demoUser, login, loginAsOrganizer };
};

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();

  // Lấy thông tin về người dùng từ Redux store
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Demo functions cho nút "Đăng nhập Demo"
  const { demoUser, login, loginAsOrganizer } = useDemoAuth();

  // Kết hợp user thật từ Redux với user demo (ưu tiên user thật)
  const currentUser = user || demoUser;
  const isUserAuthenticated = isAuthenticated || !!demoUser;

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const logoColor = useColorModeValue("teal.600", "teal.300");

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (demoUser) {
      // Nếu là user demo, reset state local
      useDemoAuth().login = () => {};
      useDemoAuth().loginAsOrganizer = () => {};
      window.location.reload(); // Reload trang để reset state demo
    } else {
      // Nếu là user thật, dispatch action logout
      dispatch(logout());
    }

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

          {isUserAuthenticated ? (
            <>
              <Button
                as={Link}
                to="/create-event"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                leftIcon={<MdAdd />}
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
                    src={currentUser?.avatar}
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "all 0.2s ease",
                    }}
                  />
                </MenuButton>
                <MenuList>
                  <Text px={3} py={2} fontWeight="bold">
                    {currentUser?.name}
                  </Text>
                  <Text px={3} pb={2} fontSize="sm" color={secondaryTextColor}>
                    {currentUser?.email}
                  </Text>
                  <MenuDivider />
                  <MenuItem
                    as={Link}
                    to="/user"
                    icon={<Icon as={MdPerson} mr={2} />}
                  >
                    Quản lý tài khoản
                  </MenuItem>

                  {currentUser?.role === "organizer" ? (
                    <>
                      <MenuItem
                        as={Link}
                        to="/dashboard"
                        icon={<Icon as={MdDashboard} mr={2} />}
                      >
                        Bảng điều khiển tổ chức
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        to="/my-events"
                        icon={<Icon as={MdEvent} mr={2} />}
                      >
                        Sự kiện đã tạo
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        to="/create-event"
                        icon={<Icon as={MdAdd} mr={2} />}
                      >
                        Tạo sự kiện mới
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        as={Link}
                        to="/user/tickets"
                        icon={<Icon as={MdConfirmationNumber} mr={2} />}
                      >
                        Vé của tôi
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        to="/user/events"
                        icon={<Icon as={MdBookmark} mr={2} />}
                      >
                        Sự kiện đã lưu
                      </MenuItem>
                      <MenuItem
                        as={Link}
                        to="/become-organizer"
                        icon={<Icon as={MdStars} mr={2} />}
                      >
                        Trở thành nhà tổ chức
                      </MenuItem>
                    </>
                  )}

                  <MenuItem
                    as={Link}
                    to="/notifications"
                    icon={<Icon as={MdNotifications} mr={2} />}
                  >
                    Thông báo
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={handleLogout}
                    icon={<Icon as={MdExitToApp} mr={2} />}
                  >
                    Đăng xuất
                  </MenuItem>
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
        label: "Trung tâm trợ giúp",
        labelKey: "footer.help",
        subLabel: "Giải đáp các câu hỏi phổ biến",
        href: "/help",
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
