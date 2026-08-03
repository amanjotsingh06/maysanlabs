import { getAllPosts } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export default async function LatestInsights() {
  const blogPosts = await getAllPosts();
  const latest = blogPosts
    .filter((post) => process.env.NODE_ENV !== "production" || !post.draft)
    .slice(0, 3);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="container-main relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="badge-section mb-4">
              Latest Insights
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
              Fresh thinking, delivered weekly
            </h2>
            <p className="text-foreground/60 text-sm md:text-base mt-2 max-w-xl">
              Practical guides and strategies for building better software and growing your business.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:gap-2 transition-all shrink-0"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-semibold">
                  {post.category}
                </span>
                <span className="text-[10px] text-foreground/30 flex items-center gap-1">
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-4 flex-1 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                <span className="text-[11px] text-foreground/40 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Read <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/60 hover:text-brand-primary bg-white/30 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] px-6 py-3 rounded-full hover:border-brand-primary/30 transition-all"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
