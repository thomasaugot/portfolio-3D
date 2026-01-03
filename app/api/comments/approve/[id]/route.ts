import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// POST - Approve a comment (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id, 10);
    const body = await request.json();
    const { password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await sql`
      UPDATE comments
      SET approved = true
      WHERE id = ${commentId}
      RETURNING *
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Comment approved successfully', comment: result.rows[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error approving comment:', error);
    return NextResponse.json(
      { error: 'Failed to approve comment', details: error.message },
      { status: 500 }
    );
  }
}
