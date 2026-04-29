import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Author {
  first_name: string;
  last_name: string;
  occupation?: string;
}

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  meta_description?: string;
  featured_image?: string;
  category?: string;
  author?: Author;
  created_at: string;
}

interface PaginatedResponse {
  items: BlogPostItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  pool_tips: 'Pool Tips',
  cue_technique: 'Cue Technique',
  success_story: 'Success Story',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchPosts(page: number, category?: string): Promise<PaginatedResponse> {
  const params = new URLSearchParams({ page: String(page), per_page: '9' });
  if (category) params.set('category', category);
  const res = await fetch(`/api/blog?${params}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', page, activeCategory],
    queryFn: () => fetchPosts(page, activeCategory),
    staleTime: 60_000,
  });

  const handleCategory = (cat?: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 mb-14 text-center">
          <p className="font-montserrat text-xs tracking-[0.3em] uppercase text-overcomer-light mb-3">
            The Overcomer Journal
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold mb-4">
            Pool &amp; Billiards Blog
          </h1>
          <p className="font-montserrat text-foreground/60 max-w-xl mx-auto text-sm leading-relaxed">
            Expert tips, cue techniques, and success stories to elevate your game.
          </p>
        </section>

        {/* Category filter */}
        <section className="max-w-7xl mx-auto px-6 mb-10 flex flex-wrap gap-3 justify-center">
          {[undefined, 'pool_tips', 'cue_technique', 'success_story'].map((cat) => (
            <button
              key={cat ?? 'all'}
              onClick={() => handleCategory(cat)}
              className={`font-montserrat text-xs tracking-widest uppercase px-5 py-2 border transition-colors ${
                activeCategory === cat
                  ? 'border-overcomer-light bg-overcomer-light/10 text-overcomer-light'
                  : 'border-overcomer-dark/50 text-foreground/50 hover:border-overcomer-light hover:text-overcomer-light'
              }`}
            >
              {cat ? CATEGORY_LABELS[cat] : 'All'}
            </button>
          ))}
        </section>

        {/* Posts grid */}
        <section className="max-w-7xl mx-auto px-6">
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-overcomer-light border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {isError && (
            <p className="text-center text-foreground/40 py-20 font-montserrat text-sm">
              Could not load articles. Please try again later.
            </p>
          )}

          {data && data.items.length === 0 && (
            <p className="text-center text-foreground/40 py-20 font-montserrat text-sm">
              No articles yet — check back soon.
            </p>
          )}

          {data && data.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {data.items.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white/[0.03] border border-overcomer-dark/30 hover:border-overcomer-light/40 transition-all duration-300"
                >
                  {/* Featured image */}
                  <div className="overflow-hidden aspect-[16/9] bg-overcomer-dark/20">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-overcomer-dark/60 text-4xl">🎱</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 gap-3">
                    {post.category && (
                      <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-overcomer-light">
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    )}

                    <h2 className="font-playfair text-lg font-semibold leading-snug group-hover:text-overcomer-light transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.meta_description && (
                      <p className="font-montserrat text-xs text-foreground/50 leading-relaxed line-clamp-3 flex-1">
                        {post.meta_description}
                      </p>
                    )}

                    {/* Author + date */}
                    <div className="flex items-center justify-between pt-3 border-t border-overcomer-dark/30 mt-auto">
                      {post.author ? (
                        <span className="font-montserrat text-[11px] text-foreground/40">
                          {post.author.first_name} {post.author.last_name}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="font-montserrat text-[11px] text-foreground/30">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-montserrat text-xs tracking-widest uppercase px-5 py-2 border border-overcomer-dark/50 text-foreground/50 hover:border-overcomer-light hover:text-overcomer-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="font-montserrat text-xs text-foreground/30 flex items-center px-4">
                {page} / {data.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="font-montserrat text-xs tracking-widest uppercase px-5 py-2 border border-overcomer-dark/50 text-foreground/50 hover:border-overcomer-light hover:text-overcomer-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
