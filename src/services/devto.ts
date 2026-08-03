import { safeFetch } from "@/core/security/ssrf";
import { BlogPost } from "@/sanity/lib/queries";

interface DevToArticle {
  id: number;
  title: string;
  description?: string;
  published_at?: string;
  tag_list?: string[];
  reading_time_minutes?: number;
  url?: string;
  user?: {
    name: string;
  };
}

export async function fetchExternalTechBlogs(): Promise<BlogPost[]> {
  try {
    const res = await safeFetch("https://dev.to/api/articles?tag=technology&per_page=12", {
      headers: {
        "User-Agent": "MaysanLabs-TechNews-Client",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch from Dev.to API status:", res.status);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((article: DevToArticle) => {
      // Clean up tag names nicely
      const rawTag = article.tag_list && article.tag_list.length > 0 
        ? article.tag_list.find((t: string) => t.toLowerCase() !== "technology" && t.toLowerCase() !== "tech") || article.tag_list[0]
        : "Tech News";
      
      const category = rawTag.charAt(0).toUpperCase() + rawTag.slice(1);

      return {
        title: article.title,
        slug: `devto-${article.id}`,
        excerpt: article.description || "Click to read the full story on Dev.to.",
        content: article.description || "",
        date: article.published_at ? article.published_at.split("T")[0] : new Date().toISOString().split("T")[0],
        author: article.user ? article.user.name : "Tech Journalist",
        category: category,
        readTime: `${article.reading_time_minutes || 3} min`,
        externalUrl: article.url || "https://dev.to",
      };
    });
  } catch (error) {
    console.error("Error fetching automatically from Dev.to API:", error);
    return [];
  }
}
