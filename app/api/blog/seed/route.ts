import { NextResponse } from 'next/server';
import { seedBlogArticles } from '@/lib/db/seed-articles';

/**
 * API endpoint to seed blog articles into the database
 * Access via: /api/blog/seed
 *
 * This will populate the blog_articles table with all articles from medium-articles.ts
 */
export async function POST() {
  try {
    const result = await seedBlogArticles();

    return NextResponse.json({
      success: true,
      message: 'Blog articles seeded successfully',
      ...result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Seed API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to seed blog articles',
      details: error.message
    }, { status: 500 });
  }
}

// Allow GET requests too for easier testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed blog articles',
    endpoint: '/api/blog/seed',
    method: 'POST'
  }, { status: 200 });
}
