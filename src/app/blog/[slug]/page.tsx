import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/sanity/lib/queries";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import ReadingProgress from "@/components/tracking/reading-progress";
import ShareArticle from "@/components/blog/share-article";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { SafeLink } from "@/components/ui/SafeLink";
import { Metadata } from "next";
import { generateBlogPostSEO, generateBlogPostJSONLD } from "@/seo/helpers";
import CaseStudyCallout from "@/components/blog/case-study-callout";
import Newsletter from "@/components/marketing/newsletter";

export const revalidate = 3600;
export const dynamicParams = true;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const catStyles: Record<string, { bg: string; text: string; dot: string }> = {
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

function getCatStyle(category: string) {
  return catStyles[category] || { bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-500" };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maysanlabs.com";
  return generateBlogPostSEO(post, siteUrl);
}

export async function generateStaticParams() {
  const blogPosts = await getAllPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blogPosts = await getAllPosts();
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug && (p.category || "Uncategorized") === (post.category || "Uncategorized")).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maysanlabs.com";
  const blogJSONLD = generateBlogPostJSONLD(post, siteUrl);
  const style = getCatStyle(post.category || "Uncategorized");

  const shareUrl = `${siteUrl}/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <ReadingProgress />
      <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col relative">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJSONLD) }} />
        <Navbar />

        <section className="pt-28 pb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />
          <div className="container-main relative max-w-3xl mx-auto px-4 sm:px-6">
            <SafeLink
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/30 hover:text-brand-primary transition-colors mb-6 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to articles
            </SafeLink>

            <header>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {post.category || "Uncategorized"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-foreground/35">
                  <Clock size={12} />
                  {post.readTime || ""} read
                </span>
              </div>

              <h1 className="text-[28px] sm:text-4xl lg:text-[42px] font-semibold text-foreground mb-4 leading-[1.15] tracking-tight">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-foreground/50 leading-relaxed mb-6">
                {post.excerpt || ""}
              </p>

              <div className="flex items-center gap-4 pt-5 border-t border-gray-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[10px] sm:text-xs font-bold border border-brand-primary/15">
                    {getInitials(post.author || "Unknown")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/70">{post.author || "Unknown"}</p>
                    <time className="text-xs text-foreground/35" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </time>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </section>

        <section className="py-6 pb-16 md:pb-24">
          <div className="container-main max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex gap-10">
              <div className="hidden lg:flex flex-col items-center gap-3 sticky top-24 self-start pt-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/15 [writing-mode:vertical-lr] mb-1">Share</span>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="w-9 h-9 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center text-foreground/30 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all text-[11px] font-bold">
                  X
                </a>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center text-foreground/30 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all text-[11px] font-bold">
                  in
                </a>
                <ShareArticle url={shareUrl} title={post.title} variant="desktop" />
              </div>

              <article className="flex-1 min-w-0">
                <div className="prose-custom bg-white/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl p-6 sm:p-8 md:p-10">
                  {(post.content || "").split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-[15px] sm:text-[17px] text-foreground/70 leading-[1.8] mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <SafeLink key={tag} href="/blog" className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] text-foreground/45 hover:text-brand-primary hover:border-brand-primary/20 transition-colors">
                        #{tag}
                      </SafeLink>
                    ))}
                  </div>
                )}

                <CaseStudyCallout blogCategory={post.category || "Uncategorized"} />

                <div className="mt-6 lg:hidden">
                  <p className="text-xs text-foreground/30 mb-3">Share this article</p>
                  <div className="flex items-center gap-2">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="w-9 h-9 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center text-foreground/30 hover:text-brand-primary hover:border-brand-primary/30 transition-all text-[11px] font-bold">
                      X
                    </a>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center text-foreground/30 hover:text-brand-primary hover:border-brand-primary/30 transition-all text-[11px] font-bold">
                      in
                    </a>
                    <ShareArticle url={shareUrl} title={post.title} />
                  </div>
                </div>

                <div className="mt-10 mb-10 bg-white/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-primary/10 flex-shrink-0 flex items-center justify-center text-brand-primary text-sm sm:text-lg font-bold border border-brand-primary/20">
                    {getInitials(post.author || "Unknown")}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">About {post.author || "Unknown"}</h3>
                    <p className="text-[13px] sm:text-sm text-foreground/60 leading-relaxed mb-3">
                      {post.author || "Unknown"} is a technology expert at Maysan Labs specializing in {(post.category || "Uncategorized").toLowerCase()} and building scalable software solutions for growing businesses.
                    </p>
                    <a href="https://www.linkedin.com/company/maysanlabs" target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-brand-primary hover:underline inline-flex items-center gap-1">
                      Connect on LinkedIn <ArrowRight size={12} />
                    </a>
                  </div>
                </div>

                <div className="mt-10 bg-gradient-to-br from-brand-primary/[0.06] to-transparent border border-brand-primary/15 rounded-xl p-6 sm:p-8 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Ready to build something great?</h3>
                  <p className="text-sm text-foreground/40 mb-5 max-w-sm mx-auto">Let&apos;s discuss your project. Our team is ready to help.</p>
                  <SafeLink href="/start" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90 hover:shadow-[0_0_20px_rgba(26,109,214,0.3)] transition-all">
                    Start a project <ArrowRight size={14} />
                  </SafeLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-12 border-t border-gray-100 dark:border-white/[0.04]">
            <div className="container-main max-w-5xl mx-auto px-4 sm:px-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => {
                  const rpStyle = getCatStyle(rp.category || "Uncategorized");
                  return (
                    <SafeLink key={rp.slug} href={`/blog/${rp.slug}`} className="group bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5 transition-all duration-200 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-0.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${rpStyle.bg} ${rpStyle.text} mb-2.5`}>
                        <span className={`w-1 h-1 rounded-full ${rpStyle.dot}`} />
                        {rp.category || "Uncategorized"}
                      </span>
                      <h4 className="text-sm font-medium text-foreground group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                        {rp.title}
                      </h4>
                      <p className="text-xs text-foreground/35 mt-2 line-clamp-2">{rp.excerpt || ""}</p>
                    </SafeLink>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {(prevPost || nextPost) && (
          <section className="py-10 border-t border-gray-100 dark:border-white/[0.04]">
            <div className="container-main max-w-5xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <SafeLink href={`/blog/${prevPost.slug}`} className="group bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5 transition-all duration-200 hover:border-brand-primary/20 hover:shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/30 mb-2">
                      <ArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
                      Previous article
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">{prevPost.title}</p>
                  </SafeLink>
                ) : <div />}
                {nextPost && (
                  <SafeLink href={`/blog/${nextPost.slug}`} className="group bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5 transition-all duration-200 hover:border-brand-primary/20 hover:shadow-sm sm:text-right">
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/30 mb-2 sm:justify-end">
                      Next article
                      <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">{nextPost.title}</p>
                  </SafeLink>
                )}
              </div>
            </div>
          </section>
        )}

        <Newsletter />
        <ContactFooter />
      </main>
    </>
  );
}
