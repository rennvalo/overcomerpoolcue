
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isReversed?: boolean;
}

const ProductCard = ({ product, isReversed = false }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className={`grid grid-cols-1 ${isReversed ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'} gap-8 lg:gap-16 items-center`}>
      <div className={`order-2 ${isReversed ? 'lg:order-2' : 'lg:order-1'} animate-fade-up`}>
        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4]">
          <div className={`absolute inset-0 bg-gray-200 animate-pulse ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}></div>
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
      </div>
      
      <div className={`order-1 ${isReversed ? 'lg:order-1' : 'lg:order-2'} animate-fade-up`}>
        <div className="inline-block px-3 py-1 rounded-full bg-overcomer/10 text-overcomer text-xs font-medium mb-4">
          Premium Pool Cue
        </div>
        <h2 className="product-title">{product.name}</h2>
        <p className="product-description">{product.shortDescription}</p>
        
        <ul className="mb-8 space-y-3">
          {product.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-overcomer">•</span>
              <span className="text-sm text-gray-600">{feature.title}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex items-center gap-4">
          <Link 
            to={`/products/${product.id}`} 
            className="btn-primary inline-flex items-center group"
          >
            Explore
            <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
