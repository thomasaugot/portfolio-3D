import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Comment } from '@/types/comment';

// GET - Fetch all pending comments (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const password = authHeader?.replace('Bearer ', '');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rows } = await sql<Comment>`
      SELECT
        c.id,
        c.article_slug,
        c.author_name,
        c.author_email,
        c.content,
        c.created_at,
        c.approved,
        c.parent_id
      FROM comments c
      WHERE c.approved = false
      ORDER BY c.created_at DESC
    `;

    // Fetch article titles from the blog API
    const commentsWithTitles = await Promise.all(
      rows.map(async (comment) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog`);
          const articles = await response.json();
          const article = articles.find((a: any) => a.link?.includes(comment.article_slug));
          return {
            ...comment,
            article_title: article?.title || comment.article_slug
          };
        } catch {
          return {
            ...comment,
            article_title: comment.article_slug
          };
        }
      })
    );

    return NextResponse.json(
      { comments: commentsWithTitles },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching pending comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments', details: error.message },
      { status: 500 }
    );
  }
}
