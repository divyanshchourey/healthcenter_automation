import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-2xl lg:text-3xl font-bold transition-colors duration-200"
              style={{
                color: isScrolled ? "#111827" : "#ffffff",
              }}
            >
              Health Automation
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                Contact
              </button>
              
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10"
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-all duration-300 ${
              isScrolled ? "bg-white shadow-lg" : "bg-black bg-opacity-90"
            }`}
          >
            <button
              onClick={() => scrollToSection("hero")}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              Home
            </button>
             
            <button
              onClick={() => scrollToSection("testimonials")}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              Contact
            </button>
             
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
