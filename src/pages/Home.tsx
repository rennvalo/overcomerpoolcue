import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductsSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
