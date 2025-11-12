import blogPostsData from '@/data/blog-posts.json'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  readTime: string
  category: string
  author: {
    name: string
    avatar: string
  }
  relatedPosts?: number[]
}

export const blogPosts: BlogPost[] = blogPostsData as BlogPost[]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getRelatedPosts(postIds: number[]): BlogPost[] {
  return blogPosts.filter(post => postIds.includes(post.id))
}

export function getAllPosts(): BlogPost[] {
  return blogPosts
}
