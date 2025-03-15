
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="relative z-10 font-playfair text-2xl font-bold tracking-tight text-overcomer"
        >
          Overcomer
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium link-hover">
            Home
          </Link>
          <Link to="/products/overcomer-i" className="text-sm font-medium link-hover">
            Overcomer I
          </Link>
          <Link to="/products/overcomer-ii" className="text-sm font-medium link-hover">
            Overcomer II
          </Link>
          <a 
            href="mailto:contact@overcomerpoolcue.com" 
            className="btn-primary text-sm py-2"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-10 p-2 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 bg-white flex flex-col items-center justify-center space-y-8 transition-all duration-300 ${
            isMenuOpen 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-full pointer-events-none'
          } md:hidden`}
        >
          <Link 
            to="/" 
            className="text-xl font-medium" 
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products/overcomer-i" 
            className="text-xl font-medium" 
            onClick={() => setIsMenuOpen(false)}
          >
            Overcomer I
          </Link>
          <Link 
            to="/products/overcomer-ii" 
            className="text-xl font-medium" 
            onClick={() => setIsMenuOpen(false)}
          >
            Overcomer II
          </Link>
          <a 
            href="mailto:contact@overcomerpoolcue.com" 
            className="btn-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
