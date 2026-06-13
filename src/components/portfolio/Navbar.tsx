import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scrolling to hash on page load if navigated from another page
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.substring(1);
      if (location.pathname === "/") {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-portfolio-bg/80 backdrop-blur-md border-b border-portfolio-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display font-black tracking-[-0.04em] text-2xl text-white cursor-pointer"
            onClick={() => handleNavClick("/")}
          >
            GANAPATI<span className="text-portfolio-accent">.</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="font-body font-medium tracking-[0.02em] text-sm text-portfolio-text-sec hover:text-portfolio-accent transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick("/#contact")}
              className="bg-portfolio-accent text-portfolio-bg px-6 py-2.5 rounded-full font-display font-semibold tracking-[0.12em] uppercase text-xs transition-colors hover:brightness-110"
            >
              Contact
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-portfolio-text-sec hover:text-portfolio-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-portfolio-card border border-portfolio-border rounded-2xl p-4 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left py-3 px-4 font-body font-medium tracking-[0.02em] text-portfolio-text-sec hover:text-portfolio-accent hover:bg-portfolio-accent-dim rounded-xl transition-all"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("/#contact")}
              className="mt-2 bg-portfolio-accent text-portfolio-bg w-full py-3 rounded-full font-display font-semibold tracking-[0.12em] uppercase text-xs"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
