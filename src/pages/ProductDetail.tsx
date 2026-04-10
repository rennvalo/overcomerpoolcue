import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { getProductById } from '../data/products';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  const [mainImage, setMainImage] = useState<string | null>(null);

  if (!product) {
    return <NotFound />;
  }

  const displayImage = mainImage ?? product.mainImage;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-montserrat text-xs tracking-widest uppercase text-muted-foreground hover:text-overcomer-light transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div className="border border-overcomer-dark/40 bg-[#111] overflow-hidden">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-500"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(thumb)}
                    className={`border overflow-hidden transition-all duration-200 ${
                      displayImage === thumb
                        ? 'border-overcomer'
                        : 'border-overcomer-dark/40 hover:border-overcomer/50'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-5">
              <p className="font-montserrat text-xs tracking-[0.3em] uppercase text-overcomer">
                {product.tag}
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl text-white">{product.name}</h1>
              <p className="font-playfair text-3xl text-overcomer-light">{product.price}</p>

              <div className="h-px bg-overcomer-dark/40" />

              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              <div>
                <h3 className="font-playfair text-xl text-white mb-3">Key Features</h3>
                <ul className="flex flex-col gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-montserrat text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-overcomer rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart */}
              <a
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-primary w-full sm:w-auto flex items-center gap-3 mt-2">
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  Add to Cart
                </button>
              </a>

              {/* Specifications */}
              <div className="mt-4">
                <h3 className="font-playfair text-xl text-white mb-4">Specifications</h3>
                <div className="border border-overcomer-dark/40 divide-y divide-overcomer-dark/40">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between px-5 py-3">
                      <span className="font-montserrat text-xs font-medium tracking-wider uppercase text-muted-foreground">
                        {spec.label}
                      </span>
                      <span className="font-montserrat text-sm text-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
