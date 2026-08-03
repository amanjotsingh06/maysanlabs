import { NextResponse } from 'next/server'
import { getAllPosts } from '@/sanity/lib/queries'

export async function GET() {
  const posts = await getAllPosts()
  return NextResponse.json(posts)
}
