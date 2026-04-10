import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-montserrat text-xs tracking-[0.4em] uppercase text-overcomer mb-4">
          Error
        </p>
        <h1 className="font-playfair text-8xl md:text-9xl font-semibold text-white mb-4">
          404
        </h1>
        <div className="w-16 h-px bg-overcomer mx-auto mb-6" />
        <p className="font-montserrat text-base text-muted-foreground mb-10">
          Oops! Page not found
        </p>
        <Link to="/" className="btn-primary">
          Return to Home
        </Link>
      </div>
    </main>
  );
}
