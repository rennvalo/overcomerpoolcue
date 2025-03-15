
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { getProductById } from '@/lib/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";

const Product = () => {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  
  const product = id ? getProductById(id) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart`,
    });
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6 text-muted-foreground">The product you're looking for does not exist.</p>
          <Link to="/" className="btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="rounded-xl overflow-hidden bg-card shadow-md mb-4">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full object-cover aspect-[4/3]" 
                />
              </div>
              
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-overcomer/10 text-overcomer text-xs font-medium mb-4">
                Premium Pool Cue
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-medium text-overcomer mb-6">${product.price.toFixed(2)}</p>
              
              <div className="h-0.5 w-16 bg-muted mb-6"></div>
              
              <p className="text-muted-foreground mb-8">{product.fullDescription}</p>
              
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3 mb-8">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check size={20} className="text-overcomer flex-shrink-0 mr-3 mt-0.5" />
                    <div>
                      <span className="font-medium">{feature.title}</span>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleAddToCart}
                className="btn-primary inline-flex items-center"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="bg-card rounded-lg border p-4 space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-3 py-2 border-b last:border-0 border-muted">
                      <span className="text-muted-foreground">{spec.name}</span>
                      <span className="col-span-2">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </>
  );
};

export default Product;
