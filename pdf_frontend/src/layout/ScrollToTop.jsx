import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smoothly scroll to top when the route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null; // It doesn’t render anything
};

export default ScrollToTop;
