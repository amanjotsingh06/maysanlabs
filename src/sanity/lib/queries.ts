import { client } from './client'


export interface BlogPost {
  title: string
  slug: string
  excerpt?: string
  content?: string
  date: string
  author?: string
  category?: string
  readTime?: string
  tags?: string[]
  featured?: boolean
  externalUrl?: string
  draft?: boolean
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const query = `*[_type == "post"] | order(date desc) {
      title,
      "slug": slug.current,
      excerpt,
      content,
      date,
      author,
      category,
      readTime,
      tags,
      featured,
      externalUrl,
      draft
    }`
    const posts = await client.fetch(query)
    
    // If no posts are returned, return an empty array instead of failing
    if (!posts) return []
    
    // Filter out draft posts in production environments globally
    return process.env.NODE_ENV === 'production' 
      ? posts.filter((p: BlogPost) => !p.draft) 
      : posts
  } catch (error) {
    console.error("Failed to fetch posts from Sanity:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      excerpt,
      content,
      date,
      author,
      category,
      readTime,
      tags,
      featured,
      externalUrl,
      draft
    }`
    const post = await client.fetch(query, { slug })
    
    if (!post) {
      return null
    }
    
    // Hide draft post in production environments
    if (process.env.NODE_ENV === 'production' && post.draft) {
      return null
    }
    
    return post
  } catch (error) {
    console.error(`Failed to fetch post ${slug} from Sanity:`, error)
    return null
  }
}
