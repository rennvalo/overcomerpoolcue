import { Link } from 'react-router-dom';

export default function Footer() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-black border-t border-overcomer-dark/40 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-xl tracking-[0.2em] text-overcomer-light mb-3">
              OVERCOMER
            </h3>
            <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
              Precision-crafted pool cues designed for champions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-overcomer mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Products', id: 'products' },
                { label: 'Testimonials', id: 'testimonials' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={(e) => handleAnchorClick(e, item.id)}
                    className="font-montserrat text-sm text-muted-foreground hover:text-overcomer-light transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:info@overcomerpoolcue.com"
                  className="font-montserrat text-sm text-muted-foreground hover:text-overcomer-light transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-overcomer mb-4">
              Contact
            </h4>
            <a
              href="mailto:support@overcomerpoolcue.com"
              className="font-montserrat text-sm text-muted-foreground hover:text-overcomer-light transition-colors"
            >
              support@overcomerpoolcue.com
            </a>
          </div>
        </div>

        <div className="border-t border-overcomer-dark/30 pt-6 text-center">
          <p className="font-montserrat text-xs text-muted-foreground tracking-wider">
            &copy; 2025 Overcomer Pool Cues. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
