import { getAllPosts } from '@/sanity/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://maysanlabs.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const blogPosts = await getAllPosts();
  const items = blogPosts
    .map(
      (post) => {
        const cats = post.tags?.length ? post.tags : [post.category];
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
      ${cats.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <source url="${SITE_URL}/blog/rss.xml">Maysan Labs Blog</source>
    </item>`;
      },
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Maysan Labs Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Engineering insights on AI, infrastructure, and modern software architecture from Maysan Labs.</description>
    <language>en</language>
    <lastBuildDate>${new Date(blogPosts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${SITE_URL}" rel="alternate" type="text/html"/>
    <managingEditor>business@maysanlabs.com (Maysan Labs)</managingEditor>
    <webMaster>business@maysanlabs.com (Maysan Labs)</webMaster>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
