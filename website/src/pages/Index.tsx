
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductCard from '@/components/ProductCard';
import TestimonialSection from '@/components/TestimonialSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/lib/products';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-transition">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="section bg-white">
          <div className="container mx-auto">
            <h2 className="section-title">Our Signature Cues</h2>
            <p className="section-subtitle">
              Precision-crafted instruments designed for exceptional performance and elegant aesthetics
            </p>
            
            <div className="space-y-24">
              <ProductCard product={products[0]} />
              <ProductCard product={products[1]} isReversed />
            </div>
          </div>
        </section>
        
        <Features />
        <TestimonialSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
