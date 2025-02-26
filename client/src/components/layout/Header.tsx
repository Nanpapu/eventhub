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

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
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
      title: "Logged in as User (Demo)",
      description: "This is just a UI demo, no actual authentication",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Demo đăng nhập nhanh với vai trò organizer
  const quickLoginAsOrganizer = () => {
    loginAsOrganizer();
    toast({
      title: "Logged in as Organizer (Demo)",
      description: "You now have access to Organizer features",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box position="sticky" top={0} zIndex={10}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
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
            color={useColorModeValue("teal.600", "white")}
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
                Create Event
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
                  <Text px={3} pb={2} fontSize="sm" color="gray.500">
                    {user?.email}
                  </Text>
                  <MenuDivider />
                  <MenuItem as={Link} to="/profile">
                    Profile
                  </MenuItem>
                  {user?.role === "organizer" && (
                    <MenuItem as={Link} to="/dashboard">
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem as={Link} to="/my-events">
                    My Events
                  </MenuItem>
                  <MenuItem as={Link} to="/my-tickets">
                    Vé của tôi
                  </MenuItem>
                  <MenuItem as={Link} to="/notifications">
                    Notifications
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
                Sign In
              </Button>
              <Button
                as={Link}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"teal.500"}
                to={"/register"}
                _hover={{
                  bg: "teal.400",
                }}
              >
                Sign Up
              </Button>
              {/* Nút Đăng nhập nhanh - chỉ cho demo UI */}
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"xs"}
                fontWeight={600}
                color={"white"}
                bg={"purple.500"}
                onClick={quickLogin}
                size="sm"
                _hover={{
                  bg: "purple.400",
                }}
              >
                Demo Login
              </Button>
              {/* Nút đăng nhập nhanh với quyền Organizer */}
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"xs"}
                fontWeight={600}
                color={"white"}
                bg={"orange.500"}
                onClick={quickLoginAsOrganizer}
                size="sm"
                _hover={{
                  bg: "orange.400",
                }}
              >
                Demo Organizer
              </Button>
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

// Navigation Items
const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Events",
    children: [
      {
        label: "All Events",
        subLabel: "Explore all upcoming events",
        href: "/events",
      },
      {
        label: "By Category",
        subLabel: "Search events by category",
        href: "/events?view=categories",
      },
    ],
  },
  {
    label: "Create Event",
    href: "/create-event",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Demo",
    href: "/demo",
  },
];

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("teal.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <ChakraLink
                as={navItem.href ? Link : "span"}
                p={2}
                {...(navItem.href ? { to: navItem.href } : {})}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
                {navItem.children && (
                  <Icon
                    as={ChevronDownIcon}
                    transition={"all .25s ease-in-out"}
                    w={4}
                    h={4}
                    ml={1}
                  />
                )}
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
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <ChakraLink
      as={Link}
      to={href || "#"}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("teal.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "teal.500" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: 1, transform: "translateX(0)" }}
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
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

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
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <ChakraLink
                key={child.label}
                as={Link}
                to={child.href || "#"}
                py={2}
              >
                {child.label}
              </ChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
