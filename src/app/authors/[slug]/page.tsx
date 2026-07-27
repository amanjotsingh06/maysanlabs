import { authors } from "@/data/authors";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import { blogPosts } from "@/data/blog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return authors.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find(a => a.slug === slug);
  if (!author) return { title: "Author Not Found" };
  return {
    title: `${author.name} | Authors`,
    description: author.bio,
    openGraph: {
      title: `${author.name} - ${author.role} at Maysan Labs`,
      description: author.bio,
      siteName: "Maysan Labs",
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} | Authors | Maysan Labs`,
      description: author.bio,
      creator: "@maysanlabs",
    },
    alternates: {
      canonical: `https://maysanlabs.com/authors/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = authors.find(a => a.slug === slug);
  if (!author) notFound();

  const posts = blogPosts.filter(
    p => p.author.toLowerCase().replace(/\s+/g, "-") === slug
  );

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-primary/[0.04] blur-[100px] rounded-full pointer-events-none" />
        <div className="container-main relative">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-foreground/30 hover:text-brand-primary transition-colors mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to blog
          </Link>

          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-lg font-bold border border-brand-primary/15">
              {author.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{author.name}</h1>
              <p className="text-sm text-foreground/45 mt-0.5">{author.role}</p>
            </div>
          </div>

          <p className="text-base text-foreground/50 leading-relaxed max-w-2xl mb-8">{author.bio}</p>

          {author.linkedin || author.twitter || author.github ? (
            <div className="flex items-center gap-3 mb-10">
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/40 hover:text-brand-primary transition-colors">LinkedIn</a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/40 hover:text-brand-primary transition-colors">Twitter</a>
              )}
              {author.github && (
                <a href={author.github} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/40 hover:text-brand-primary transition-colors">GitHub</a>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="container-main">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-6">
              Articles by {author.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-5 transition-all duration-200 hover:border-brand-primary/20 hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="text-[15px] font-semibold text-foreground group-hover:text-brand-primary transition-colors mb-1.5">{post.title}</h3>
                  <p className="text-sm text-foreground/50 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-foreground/30">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <time>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactFooter />
    </main>
  );
}
