// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOKEN_KEY = "token"; // same key used in Login.jsx

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-foreground/80";

  // 🔁 Sync auth state with localStorage on first load + every route change
  useEffect(() => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(hasToken);
  }, [location.pathname]);

  const handleLogout = () => {
    // 🔒 Clear auth data only
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ❌ DO NOT remove paid_* so old purchases stay after re-login
    // Object.keys(localStorage).forEach((key) => {
    //   if (key.startsWith("paid_")) {
    //     localStorage.removeItem(key);
    //   }
    // });

    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex items-center h-20 md:justify-between">
            {/* Mobile Menu Button (left on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden order-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>

            {/* Logo */}
            <Link
              to="/"
              className="flex-1 flex justify-center md:flex-none md:justify-start order-2 items-center space-x-2"
            >
              <div className="text-3xl font-bold text-primary poppins-semibold tracking-wide">
                Skiez Tech
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10 order-3">
              <Link
                to="/"
                className={`nav-link poppins-medium ${isActive("/")}`}
              >
                Home
              </Link>
              <Link
                to="/guide"
                className={`nav-link poppins-medium ${isActive("/guide")}`}
              >
                Browse Guide
              </Link>
              <Link
                to="/courses"
                className={`nav-link poppins-medium ${isActive("/courses")}`}
              >
                Courses
              </Link>
              <Link
                to="/study-price"
                className={`nav-link poppins-medium ${isActive("/study-price")}`}
              >
                Pricing
              </Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4 order-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="glass"
                    className="poppins-medium hover:scale-[1.05] transition"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    variant="default"
                    className="poppins-medium hover:scale-[1.08] transition"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="poppins-medium hover:scale-[1.05] transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden fixed left-0 right-0 top-20 z-40
        bg-card/95 backdrop-blur-xl border-b border-border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-2 p-6 text-lg">
          <Link
            to="/"
            className={`nav-link poppins-medium text-base ${isActive("/")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/guide"
            className={`nav-link poppins-medium text-base ${isActive("/guide")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Guide
          </Link>

          <Link
            to="/study-price"
            className={`nav-link poppins-medium ${isActive("/study-price")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>

          {!isAuthenticated ? (
            <>
              <Button
                variant="default"
                className="w-full poppins-medium hover:scale-[1.05] transition"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/");
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                className="w-full poppins-medium hover:scale-[1.05] transition"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full poppins-medium hover:scale-[1.05] transition"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
