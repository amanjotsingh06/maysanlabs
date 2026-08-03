import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)

import { createClient } from '@sanity/client'
import { blogPosts } from '../src/data/blog'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in environment variables.")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-31',
  useCdn: false,
  token,
})

async function migrate() {
  console.log(`Starting migration of ${blogPosts.length} posts...`)
  
  for (const post of blogPosts) {
    try {
      const doc = {
        _type: 'post',
        title: post.title,
        slug: { _type: 'slug', current: post.slug },
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        tags: post.tags || [],
        featured: post.featured || false,
        externalUrl: post.externalUrl || '',
        draft: post.draft || false,
      }
      
      const result = await client.create(doc)
      console.log(`Created post: ${result.title} (${result._id})`)
    } catch (err) {
      console.error(`Failed to create post ${post.slug}:`, err)
    }
  }
  console.log("Migration complete!")
}

migrate()
