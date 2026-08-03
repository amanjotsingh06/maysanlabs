import type { Metadata } from "next";

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  author?: string;
  category?: string;
  readTime?: string;
}

interface CaseStudy {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  client: string;
  industry: string;
  results: string[];
  technologies: string[];
}

interface ProductInfo {
  name: string;
  description: string;
  price: number;
  currency: string;
  url: string;
}

/**
 * Generate SEO metadata for blog posts
 */
function ogImageUrl(title: string, description?: string): string {
  const t = encodeURIComponent(title.slice(0, 100));
  const d = description ? encodeURIComponent(description.slice(0, 160)) : "";
  return `/api/og?title=${t}${d ? `&description=${d}` : ""}`;
}

export function generateBlogPostSEO(post: BlogPost, siteUrl: string): Metadata {
  const og = ogImageUrl(post.title, post.excerpt);
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || "",
    keywords: [
      post.title.toLowerCase(),
      (post.category || "Uncategorized").toLowerCase(),
      "Maysan Labs",
      "blog",
      "technology",
      "SaaS",
      "enterprise"
    ].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Unknown"],
      section: post.category || "Uncategorized",
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [og]
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`
    }
  };
}

/**
 * Generate JSON-LD for blog post
 */
export function generateBlogPostJSONLD(post: BlogPost, siteUrl: string) {
  const personName = post.author || "Unknown";
  const authorSlug = (post.author || "Unknown").toLowerCase().replace(/\s+/g, "-");
  const personUrl = `${siteUrl}/authors/${authorSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: [
      `${siteUrl}/og-image.png`
    ],
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category || "Uncategorized",
    author: {
      "@type": "Person",
      name: personName,
      url: personUrl,
      jobTitle: "Software Engineer & Architect",
      worksFor: {
        "@type": "Organization",
        name: "Maysan Labs"
      },
      sameAs: [
        "https://github.com/maysanlabs",
        "https://in.linkedin.com/company/maysanlabs"
      ],
      knowsAbout: [post.category || "Uncategorized", "Enterprise SaaS", "Software Development", "Cloud Architecture"]
    },
    publisher: {
      "@type": "Organization",
      name: "Maysan Labs",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.webp`
      }
    },
    url: `${siteUrl}/blog/${post.slug}`,
    section: post.category || "Uncategorized",
    keywords: [
      post.title,
      post.category || "Uncategorized",
      "Maysan Labs",
      "blog",
      "enterprise software",
      "SaaS"
    ].filter(Boolean),
    mainEntityOfPage: {
      "@type": "WebPage",
      id: `${siteUrl}/blog/${post.slug}`
    },
    about: {
      "@type": "Thing",
      name: post.category || "Uncategorized"
    },
    mentions: [
      { "@type": "Thing", name: "Enterprise SaaS" },
      { "@type": "Thing", name: "Software Development" }
    ]
  };
}

export function generateCaseStudyJSONLD(study: CaseStudy, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: study.title,
    description: study.excerpt,
    url: `${siteUrl}/case-studies/${study.slug}`,
    datePublished: study.date,
    author: {
      "@type": "Organization",
      name: "Maysan Labs"
    },
    about: {
      "@type": "Thing",
      name: study.industry
    },
    participant: [
      {
        "@type": "Organization",
        name: study.client
      }
    ],
    result: study.results.map(result => ({
      "@type": "QuantitativeValue",
      value: result
    })),
    keywords: [
      study.title,
      study.industry,
      study.client,
      "case study",
      "Maysan Labs"
    ].filter(Boolean)
  };
}

/**
 * Generate SEO metadata for product pages
 */
export function generateProductSEO(product: ProductInfo): Metadata {
  const og = ogImageUrl(product.name, product.description);

  return {
    title: `${product.name} | Products`,
    description: product.description,
    keywords: [
      product.name.toLowerCase(),
      "product",
      "SaaS",
      "software",
      "Maysan Labs"
    ].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.description,
      url: product.url,
      type: "website",
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [og]
    },
    alternates: {
      canonical: product.url
    }
  };
}

export interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  siteUrl?: string;
}

/**
 * Automatically generate pristine, fully optimized SEO Metadata for any page
 */
export function generatePageSEO({
  title,
  description,
  path,
  keywords = [],
  image,
  siteUrl = "https://maysanlabs.com"
}: PageSEOProps): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = cleanPath === "/" ? siteUrl : `${siteUrl}${cleanPath}`;
  const ogImg = image || ogImageUrl(title, description);
  
  const baseKeywords = [
    "Maysan Labs",
    "maysan labs",
    "maysanlabs",
    "Maysan Labs Gurugram",
    "enterprise software development firm",
    "B2B SaaS development company Gurgaon",
    "enterprise SaaS development company",
    "hire custom software developers India",
    "software outsourcing services Gurgaon",
    "dedicated software development team",
    "custom software development company",
    "custom web application development",
    "cloud-native application development",
    "MERN stack development",
    "React development company",
    "Node.js backend development",
    "full stack development services",
    "cloud infrastructure services",
    "enterprise software consulting",
    "React Native development company",
    "Next.js development company",
    "TypeScript development services",
    "API development services",
    "microservices development company",
    "DevOps consulting services",
    "enterprise mobile app development",
    "software product development company",
    "MVP development company",
    "SaaS product development company",
    "ERP software development company",
    "CRM development company",
    "eCommerce development company",
    "EdTech software development",
    "FinTech software development",
    "HealthTech software development",
    "AI integration services",
    "machine learning development company",
    "agile software development",
    "offshore software development team",
    "hire React developers",
    "hire Node.js developers",
    "hire full stack developers",
    "hire MERN stack developers",
    "hire Next.js developers",
  ];
  
  const combinedKeywords = Array.from(new Set([...keywords, ...baseKeywords]));

  return {
    metadataBase: new URL(siteUrl),
    title: title,
    description,
    keywords: combinedKeywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: fullUrl,
      siteName: "Maysan Labs",
      title: title,
      description,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: [ogImg],
      creator: "@maysanlabs",
      site: "@maysanlabs"
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        en: fullUrl,
      }
    },
    icons: {
      icon: [
        { url: "/favicon-v2.png" },
        { url: "/icon-192x192-v4.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512x512-v4.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon-v2.png",
      apple: [
        { url: "/icon-rounded-v2.png?v=100" },
        { url: "/icon-192x192-v4.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512x512-v4.png", sizes: "512x512", type: "image/png" },
      ],
    },
    manifest: "/manifest.json?v=100"
  };
}


/**
 * Generate all JSON-LD scripts for a page
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate FAQPage schema for rich snippets
 */
export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

/**
 * Generate HowTo schema for services/process pages
 */
export interface HowToStep {
  name: string;
  text: string;
}

/**
 * Generate JobPosting schema for careers page
 */
export interface JobDetails {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  location: string;
}

export function generateJobPostingSchema(job: JobDetails, siteUrl: string = "https://maysanlabs.com") {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.datePosted,
    "validThrough": job.validThrough,
    "employmentType": job.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Maysan Labs",
      "sameAs": siteUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gurgaon",
        "addressRegion": "Haryana",
        "addressCountry": "IN"
      }
    }
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[], siteUrl: string = "https://maysanlabs.com") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
}


