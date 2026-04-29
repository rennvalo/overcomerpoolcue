import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Author {
  first_name: string;
  last_name: string;
  occupation?: string;
  bio?: string;
}

interface BlogPostDetail {
  id: number;
  title: string;
  slug: string;
  body: string;
  meta_description?: string;
  featured_image?: string;
  category?: string;
  author?: Author;
  created_at: string;
  updated_at: string;
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

async function fetchPost(slug: string): Promise<BlogPostDetail> {
  const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
  if (res.status === 404) throw new Error('NOT_FOUND');
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPost(slug!),
    enabled: !!slug,
    staleTime: 300_000,
    retry: (_, err: Error) => err.message !== 'NOT_FOUND',
  });

  // Set document title and meta description for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Overcomer Pool Cue`;
      const existing = document.querySelector('meta[name="description"]');
      if (post.meta_description) {
        if (existing) {
          existing.setAttribute('content', post.meta_description);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = post.meta_description;
          document.head.appendChild(meta);
        }
      }
    }
    return () => {
      document.title = 'Overcomer Pool Cue';
    };
  }, [post]);

  // Redirect on 404
  useEffect(() => {
    if (isError && (error as Error)?.message === 'NOT_FOUND') {
      navigate('/blog', { replace: true });
    }
  }, [isError, error, navigate]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-20">
        {isLoading && (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-overcomer-light border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && !((error as Error)?.message === 'NOT_FOUND') && (
          <div className="max-w-3xl mx-auto px-6 py-32 text-center">
            <p className="font-montserrat text-foreground/40 text-sm">
              Could not load this article. Please try again later.
            </p>
            <Link to="/blog" className="mt-6 inline-block font-montserrat text-xs tracking-widest uppercase text-overcomer-light hover:underline">
              ← Back to Blog
            </Link>
          </div>
        )}

        {post && (
          <>
            {/* Hero / featured image */}
            {post.featured_image && (
              <div className="w-full max-h-[480px] overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <article className="max-w-3xl mx-auto px-6 py-14">
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center gap-2 font-montserrat text-[11px] tracking-widest uppercase text-foreground/30">
                <Link to="/" className="hover:text-overcomer-light transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-overcomer-light transition-colors">Blog</Link>
                {post.category && (
                  <>
                    <span>/</span>
                    <span className="text-overcomer-light">{CATEGORY_LABELS[post.category] ?? post.category}</span>
                  </>
                )}
              </nav>

              {/* Category badge */}
              {post.category && (
                <span className="inline-block font-montserrat text-[10px] tracking-[0.3em] uppercase text-overcomer-light border border-overcomer-light/30 px-3 py-1 mb-6">
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </span>
              )}

              {/* Title */}
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 pb-8 border-b border-overcomer-dark/30">
                {post.author && (
                  <span className="font-montserrat text-xs text-foreground/50">
                    By{' '}
                    <strong className="text-foreground/70">
                      {post.author.first_name} {post.author.last_name}
                    </strong>
                    {post.author.occupation && (
                      <span className="text-foreground/30"> — {post.author.occupation}</span>
                    )}
                  </span>
                )}
                <span className="font-montserrat text-xs text-foreground/30">
                  {formatDate(post.created_at)}
                </span>
              </div>

              {/* Article body */}
              <div className="prose prose-invert prose-overcomer max-w-none
                prose-headings:font-playfair prose-headings:font-semibold
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-3
                prose-p:font-montserrat prose-p:text-sm prose-p:leading-7 prose-p:text-foreground/75
                prose-li:font-montserrat prose-li:text-sm prose-li:text-foreground/75
                prose-strong:text-white
                prose-a:text-overcomer-light prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-overcomer-light prose-blockquote:text-foreground/50
                prose-hr:border-overcomer-dark/40
              ">
                <ReactMarkdown>{post.body}</ReactMarkdown>
              </div>

              {/* Author bio card */}
              {post.author?.bio && (
                <div className="mt-14 p-6 border border-overcomer-dark/40 bg-white/[0.02]">
                  <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-overcomer-light mb-3">
                    About the Author
                  </p>
                  <p className="font-montserrat text-sm font-semibold text-white mb-2">
                    {post.author.first_name} {post.author.last_name}
                    {post.author.occupation && (
                      <span className="font-normal text-foreground/40 ml-2">— {post.author.occupation}</span>
                    )}
                  </p>
                  <p className="font-montserrat text-xs text-foreground/50 leading-relaxed">
                    {post.author.bio}
                  </p>
                </div>
              )}

              {/* Back link */}
              <div className="mt-12 pt-8 border-t border-overcomer-dark/30">
                <Link
                  to="/blog"
                  className="font-montserrat text-xs tracking-widest uppercase text-overcomer-light hover:underline"
                >
                  ← Back to Blog
                </Link>
              </div>
            </article>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
