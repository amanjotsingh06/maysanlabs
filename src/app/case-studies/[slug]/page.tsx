import CaseStudyDetailClient from "./CaseStudyDetailClient";
import { caseStudies } from "@/data/case-studies";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateCaseStudyJSONLD } from "@/seo/helpers";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

function ogImageUrl(title: string, description?: string): string {
  const t = encodeURIComponent(title.slice(0, 100));
  const d = description ? encodeURIComponent(description.slice(0, 160)) : "";
  return `/api/og?title=${t}${d ? `&description=${d}` : ""}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return { title: "Case Study Not Found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maysanlabs.com";
  const og = ogImageUrl(study.title, study.challenge);
  return {
    title: `${study.title} | Case Studies`,
    description: study.challenge,
    keywords: [study.title, study.category, study.client, "case study", "Maysan Labs"],
    openGraph: {
      title: study.title,
      description: study.challenge,
      url: `${siteUrl}/case-studies/${study.slug}`,
      type: "article",
      images: [{ url: og, width: 1200, height: 630, alt: study.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.challenge,
      images: [og],
    },
    alternates: { canonical: `${siteUrl}/case-studies/${study.slug}` },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const studyJSONLD = generateCaseStudyJSONLD(
    {
      title: study.title,
      slug: study.slug,
      excerpt: study.challenge,
      content: study.solution,
      date: study.year,
      client: study.client,
      industry: study.category,
      results: study.impact,
      technologies: study.technologies,
    },
    "https://maysanlabs.com"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(studyJSONLD),
        }}
      />
      <CaseStudyDetailClient study={study} />
    </>
  );
}


