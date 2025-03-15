
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 bg-texture-light">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-block animate-fade-up">
              <div className="px-4 py-1 rounded-full bg-overcomer/10 text-overcomer text-sm font-medium">
                Premium Craftsmanship
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up">
              Precision &amp; Excellence in Every Shot
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg animate-fade-up">
              Expertly crafted pool cues designed for players who demand the finest in performance, control, and elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
              <Link to="/products/overcomer-i" className="btn-primary inline-flex items-center group">
                Explore Overcomer I
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/products/overcomer-ii" className="btn-secondary inline-flex items-center group">
                View Overcomer II
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3]">
              <div className={`absolute inset-0 bg-gray-200 animate-pulse ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}></div>
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                alt="Premium Overcomer Pool Cue"
                className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
