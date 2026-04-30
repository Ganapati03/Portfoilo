import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "#skills" },
  { name: "Blog", href: "#blog" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
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
            className="text-2xl font-display font-bold text-white tracking-wide"
          >
            QP<span className="text-portfolio-accent">.</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-portfolio-text-sec hover:text-portfolio-accent transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollToSection("#contact")}
              className="bg-portfolio-accent text-portfolio-bg px-6 py-2.5 rounded-full font-medium text-sm transition-colors hover:brightness-110"
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
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left py-3 px-4 text-portfolio-text-sec hover:text-portfolio-accent hover:bg-portfolio-accent-dim rounded-xl transition-all"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("#contact")}
              className="mt-2 bg-portfolio-accent text-portfolio-bg w-full py-3 rounded-full font-medium text-sm"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
