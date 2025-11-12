import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/blog-data'
import { generateSEO } from '@/lib/metadata'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return generateSEO({
      title: 'Bài viết không tồn tại',
      description: 'Bài viết bạn tìm kiếm không tồn tại',
      path: `/blog/${params.slug}`,
    })
  }

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
    image: post.image,
    keywords: [post.category, 'blog', 'sự kiện', 'Bright4Event'],
  })
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
