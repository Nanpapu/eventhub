import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook để scroll lên đầu trang khi thay đổi route
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);
};

export default useScrollToTop;
