import React, { createContext, useState, useContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../utils/i18n";

// Định nghĩa kiểu dữ liệu cho context
type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  languages: typeof languages;
};

// Tạo context với giá trị mặc định
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeLanguage: () => {},
  languages,
});

// Props cho LanguageProvider
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Provider cho ngôn ngữ
 * - Quản lý trạng thái ngôn ngữ hiện tại
 * - Cung cấp hàm changeLanguage để thay đổi ngôn ngữ
 * - Sử dụng i18next để thực hiện thay đổi ngôn ngữ
 */
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  const changeLanguage = (lang: string) => {
    if (Object.keys(languages).includes(lang)) {
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      // Lưu ngôn ngữ đã chọn vào localStorage để duy trì qua các lần tải trang
      localStorage.setItem("i18nextLng", lang);
      // Cập nhật hướng văn bản nếu cần (cho các ngôn ngữ RTL như tiếng Ả Rập)
      document.documentElement.dir =
        languages[lang as keyof typeof languages].dir;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook để sử dụng LanguageContext
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
