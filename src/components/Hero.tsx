export default function Hero() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1208] pointer-events-none" />
      {/* Gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-overcomer to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="font-montserrat text-xs tracking-[0.4em] uppercase text-overcomer mb-6 animate-fade-in">
          Precision Engineering · Carbon Fiber Excellence
        </p>
        <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white leading-tight mb-6 animate-fade-up">
          Precision-Crafted<br />
          <span className="text-overcomer-light">Pool Cues</span>
        </h1>
        <p className="font-montserrat text-base md:text-lg text-foreground/60 max-w-xl mx-auto mb-10 animate-fade-up">
          Experience the perfect balance of performance and elegance with our premium handcrafted cues
        </p>
        <a
          href="#products"
          onClick={handleClick}
          className="btn-primary animate-fade-up"
        >
          Explore Our Cues
        </a>
      </div>
    </section>
  );
}
