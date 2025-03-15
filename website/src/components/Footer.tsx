
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="font-playfair text-2xl font-bold text-overcomer">
              Overcomer
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Precision-crafted pool cues designed for superior performance, control and elegance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products/overcomer-i" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Overcomer I
                </Link>
              </li>
              <li>
                <Link to="/products/overcomer-ii" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Overcomer II
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@overcomerpoolcue.com" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Warranty
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-overcomer transition-colors">
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Overcomer Pool Cues. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Crafted with precision and excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
