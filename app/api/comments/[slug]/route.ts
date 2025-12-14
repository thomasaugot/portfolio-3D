import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Comment, CommentFormData } from '@/types/comment';

// GET - Fetch comments for an article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { rows } = await sql<Comment>`
      SELECT
        id,
        article_slug,
        author_name,
        author_email,
        content,
        created_at,
        approved,
        parent_id
      FROM comments
      WHERE article_slug = ${slug}
        AND approved = true
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      { comments: rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching comments:', error);

    // If table doesn't exist, return empty array
    if (error.message?.includes('relation "comments" does not exist')) {
      return NextResponse.json(
        { comments: [], message: 'Comments table not yet initialized' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body: CommentFormData = await request.json();

    // Validation
    if (!body.author_name || !body.author_email || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.content.length < 10 || body.content.length > 2000) {
      return NextResponse.json(
        { error: 'Content must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.author_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert comment
    const { rows } = await sql<Comment>`
      INSERT INTO comments (
        article_slug,
        author_name,
        author_email,
        content,
        parent_id
      ) VALUES (
        ${slug},
        ${body.author_name},
        ${body.author_email},
        ${body.content},
        ${body.parent_id || null}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        comment: rows[0],
        message: 'Comment submitted successfully'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating comment:', error);

    // Check if it's a database initialization error
    if (error.message?.includes('relation "comments" does not exist')) {
      return NextResponse.json(
        {
          error: 'Comments system not yet initialized. Please run the database schema first.',
          details: error.message
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment', details: error.message },
      { status: 500 }
    );
  }
}
