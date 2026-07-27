import { NextResponse } from 'next/server';
import { safeFetch, assertSafeFetchUrl } from "@/core/security/ssrf";

const CRON_SECRET = process.env.CRON_SECRET;

interface ContentResult {
  source: string;
  count: number;
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!CRON_SECRET || !auth || auth !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maysanlabs.com';

  const contentSources = [
    { name: 'Dev.to', url: 'https://dev.to/api/articles?tag=software&per_page=5' },
    { name: 'Hacker News', url: 'https://hn.algolia.com/api/v1/search?query=software+development&tags=story&hitsPerPage=5' },
  ];

  const results = await Promise.allSettled(
    contentSources.map(async source => {
      const safeUrl = await assertSafeFetchUrl(source.url);
const res = await safeFetch(safeUrl.toString(), {
        headers: { 'User-Agent': 'MaysanLabs-ContentBot/1.0' },
      });
      if (!res.ok) throw new Error(`${source.name} returned ${res.status}`);
      const data = await res.json();
      return { source: source.name, count: Array.isArray(data) ? data.length : data.hits?.length || 0 };
    })
  );

  const freshContent = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<ContentResult>).value);

  const totalItems = freshContent.reduce((sum, s) => sum + s.count, 0);

  // Trigger rebuild notification via Vercel deploy hook if configured
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (deployHook) {
    try {
      await safeFetch(deployHook, { method: 'POST' });
    } catch {
      // Deploy hook notification is best-effort
    }
  }

  // Ping search engines
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  try {
    await Promise.allSettled([
      safeFetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
      safeFetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: new URL(siteUrl).host,
          key: process.env.INDEXNOW_KEY || '',
          keyLocation: `${siteUrl}/${process.env.INDEXNOW_KEY || ''}.txt`,
          urlList: [`${siteUrl}/`, `${siteUrl}/blog`, `${siteUrl}/sitemap.xml`],
        }),
      }),
    ]);
  } catch {
    // Search engine pings are best-effort
  }

  return NextResponse.json({
    success: true,
    message: `Content refresh triggered. ${totalItems} fresh items found.`,
    sources: freshContent,
    timestamp: new Date().toISOString(),
  });
}

export const dynamic = 'force-dynamic';