import { safeFetch } from "@/core/security/ssrf";

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  published: string;
  category: string;
}

interface HNItem {
  title: string;
  url?: string;
  objectID: string;
  created_at: string;
}

interface HNResponse {
  hits?: HNItem[];
}

interface DevToArticle {
  title: string;
  url?: string;
  published_at?: string;
  tag_list?: string[];
}

export async function fetchTechNewsServer(): Promise<NewsItem[]> {
  try {
    const results = await Promise.allSettled([
      safeFetch('https://hn.algolia.com/api/v1/search?query=software+development&tags=story&hitsPerPage=8', {
        headers: { 'User-Agent': 'MaysanLabs-TechNews-Client' }
      })
        .then(r => r.json())
        .then((d: HNResponse) => d.hits?.map((h: HNItem) => ({
          title: h.title,
          source: 'Hacker News',
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          published: h.created_at,
          category: 'Technology'
        })) || []),
      safeFetch('https://dev.to/api/articles?tag=software&per_page=6', {
        headers: { 'User-Agent': 'MaysanLabs-TechNews-Client' }
      })
        .then(r => r.json())
        .then((d: DevToArticle[]) => d.map((a: DevToArticle) => ({
          title: a.title,
          source: 'Dev.to',
          url: a.url || 'https://dev.to',
          published: a.published_at || new Date().toISOString(),
          category: a.tag_list?.[0] || 'Development'
        })))
    ]);

    const items: NewsItem[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        items.push(...result.value);
      }
    }

    if (items.length > 0) {
      items.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      return items.slice(0, 20);
    }
  } catch (error) {
    console.error('Error fetching server-side news:', error);
  }
  return [
    { title: 'AI adoption accelerates in enterprise SaaS', source: 'TechCrunch', url: 'https://techcrunch.com', published: '2026-06-09T10:00:00Z', category: 'AI & ML' },
    { title: 'Next.js 16 introduces major performance improvements', source: 'Dev.to', url: 'https://dev.to', published: '2026-06-09T09:00:00Z', category: 'Performance' },
    { title: 'Cloud infrastructure costs rising — here\'s how to optimize', source: 'InfoQ', url: 'https://infoq.com', published: '2026-06-09T08:00:00Z', category: 'Infrastructure' },
  ];
}
