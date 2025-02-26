import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MdLanguage, MdKeyboardArrowDown } from "react-icons/md";
import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Component chuyển đổi ngôn ngữ
 * - Hiển thị dropdown cho phép người dùng chọn ngôn ngữ
 * - Sử dụng LanguageContext để lấy ngôn ngữ hiện tại và thay đổi ngôn ngữ
 * - Hiển thị cờ và tên ngôn ngữ
 */
const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  // Màu sắc dựa theo chế độ màu
  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        rightIcon={<MdKeyboardArrowDown />}
        leftIcon={<MdLanguage />}
        aria-label="Thay đổi ngôn ngữ"
        title="Thay đổi ngôn ngữ"
      >
        <HStack spacing={1}>
          <Text fontSize="sm">
            {languages[currentLanguage as keyof typeof languages].flag}
          </Text>
          <Text fontSize="sm" display={{ base: "none", md: "block" }}>
            {languages[currentLanguage as keyof typeof languages].name}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList
        bg={menuBgColor}
        borderColor={menuBorderColor}
        boxShadow="md"
        zIndex={100}
      >
        {Object.keys(languages).map((lang) => (
          <MenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            bg={currentLanguage === lang ? hoverBgColor : "transparent"}
            _hover={{ bg: hoverBgColor }}
          >
            <HStack spacing={2}>
              <Text>{languages[lang as keyof typeof languages].flag}</Text>
              <Text>{languages[lang as keyof typeof languages].name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
