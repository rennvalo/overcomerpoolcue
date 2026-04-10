import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    quote:
      '"The Overcomer I has completely transformed my game. The balance and feel are unmatched, giving me confidence on every shot."',
    name: 'Michael R.',
    role: 'Professional Player',
  },
  {
    quote:
      '"As someone who takes pool seriously, investing in the Overcomer II was one of the best decisions I\'ve made. The craftsmanship is exceptional."',
    name: 'Renn V.',
    role: 'Amateur Competitor',
  },
  {
    quote:
      '"The attention to detail and quality of materials in my Overcomer cue are evident with every game. It\'s not just a tool, it\'s a work of art."',
    name: 'Miranda F.',
    role: 'Billiards Enthusiast',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonials" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="section-title">What Players Say</h2>
        <p className="section-subtitle">
          Feedback from professionals and enthusiasts who trust Overcomer cues
        </p>

        <div className="relative overflow-hidden min-h-[200px]">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ${
                i === active
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="border border-overcomer-dark/40 bg-[#0d0d0d] px-8 py-10 w-full">
                <p className="font-playfair text-lg md:text-xl text-white/80 italic leading-relaxed mb-6">
                  {t.quote}
                </p>
                <div className="w-10 h-px bg-overcomer mx-auto mb-4" />
                <h4 className="font-montserrat text-sm font-semibold tracking-widest uppercase text-overcomer-light">
                  {t.name}
                </h4>
                <p className="font-montserrat text-xs text-muted-foreground tracking-wider mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === active ? 'bg-overcomer w-6' : 'bg-overcomer/30 hover:bg-overcomer/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
