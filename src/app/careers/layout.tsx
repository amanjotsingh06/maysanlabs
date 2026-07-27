import { Metadata } from "next";
import { jobPositions } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Maysan Labs and build high-performance enterprise SaaS infrastructure. Explore open roles in engineering, design, and marketing at Maysan Labs in Gurgaon, India.",
  keywords: [
    "Maysan Labs careers",
    "maysanlabs jobs",
    "Maysan Labs hiring",
    "SaaS careers Gurgaon",
    "software engineering jobs Gurgaon",
    "remote engineering jobs",
    "Maysan Labs Gurgaon careers",
  ],
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jobPostingSchema = jobPositions.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: "2024-03-20",
    validThrough: "2025-03-20",
    employmentType:
      job.type === "Full-time"
        ? "FULL_TIME"
        : job.type === "Internship"
          ? "INTERN"
          : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "Maysan Labs",
      sameAs: "https://maysanlabs.com",
      logo: "https://maysanlabs.com/favicon-v2.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.includes("Gurgaon")
          ? "Gurgaon"
          : "Remote",
        addressCountry: "IN",
      },
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingSchema),
        }}
      />
      {children}
    </>
  );
}
