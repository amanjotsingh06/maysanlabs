import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/seo/helpers";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";

const ogImage = (t: string, d?: string) =>
  `/api/og?title=${encodeURIComponent(t.slice(0, 100))}${d ? `&description=${encodeURIComponent(d.slice(0, 160))}` : ""}`;

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Maysan Labs Terms of Service — read the terms and conditions governing your use of our website, software development, and consulting services.",
  keywords: ["Maysan Labs terms of service", "terms and conditions", "software development terms", "Maysan Labs"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service",
    description: "Maysan Labs Terms of Service — terms and conditions for using our website and services.",
    url: "https://maysanlabs.com/terms",
    type: "website",
    siteName: "Maysan Labs",
    images: [{ url: ogImage("Terms of Service | Maysan Labs", "Terms and conditions for using Maysan Labs website and services."), width: 1200, height: 630, alt: "Terms of Service - Maysan Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description: "Maysan Labs Terms of Service — terms and conditions for using our website and services.",
    images: [ogImage("Terms of Service | Maysan Labs", "Terms and conditions for using Maysan Labs website and services.")],
    creator: "@maysanlabs",
    site: "@maysanlabs",
  },
  alternates: {
    canonical: "https://maysanlabs.com/terms",
    languages: { en: "https://maysanlabs.com/terms" },
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Terms of Service", url: "/terms" }
]);

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      {/* Brand Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container-main max-w-3xl relative pt-32 pb-20">
        <div className="card-glass rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/70">
          <p><strong>Last updated:</strong> May 2026</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using the Maysan Labs website and services, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">2. Services</h2>
          <p>Maysan Labs provides software development, consulting, and related services. Specific terms are outlined in individual service agreements.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">3. Intellectual Property</h2>
          <p>All content, trademarks, and intellectual property on this website are owned by Maysan Labs unless otherwise stated.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">4. Limitation of Liability</h2>
          <p>Maysan Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">5. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:business@maysanlabs.com" className="text-brand-primary hover:underline">business@maysanlabs.com</a>.</p>
        </div>
        </div>
      </div>
      <ContactFooter />
    </main>
  );
}

