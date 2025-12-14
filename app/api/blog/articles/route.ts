import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { BlogPost } from '@/types/blog';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT
        id,
        slug,
        title,
        excerpt,
        full_content,
        image_url,
        author,
        pub_date,
        read_time,
        category,
        tags,
        medium_link,
        featured
      FROM blog_articles
      ORDER BY pub_date DESC
    `;

    // Transform database rows to BlogPost format
    const posts: BlogPost[] = rows.map((row: any) => ({
      id: row.slug,
      slug: row.slug,
      titleKey: row.title,
      excerptKey: row.excerpt || row.full_content.substring(0, 200) + '...',
      fullContent: row.full_content,
      date: row.pub_date,
      author: row.author,
      categoryKey: row.category,
      readTime: row.read_time,
      featured: row.featured,
      tags: row.tags || [],
      image: row.image_url,
      link: row.medium_link
    }));

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blog articles:', error);

    // If table doesn't exist, return fallback message
    if (error.message?.includes('relation "blog_articles" does not exist')) {
      return NextResponse.json(
        {
          posts: [],
          message: 'Blog articles table not yet initialized. Please run the seed script.'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch blog articles', details: error.message },
      { status: 500 }
    );
  }
}
