import { Check } from 'lucide-react';

const features = [
  {
    title: 'Premium Materials',
    description:
      'Every Overcomer cue is crafted from top-tier Carbon Fiber, ensuring both beauty and performance.',
  },
  {
    title: 'Professional Balance',
    description:
      'Engineered with perfect weight distribution for optimal control and power transfer on every shot.',
  },
  {
    title: 'Master Craftsmanship',
    description:
      'Each cue receives meticulous attention to detail, with precision-engineered components and hand-finishing.',
  },
  {
    title: 'Superior Technology',
    description:
      'Incorporating advanced ferrules, premium tips, and precision-cut joints for exceptional performance.',
  },
  {
    title: 'Performance Tested',
    description:
      'Every cue undergoes rigorous testing to ensure straightness, balance, and shot consistency.',
  },
  {
    title: 'Lifetime Warranty',
    description:
      'We stand behind our craftsmanship with a comprehensive warranty against manufacturing defects.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="section-title">Why Choose Overcomer</h2>
        <p className="section-subtitle">
          The perfect fusion of timeless craftsmanship and modern engineering
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group border border-overcomer-dark/40 bg-[#0d0d0d] p-8 flex flex-col gap-4 hover:border-overcomer/60 transition-colors duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center border border-overcomer/40 text-overcomer group-hover:bg-overcomer group-hover:text-white transition-all duration-300">
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h3 className="font-playfair text-xl text-white">{feature.title}</h3>
              <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
