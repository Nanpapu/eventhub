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
  ButtonGroup,
} from "@chakra-ui/react";
import {
  MdMenu as HamburgerIcon,
  MdClose as CloseIcon,
  MdKeyboardArrowDown as ChevronDownIcon,
  MdKeyboardArrowRight as ChevronRightIcon,
  MdPerson,
  MdDashboard,
  MdConfirmationNumber,
  MdBookmark,
  MdStars,
  MdExitToApp,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { NotificationBell } from "../notification";
import ColorModeToggle from "../common/ColorModeToggle";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logout,
  selectIsAuthenticated,
  selectUser,
} from "../../app/features/authSlice";

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();

  // Lấy thông tin về người dùng từ Redux store
  const isAuthenticatedRedux = useAppSelector(selectIsAuthenticated);
  const userRedux = useAppSelector(selectUser);

  // Kết hợp user thật từ Redux với user demo (ưu tiên user thật)
  const currentUser = userRedux;
  const isUserAuthenticated = isAuthenticatedRedux;

  // Màu sắc theo theme cho Header
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColorHeader = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const logoColor = useColorModeValue("teal.600", "teal.300");
  const buttonHoverBg = useColorModeValue("gray.100", "gray.700");

  // Xử lý đăng xuất
  const handleLogout = () => {
    // if (demoUser) {
    //   // Nếu là user demo, reset state local bằng cách gọi setDemoUser(null)
    //   setDemoUser(null);
    //   window.location.reload(); // Reload trang để reset state demo
    // } else {
    // Nếu là user thật, dispatch action logout
    dispatch(logout());
    // }

    toast({
      title: "Đăng xuất thành công",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  // Lọc NAV_ITEMS dựa trên vai trò người dùng
  const getFilteredNavItems = (isAuthenticatedUser: boolean) => {
    // Tạo bản sao của NAV_ITEMS để không thay đổi mảng gốc
    if (isAuthenticatedUser) {
      // Nếu người dùng đã xác thực, trả về tất cả các mục NAV_ITEMS gốc.
      // Mục "Tạo sự kiện" đã có sẵn trong NAV_ITEMS (được định nghĩa ở dưới) và sẽ được hiển thị.
      return [...NAV_ITEMS];
    } else {
      // Nếu người dùng chưa xác thực, lọc bỏ mục "Tạo sự kiện".
      // Sử dụng labelKey để xác định mục cần lọc một cách chính xác hơn.
      return NAV_ITEMS.filter((item) => item.label !== "Tạo sự kiện");
    }
  };

  // Lấy danh sách NAV_ITEMS đã được lọc
  const filteredNavItems = getFilteredNavItems(isUserAuthenticated);

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
        borderColor={borderColorHeader}
        align={"center"}
        boxShadow="md"
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
            <DesktopNav navItems={filteredNavItems} currentUser={currentUser} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={3}
          align="center"
        >
          <ColorModeToggle />

          {isUserAuthenticated ? (
            <>
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
                <MenuList boxShadow="lg">
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
                      <MenuDivider />
                      <Text
                        px={3}
                        py={2}
                        fontSize="sm"
                        fontWeight="bold"
                        color={secondaryTextColor}
                      >
                        Quản lý tổ chức
                      </Text>
                      <MenuItem
                        as={Link}
                        to="/dashboard"
                        icon={<Icon as={MdDashboard} mr={2} />}
                      >
                        Bảng điều khiển tổ chức
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
              <ButtonGroup
                spacing={2}
                display={{ base: "none", md: "inline-flex" }}
                alignItems="center"
              >
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  fontWeight="500"
                  color={secondaryTextColor}
                  _hover={{ bg: buttonHoverBg }}
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="solid"
                  colorScheme="teal"
                  bg="teal.500"
                  _hover={{ bg: "teal.600", boxShadow: "sm" }}
                  size="sm"
                  px={4}
                  borderRadius="md"
                  fontWeight="500"
                >
                  Đăng ký
                </Button>
              </ButtonGroup>
              <Stack
                direction="row"
                spacing={2}
                display={{ base: "flex", md: "none" }}
                alignItems="center"
                flex={1}
              >
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  flex={1}
                  fontWeight="500"
                  color={secondaryTextColor}
                  _hover={{ bg: buttonHoverBg }}
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="solid"
                  colorScheme="teal"
                  bg="teal.500"
                  _hover={{ bg: "teal.600", boxShadow: "sm" }}
                  size="sm"
                  flex={1}
                  px={4}
                  borderRadius="md"
                  fontWeight="500"
                >
                  Đăng ký
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={filteredNavItems} currentUser={currentUser} />
      </Collapse>
    </Box>
  );
}

interface DesktopNavProps {
  navItems: Array<NavItem>;
  currentUser: UserForHeader | null;
}

const DesktopNav = ({ navItems, currentUser }: DesktopNavProps) => {
  // Màu sắc theo theme cho DesktopNav (bao gồm cả Popover)
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const linkHoverColor = useColorModeValue("teal.600", "teal.300");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const borderColorPopover = useColorModeValue("gray.200", "gray.700"); // Đổi tên để tránh xung đột

  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => {
        // Sử dụng tên Tiếng Việt trực tiếp
        const displayLabel = navItem.label;
        let navHref = navItem.href ?? "#";

        // Điều chỉnh href cho mục "Tạo sự kiện"
        if (navItem.label === "Tạo sự kiện") {
          if (currentUser?.role === "organizer") {
            navHref = "/create-event";
          } else {
            navHref = "/become-organizer";
          }
        }

        return (
          <Box key={navItem.label}>
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <ChakraLink
                  as={Link}
                  p={2}
                  to={navHref}
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
                  borderColor={borderColorPopover} // Sử dụng borderColorPopover
                >
                  <Stack>
                    {navItem.children.map((child) => {
                      // Sử dụng tên Tiếng Việt trực tiếp
                      const childDisplayLabel = child.label;

                      return (
                        <DesktopSubNav
                          key={child.label}
                          label={child.label}
                          labelKey={child.labelKey}
                          href={child.href}
                          subLabel={child.subLabel}
                          displayLabel={childDisplayLabel}
                          currentUser={currentUser}
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

interface DesktopSubNavProps {
  label: string;
  labelKey?: string;
  subLabel?: string;
  href?: string;
  children?: Array<NavItem>;
  displayLabel: string;
  currentUser: UserForHeader | null;
}

const DesktopSubNav = ({
  displayLabel,
  href,
  subLabel,
  children,
  labelKey,
  currentUser,
}: DesktopSubNavProps) => {
  // Sử dụng subLabel trực tiếp thay vì qua i18n
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const subLabelText = subLabel;

  let itemHref = href ?? "#";
  // Điều chỉnh href cho mục "Tạo sự kiện"
  if (labelKey === "Tạo sự kiện" && !children) {
    if (currentUser?.role === "organizer") {
      itemHref = "/create-event";
    } else {
      itemHref = "/become-organizer";
    }
  }

  return (
    <ChakraLink
      as={Link}
      to={itemHref}
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

const MobileNav = ({
  navItems,
  currentUser,
}: {
  navItems: Array<NavItem>;
  currentUser: UserForHeader | null;
}) => {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700"); // Đây là borderColor cho MobileNav Stack

  return (
    <Stack
      bg={bgColor}
      p={4}
      display={{ md: "none" }}
      borderWidth="0 0 1px 0"
      borderStyle="solid"
      borderColor={borderColor} // Sử dụng borderColor này
    >
      {navItems.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          currentUser={currentUser}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
  currentUser,
}: Omit<NavItem, "subLabel" | "subLabelKey"> & {
  currentUser: UserForHeader | null;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  // Sử dụng label trực tiếp thay vì qua i18n
  const itemLabel = label;
  const borderColorMobileNavItem = useColorModeValue("gray.200", "gray.700");
  const textColorMobileNavItem = useColorModeValue("gray.800", "gray.100");

  let itemHref = href ?? "#";
  // Điều chỉnh href cho mục "Tạo sự kiện"
  if (label === "Tạo sự kiện") {
    if (currentUser?.role === "organizer") {
      itemHref = "/create-event";
    } else {
      itemHref = "/become-organizer";
    }
  }

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={itemHref} // Sử dụng itemHref đã điều chỉnh
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={textColorMobileNavItem}>
          {" "}
          {/* Sử dụng textColorMobileNavItem */}
          {itemLabel}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
            color={textColorMobileNavItem} // Sử dụng textColorMobileNavItem
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={borderColorMobileNavItem} // Sử dụng borderColorMobileNavItem
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
                  color={textColorMobileNavItem} // Sử dụng textColorMobileNavItem
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

interface UserForHeader {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Sự kiện",
    children: [
      {
        label: "Tất cả sự kiện",
        subLabel: "Tìm sự kiện gần bạn",
        href: "/events",
      },
      {
        label: "Danh mục",
        subLabel: "Duyệt sự kiện theo danh mục",
        href: "/events/categories",
      },
    ],
  },
  {
    label: "Tạo sự kiện",
  },
  {
    label: "Về chúng tôi",
    children: [
      {
        label: "Về EventHub",
        subLabel: "Tìm hiểu thêm về EventHub",
        href: "/about",
      },
      {
        label: "Liên hệ",
        subLabel: "Gửi câu hỏi hoặc ý kiến đóng góp",
        href: "/contact",
      },
      {
        label: "Hồ sơ báo chí",
        subLabel: "Thông tin cho báo chí",
        href: "/press",
      },
    ],
  },
  {
    label: "Chính sách",
    children: [
      {
        label: "Chính sách bảo mật",
        subLabel: "Cách chúng tôi bảo vệ dữ liệu của bạn",
        href: "/privacy",
      },
      {
        label: "Điều khoản dịch vụ",
        subLabel: "Quy định sử dụng dịch vụ",
        href: "/terms",
      },
    ],
  },
  {
    label: "Trợ giúp",
    children: [
      {
        label: "Trung tâm trợ giúp",
        subLabel: "Giải đáp các câu hỏi phổ biến",
        href: "/help",
      },
      {
        label: "Trở thành nhà tổ chức",
        subLabel: "Tạo và quản lý sự kiện của riêng bạn",
        href: "/become-organizer",
      },
      {
        label: "Cộng đồng",
        subLabel: "Tham gia cộng đồng EventHub",
        href: "/community",
      },
    ],
  },
];
