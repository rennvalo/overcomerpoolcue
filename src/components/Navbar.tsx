import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Products', href: '/#products' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 shadow-lg shadow-black/50' : 'bg-black/70'
      } backdrop-blur-sm border-b border-overcomer-dark/40`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-playfair text-xl font-semibold tracking-[0.25em] text-overcomer-light hover:text-white transition-colors"
        >
          OVERCOMER
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="font-montserrat text-xs font-medium tracking-widest uppercase text-foreground/70 hover:text-overcomer-light transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-overcomer-light transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-[6px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-overcomer-light transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-overcomer-light transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-black/95 border-t border-overcomer-dark/40 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="font-montserrat text-xs font-medium tracking-widest uppercase text-foreground/70 hover:text-overcomer-light transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
