// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";

const TOKEN_KEY = "token";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-foreground/80";

  useEffect(() => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(hasToken);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* LEFT — LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 max-w-[65%]"
            >
              <img
                src={logo}
                alt="Skiez Pdf Books"
                className="md:h-30 h-20  w-auto object-contain"
              />
              <span className="text-xl sm:text-2xl md:text-2xl font-bold text-primary poppins-semibold tracking-wide truncate">
                Skiez Pdf Books
              </span>
            </Link>

            {/* CENTER — DESKTOP MENU */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link to="/" className={`poppins-medium ${isActive("/")}`}>
                Home
              </Link>
              <Link
                to="/guide"
                className={`poppins-medium ${isActive("/guide")}`}
              >
                Browse Guide
              </Link>
              <Link
                to="/courses"
                className={`poppins-medium ${isActive("/courses")}`}
              >
                Courses
              </Link>
              <Link
                to="/study-price"
                className={`poppins-medium ${isActive("/study-price")}`}
              >
                Pricing
              </Link>
            </nav>

            {/* RIGHT — BUTTONS / MOBILE MENU ICON */}
            <div className="flex items-center gap-3">
              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button variant="glass" className="poppins-medium">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      variant="default"
                      className="poppins-medium"
                      onClick={() => navigate("/")}
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="poppins-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed left-0 right-0 top-16 sm:top-20 z-40
        bg-card/95 backdrop-blur-xl border-b border-border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-4 p-6 text-base sm:text-lg">
          <Link
            to="/"
            className={`poppins-medium ${isActive("/")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/guide"
            className={`poppins-medium ${isActive("/guide")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Guide
          </Link>

          <Link
            to="/study-price"
            className={`poppins-medium ${isActive("/study-price")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>

          {!isAuthenticated ? (
            <>
              <Button
                variant="default"
                className="w-full poppins-medium"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/");
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                className="w-full poppins-medium"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="w-full poppins-medium"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
