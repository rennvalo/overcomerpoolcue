
import { useState } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The Overcomer I has completely transformed my game. The balance and feel are simply unmatched by any cue I've used before.",
    author: "Michael Thornton",
    title: "Professional Pool Player"
  },
  {
    quote: "After switching to the Overcomer II with its low-deflection technology, my accuracy on english shots improved dramatically. Worth every penny.",
    author: "Sarah Williams",
    title: "State Champion"
  },
  {
    quote: "Not only is my Overcomer cue a beautiful piece of craftsmanship, but it delivers exceptional performance night after night.",
    author: "David Chen",
    title: "Tournament Director"
  }
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section bg-overcomer text-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Players Are Saying</h2>
          <div className="w-20 h-1 bg-white/30 mx-auto"></div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <blockquote className="text-center">
                    <p className="text-xl md:text-2xl font-playfair italic mb-8">
                      "{testimonial.quote}"
                    </p>
                    <footer>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-white/70">{testimonial.title}</p>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-white scale-125' : 'bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
