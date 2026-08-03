"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ExternalLink, Clock, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/sanity/lib/queries";

const POSTS_PER_PAGE = 9;

interface BlogPageClientProps {
  localPosts: BlogPost[];
  externalPosts: BlogPost[];
}

const categoryAccents: Record<string, { bg: string; text: string; dot: string }> = {
  "Strategy":        { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
  "Infrastructure":  { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
  "Methodology":     { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
  "AI & ML":         { bg: "bg-orange-500/10", text: "text-orange-500", dot: "bg-orange-500" },
  "Security":        { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500" },
  "Performance":     { bg: "bg-cyan-500/10", text: "text-cyan-500", dot: "bg-cyan-500" },
  "Business":        { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
  "Architecture":    { bg: "bg-cyan-500/10", text: "text-cyan-500", dot: "bg-cyan-500" },
  "Design":          { bg: "bg-pink-500/10", text: "text-pink-500", dot: "bg-pink-500" },
  "Transformation":  { bg: "bg-teal-500/10", text: "text-teal-500", dot: "bg-teal-500" },
  "Insights":        { bg: "bg-slate-500/10", text: "text-slate-500", dot: "bg-slate-500" },
  "Optimization":    { bg: "bg-lime-500/10", text: "text-lime-500", dot: "bg-lime-500" },
};

function getAccent(category: string) {
  return categoryAccents[category] || { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-500" };
}

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function getCategories(posts: BlogPost[]) {
  const cats = new Set(posts.map(p => p.category));
  return ["all", ...Array.from(cats)];
}

function getRecentPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
}

function wrapCard(post: BlogPost, children: React.ReactNode) {
  if (post.externalUrl) {
    return <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="group block h-full">{children}</a>;
  }
  return <Link href={`/blog/${post.slug}`} className="group block h-full">{children}</Link>;
}

function PostCard({ post }: { post: BlogPost }) {
  const isExternal = !!post.externalUrl;
  const accent = getAccent(post.category);

  return wrapCard(post, (
    <article className="h-full bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:border-gray-200 dark:hover:border-white/10 hover:-translate-y-0.5 flex flex-col">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${accent.bg} ${accent.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-foreground/30">
            <Clock size={10} />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 group-hover:text-brand-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/[0.04]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 shrink-0 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[8px] font-bold">
              {getInitials(post.author)}
            </div>
            <span className="text-xs text-foreground/40 truncate">{post.author}</span>
          </div>
          {isExternal && (
            <span className="flex items-center gap-1 text-[10px] text-foreground/30 shrink-0">
              <ExternalLink size={10} />
              External
            </span>
          )}
        </div>
      </div>
    </article>
  ));
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const accent = getAccent(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-primary/[0.06] via-brand-primary/[0.02] to-transparent border border-brand-primary/15 hover:border-brand-primary/25 transition-all duration-300 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-56 h-56 bg-brand-primary/[0.06] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-primary/[0.03] rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${accent.bg} ${accent.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                {post.category}
              </span>
              <span className="text-[10px] text-foreground/30 flex items-center gap-1">
                <Clock size={10} />
                {post.readTime}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-brand-primary transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-sm text-foreground/50 leading-relaxed mb-4 max-w-lg">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-foreground/35">
              <span className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[7px] font-bold">{getInitials(post.author)}</span>
              {post.author}
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold group-hover:bg-brand-primary/90 group-hover:shadow-[0_0_20px_rgba(26,109,214,0.3)] transition-all">
              Read article
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPageClient({ localPosts, externalPosts }: BlogPageClientProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = useMemo(() => {
    const merged = [...localPosts];
    externalPosts.forEach((ep) => {
      if (!merged.find((p) => p.slug === ep.slug)) {
        merged.push(ep);
      }
    });
    return merged;
  }, [localPosts, externalPosts]);

  const featuredPost = useMemo(() => localPosts.find((p) => p.featured), [localPosts]);
  const categories = useMemo(() => getCategories(allPosts), [allPosts]);
  const recentPosts = useMemo(() => getRecentPosts(localPosts), [localPosts]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (categoryFilter !== "all") {
      posts = posts.filter((p) => p.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [allPosts, categoryFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(0, currentPage * POSTS_PER_PAGE);
  const hasMore = currentPage < totalPages;

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
      <div className="flex-1 min-w-0">
        {featuredPost && categoryFilter === "all" && !searchQuery.trim() && (
          <div className="mb-10">
            <FeaturedCard post={featuredPost} />
          </div>
        )}

        <div className="flex flex-col gap-4 mb-10">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search articles..."
              aria-label="Search articles"
              className="w-full bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-foreground/45 hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                {cat === "all" ? "All Posts" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-foreground/40 text-sm">
                {searchQuery.trim()
                  ? `No articles match "${searchQuery}"`
                  : "No posts found for this category."}
              </p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-6 py-2.5 bg-white/80 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-xl text-sm font-medium text-foreground/50 hover:text-foreground hover:border-brand-primary/30 hover:shadow-sm transition-all"
            >
              Load more articles
            </button>
          </div>
        )}
        {!hasMore && filteredPosts.length > POSTS_PER_PAGE && (
          <p className="mt-5 text-xs text-foreground/25 text-center">Showing all {filteredPosts.length} articles</p>
        )}
      </div>

      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {recentPosts.map((post) => {
              const accent = getAccent(post.category);
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className={`w-0.5 shrink-0 rounded-full opacity-40 group-hover:opacity-100 transition-opacity ${accent.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground/70 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-[10px] text-foreground/30 mt-1">{post.readTime} · {post.author}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Topics</h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.filter(c => c !== "all").map((cat) => {
              const accent = getAccent(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-brand-primary text-white"
                      : `${accent.bg} ${accent.text} hover:opacity-80`
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-primary/5 to-transparent border border-brand-primary/10 rounded-xl p-5 text-center">
          <h3 className="text-sm font-semibold text-foreground mb-2">Have a project in mind?</h3>
          <p className="text-xs text-foreground/40 mb-4">Let&apos;s talk about how we can help you grow.</p>
          <Link
            href="/start"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary/90 transition-all hover:shadow-[0_0_15px_rgba(26,109,214,0.25)]"
          >
            Get in touch <ChevronRight size={12} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
