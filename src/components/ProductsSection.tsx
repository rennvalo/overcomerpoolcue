import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="section-title">Our Signature Cues</h2>
        <p className="section-subtitle">
          Precision-crafted instruments designed for exceptional performance and elegant aesthetics
        </p>

        <div className="flex flex-col gap-20">
          {products.map((product, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <div
                key={product.id}
                className={`flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden border border-overcomer-dark/40 bg-[#111]">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-80 md:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {/* Shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-overcomer/5 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <p className="font-montserrat text-xs tracking-[0.3em] uppercase text-overcomer">
                    Premium Pool Cue
                  </p>
                  <h3 className="font-playfair text-4xl text-white">{product.name}</h3>
                  <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <p className="font-playfair text-2xl text-overcomer-light">{product.price}</p>
                  <div>
                    <Link to={`/product/${product.id}`} className="btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
