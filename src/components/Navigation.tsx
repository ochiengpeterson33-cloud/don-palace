import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "../lib/utils";
import { useCart } from "../context/CartContext";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Don Palace Furniture" 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-terracotta flex items-center justify-center">
              <span className="text-terracotta font-serif italic text-lg font-bold">dp</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold tracking-tighter uppercase text-ink leading-none">Don Palace</span>
              <span className="text-[10px] tracking-widest uppercase text-terracotta leading-none mt-1">Furniture</span>
            </div>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xs uppercase tracking-widest font-medium transition-colors hover:text-terracotta relative group",
                location.pathname === link.path ? "text-terracotta" : "text-ink/60 hover:text-ink"
              )}
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-terracotta transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-terracotta transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-sand z-50 transition-transform duration-500 ease-in-out px-6 py-8 flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-12">
          <span className="text-2xl font-semibold tracking-wider serif uppercase">
            Don Palace
          </span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-2xl serif transition-colors hover:text-terracotta"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
