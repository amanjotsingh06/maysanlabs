import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://maysanlabs.com/architecture",
  },
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
