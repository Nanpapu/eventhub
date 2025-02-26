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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      title: t("auth.logoutSuccess"),
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
      title: t("auth.loginSuccess") + " (Demo)",
      description: t("common.welcome"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Demo đăng nhập nhanh với vai trò organizer
  const quickLoginAsOrganizer = () => {
    loginAsOrganizer();
    toast({
      title:
        t("auth.loginSuccess") +
        " - " +
        t("user.organizerDashboard") +
        " (Demo)",
      description: t("common.welcome"),
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
            {t("common.appName")}
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
                {t("events.createEvent")}
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
                    {t("user.profile")}
                  </MenuItem>
                  {user?.role === "organizer" && (
                    <MenuItem as={Link} to="/dashboard">
                      {t("user.organizerDashboard")}
                    </MenuItem>
                  )}
                  <MenuItem as={Link} to="/my-events">
                    {t("events.myEvents")}
                  </MenuItem>
                  <MenuItem as={Link} to="/my-tickets">
                    {t("user.myRegistrations")}
                  </MenuItem>
                  <MenuItem as={Link} to="/notifications">
                    {t("notifications.notifications")}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>{t("auth.logout")}</MenuItem>
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
                {t("auth.login")}
              </Button>
              <Button
                as={Link}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                to={"/register"}
                colorScheme="teal"
              >
                {t("auth.register")}
              </Button>

              {/* UI Demo: Nút đăng nhập nhanh - Chỉ để test, sẽ bị xóa khi tích hợp auth thực tế */}
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  colorScheme="gray"
                  variant="ghost"
                >
                  Demo Login
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={quickLogin}>
                    {t("auth.login")} (User)
                  </MenuItem>
                  <MenuItem onClick={quickLoginAsOrganizer}>
                    {t("auth.login")} (Organizer)
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
  const { t } = useTranslation();
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const linkHoverColor = useColorModeValue("teal.600", "teal.300");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        // Lấy tên item theo i18n nếu tồn tại key
        const displayLabel = navItem.labelKey
          ? t(navItem.labelKey)
          : navItem.label;

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
                      // Lấy tên child item theo i18n nếu tồn tại key
                      const childDisplayLabel = child.labelKey
                        ? t(child.labelKey)
                        : child.label;

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

interface DesktopSubNavProps extends Omit<NavItem, "label"> {
  displayLabel: string;
}

const DesktopSubNav = ({
  displayLabel,
  href,
  subLabel,
  subLabelKey,
}: DesktopSubNavProps) => {
  const { t } = useTranslation();
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const subLabelText = subLabelKey ? t(subLabelKey) : subLabel;

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

const MobileNavItem = ({ label, labelKey, children, href }: NavItem) => {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();
  const itemLabel = labelKey ? t(labelKey) : label;
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
              const childLabel = child.labelKey
                ? t(child.labelKey)
                : child.label;
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
    label: "Events",
    labelKey: "events.events",
    children: [
      {
        label: "All Events",
        labelKey: "common.all",
        subLabel: "Find events near you",
        subLabelKey: "events.searchEvents",
        href: "/events",
      },
      {
        label: "Categories",
        labelKey: "events.category",
        subLabel: "Browse events by category",
        href: "/categories",
      },
    ],
  },
  {
    label: "Create Event",
    labelKey: "events.createEvent",
    href: "/create-event",
  },
  {
    label: "About",
    labelKey: "footer.about",
    href: "/about",
  },
  {
    label: "Help",
    labelKey: "footer.faq",
    href: "/help",
  },
];
