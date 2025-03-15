
import { Check } from 'lucide-react';

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="feature-card">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-overcomer/10 text-overcomer mb-4">
      <Check size={24} />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      title: "Premium Materials",
      description: "Every Overcomer cue is crafted from top-tier maple and premium hardwoods, ensuring both beauty and performance."
    },
    {
      title: "Professional Balance",
      description: "Engineered with perfect weight distribution for optimal control and power transfer on every shot."
    },
    {
      title: "Master Craftsmanship",
      description: "Each cue receives meticulous attention to detail, with precision-engineered components and hand-finishing."
    },
    {
      title: "Superior Technology",
      description: "Incorporating advanced ferrules, premium tips, and precision-cut joints for exceptional performance."
    },
    {
      title: "Performance Tested",
      description: "Every cue undergoes rigorous testing to ensure straightness, balance, and shot consistency."
    },
    {
      title: "Lifetime Warranty",
      description: "We stand behind our craftsmanship with a comprehensive warranty against manufacturing defects."
    }
  ];

  return (
    <section className="section bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Why Choose Overcomer</h2>
        <p className="section-subtitle">
          The perfect fusion of timeless craftsmanship and modern engineering
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
