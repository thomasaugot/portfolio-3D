import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { seedBlogArticles } from '@/lib/db/seed-articles';

/**
 * One-click setup: Runs migration + seeds database with translations
 * Call this once after deployment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verify admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting setup...');

    // Step 1: Run migration
    console.log('Running migration...');
    await sql`
      ALTER TABLE blog_articles
      ADD COLUMN IF NOT EXISTS title_fr TEXT,
      ADD COLUMN IF NOT EXISTS title_es TEXT,
      ADD COLUMN IF NOT EXISTS excerpt_fr TEXT,
      ADD COLUMN IF NOT EXISTS excerpt_es TEXT,
      ADD COLUMN IF NOT EXISTS content_fr TEXT,
      ADD COLUMN IF NOT EXISTS content_es TEXT
    `;
    console.log('✓ Migration complete');

    // Step 2: Seed articles with translations
    console.log('Seeding articles...');
    const seedResult = await seedBlogArticles();
    console.log('✓ Seed complete');

    return NextResponse.json({
      success: true,
      message: 'Setup completed successfully',
      migration: 'completed',
      seed: seedResult
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Setup failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
