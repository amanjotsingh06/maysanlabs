import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { blogPosts } from '@/data/blog'
import { caseStudies } from '@/data/case-studies'
import { seoLandingPages } from '@/data/seo-landing'

const BASE_URL = 'https://maysanlabs.com'

// Pages that should be excluded from the sitemap
const EXCLUDED_ROUTES = new Set(['/_not-found', '/global-error', '/error', '/careers/apply'])

const ROUTE_CONFIG: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = {
  '/':             { priority: 1.0, changeFrequency: 'weekly' },
  '/services':     { priority: 0.9, changeFrequency: 'weekly' },
  '/about':        { priority: 0.8, changeFrequency: 'monthly' },
  '/architecture': { priority: 0.7, changeFrequency: 'monthly' },
  '/blog':         { priority: 0.8, changeFrequency: 'daily' },
  '/insights':     { priority: 0.7, changeFrequency: 'weekly' },
  '/case-studies': { priority: 0.9, changeFrequency: 'weekly' },
  '/careers':      { priority: 0.7, changeFrequency: 'weekly' },
  '/products':     { priority: 0.9, changeFrequency: 'weekly' },
  '/products/edu-maysan': { priority: 0.8, changeFrequency: 'monthly' },
  '/products/flash-fashion': { priority: 0.8, changeFrequency: 'monthly' },
  '/products/maysanmails': { priority: 0.8, changeFrequency: 'monthly' },
  '/pricing':      { priority: 0.8, changeFrequency: 'weekly' },
  '/privacy':      { priority: 0.3, changeFrequency: 'yearly' },
  '/terms':        { priority: 0.3, changeFrequency: 'yearly' },
  '/contact':      { priority: 0.7, changeFrequency: 'monthly' },
  '/start':        { priority: 0.8, changeFrequency: 'weekly' },
  '/tools': { priority: 0.8, changeFrequency: 'weekly' },
  '/tools/site-checker': { priority: 0.8, changeFrequency: 'weekly' },
  '/tools/headless-roi': { priority: 0.7, changeFrequency: 'weekly' },
  '/tools/scope-estimator': { priority: 0.7, changeFrequency: 'weekly' },
  '/tools/privacy-generator': { priority: 0.6, changeFrequency: 'monthly' },
  '/tools/og-generator': { priority: 0.6, changeFrequency: 'monthly' },
  '/tools/image-compressor': { priority: 0.6, changeFrequency: 'monthly' },
  '/services/web': { priority: 0.8, changeFrequency: 'weekly' },
  '/services/cloud': { priority: 0.8, changeFrequency: 'weekly' },
  '/services/ai': { priority: 0.8, changeFrequency: 'weekly' },
}

const DEFAULT_CONFIG = { priority: 0.6, changeFrequency: 'monthly' as const }

// Map routes to their layout/data dependency files so their lastmod updates automatically
const ROUTE_DEPENDENCIES: Record<string, string[]> = {
  '/': ['src/app/page.tsx', 'src/app/layout.tsx', 'next.config.js'],
  '/careers': ['src/app/careers/page.tsx', 'src/app/careers/layout.tsx', 'src/data/careers.ts', 'src/app/layout.tsx'],
  '/blog': ['src/app/blog/page.tsx', 'src/data/blog.ts', 'src/app/layout.tsx'],
  '/case-studies': ['src/app/case-studies/page.tsx', 'src/data/case-studies.ts', 'src/app/layout.tsx'],
  '/services': ['src/app/services/page.tsx', 'src/app/layout.tsx'],
  '/products': ['src/app/products/page.tsx', 'src/app/layout.tsx'],
  '/about': ['src/app/about/page.tsx', 'src/app/layout.tsx'],
  '/architecture': ['src/app/architecture/page.tsx', 'src/app/layout.tsx'],
  '/insights': ['src/app/insights/page.tsx', 'src/app/layout.tsx'],
  '/pricing': ['src/app/pricing/page.tsx', 'src/app/layout.tsx'],
  '/contact': ['src/app/contact/page.tsx', 'src/app/layout.tsx'],
  '/start': ['src/app/start/page.tsx', 'src/app/layout.tsx'],
  '/tools': ['src/app/tools/page.tsx', 'src/app/layout.tsx'],
  '/services/web': ['src/app/services/web/page.tsx', 'src/app/layout.tsx'],
  '/services/cloud': ['src/app/services/cloud/page.tsx', 'src/app/layout.tsx'],
  '/services/ai': ['src/app/services/ai/page.tsx', 'src/app/layout.tsx'],
}

// Get the latest modification time from a list of files
function getMaxMTime(filePaths: string[]): Date | undefined {
  let maxTime: Date | undefined
  for (const filePath of filePaths) {
    try {
      const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath)
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath)
        if (!maxTime || stat.mtime > maxTime) {
          maxTime = stat.mtime
        }
      }
    } catch {
      // Ignore errors for missing files
    }
  }
  return maxTime
}

/**
 * Recursively discovers all page.tsx files under src/app
 * and returns their routes with real file modification times.
 */
function discoverRoutes(dir: string, basePath: string = ''): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  let items: fs.Dirent[]
  try {
    items = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return entries
  }

  // Check if this directory has a page.tsx (i.e., it's a route)
  const pageFile = items.find(
    (item) => item.isFile() && (item.name === 'page.tsx' || item.name === 'page.ts' || item.name === 'page.jsx' || item.name === 'page.js')
  )

  if (pageFile) {
    const route = basePath || '/'
    if (!EXCLUDED_ROUTES.has(route)) {
      const filePath = path.join(dir, pageFile.name)
      const relPagePath = path.relative(process.cwd(), filePath)
      const config = ROUTE_CONFIG[route] || DEFAULT_CONFIG

      // Calculate lastModified based on the page itself and any layouts or data files it depends on
      const deps = ROUTE_DEPENDENCIES[route] || [relPagePath, 'src/app/layout.tsx']
      const lastModDate = getMaxMTime(deps) || fs.statSync(filePath).mtime

      entries.push({
        url: `${BASE_URL}${route}`,
        lastModified: lastModDate,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      })
    }
  }

  // Recurse into subdirectories (skip special Next.js dirs)
  for (const item of items) {
    if (
      item.isDirectory() &&
      !item.name.startsWith('_') &&
      !item.name.startsWith('.') &&
      !item.name.startsWith('(') && // route groups
      !item.name.includes('[') &&
      !item.name.includes(']') &&
      item.name !== 'api' &&
      item.name !== 'actions'
    ) {
      const subRoutes = discoverRoutes(
        path.join(dir, item.name),
        `${basePath}/${item.name}`
      )
      entries.push(...subRoutes)
    }
  }

  return entries
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const routes = discoverRoutes(appDir)

  // Add dynamic blog routes
  blogPosts.filter(post => !post.draft).forEach(post => {
    routes.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // Add case study routes with images
  caseStudies.forEach(study => {
    routes.push({
      url: `${BASE_URL}/case-studies/${study.slug}`,
      lastModified: new Date(study.year),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${BASE_URL}/og-image.webp`],
    })
  })

  // Add product routes with images
  const productRoutes = [
    { slug: 'flash-fashion', name: 'Maysan Shop', lastmod: new Date('2025-01-01') },
    { slug: 'edu-maysan', name: 'Edu-Maysan', lastmod: new Date('2025-01-01') },
    { slug: 'maysanmails', name: 'MaysanMails', lastmod: new Date('2025-01-01') },
  ]
  productRoutes.forEach(p => {
    routes.push({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.lastmod,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${BASE_URL}/og-image.webp`],
    })
  })

  // Add programmatic hire landing pages (supports hundreds of location/role pages)
  const SLUG_BATCH_SIZE = 100;
  const hireSlugs = seoLandingPages.map(p => p.slug);
  for (let i = 0; i < hireSlugs.length; i += SLUG_BATCH_SIZE) {
    const batch = hireSlugs.slice(i, i + SLUG_BATCH_SIZE);
    batch.forEach(slug => {
      routes.push({
        url: `${BASE_URL}/hire/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  }

  // Sort by priority descending for cleaner output
  routes.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

  return routes
}
