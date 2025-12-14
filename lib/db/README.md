# Database Setup Guide

This directory contains database schema and seed scripts for the portfolio application.

## Prerequisites

1. **Vercel Postgres Database** - Create a Postgres database on Vercel
2. **Environment Variables** - Add these to your `.env.local`:

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## Setup Instructions

### 1. Create Database Tables

Run the SQL schema to create tables:

```bash
# Option A: Using Vercel Postgres dashboard
# 1. Go to your Vercel project > Storage > your-postgres-db
# 2. Click "Query" tab
# 3. Copy and paste the contents of lib/db/schema.sql
# 4. Click "Run Query"

# Option B: Using psql CLI
psql $POSTGRES_URL -f lib/db/schema.sql
```

The schema will create:
- `blog_articles` - Stores all blog articles
- `comments` - Stores user comments on articles
- Indexes for performance
- Triggers for auto-approval and timestamps

### 2. Seed Blog Articles

Populate the `blog_articles` table with your Medium articles:

```bash
# Option A: Using the API endpoint (recommended)
# After deploying, visit: https://your-domain.com/api/blog/seed
# Or use curl:
curl -X POST https://your-domain.com/api/blog/seed

# Option B: Run seed script directly
npx tsx lib/db/seed-articles.ts
```

This will:
- Insert all articles from `data/medium-articles.ts`
- Update existing articles if they already exist (based on slug)
- Return a summary of inserted/updated/skipped articles

### 3. Verify Setup

Check that everything is working:

```bash
# Fetch all articles via API
curl https://your-domain.com/api/blog/articles

# Check comments endpoint (should return empty array initially)
curl https://your-domain.com/api/comments/[any-slug]
```

## Database Tables

### blog_articles

Stores all blog posts with full content.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| slug | VARCHAR(500) | Unique article identifier (from Medium URL) |
| title | TEXT | Article title |
| excerpt | TEXT | Short preview text |
| full_content | TEXT | Complete article content |
| image_url | TEXT | Hero image URL |
| author | VARCHAR(100) | Author name |
| pub_date | TIMESTAMP | Publication date |
| read_time | INTEGER | Estimated reading time (minutes) |
| category | VARCHAR(50) | Article category (frontend, backend, etc.) |
| tags | TEXT[] | Array of tag strings |
| medium_link | TEXT | Original Medium article URL |
| featured | BOOLEAN | Whether article is featured |
| created_at | TIMESTAMP | When record was created |
| updated_at | TIMESTAMP | Last update timestamp |

### comments

Stores user comments on blog articles.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| article_slug | VARCHAR(500) | References blog article |
| author_name | VARCHAR(100) | Commenter's name |
| author_email | VARCHAR(255) | Commenter's email |
| content | TEXT | Comment text |
| created_at | TIMESTAMP | Comment timestamp |
| approved | BOOLEAN | Moderation status |
| parent_id | INTEGER | For threaded replies |

## Auto-Approval Rules

Comments are automatically approved if the email domain is:
- `@gmail.com`
- `@outlook.com`
- `@yahoo.com`

Other comments require manual approval (set `approved = true` in database).

## Updating Articles

To update articles after editing `medium-articles.ts`:

```bash
# Re-run the seed script
curl -X POST https://your-domain.com/api/blog/seed
```

The seed script uses `ON CONFLICT` to update existing articles instead of duplicating them.

## Maintenance

### Clear All Comments

```sql
TRUNCATE TABLE comments RESTART IDENTITY CASCADE;
```

### Reset Blog Articles

```sql
TRUNCATE TABLE blog_articles RESTART IDENTITY CASCADE;
```

### Mark Comment as Approved

```sql
UPDATE comments SET approved = true WHERE id = [comment_id];
```

### Feature an Article

```sql
UPDATE blog_articles SET featured = true WHERE slug = 'article-slug';
```

## Troubleshooting

### "relation does not exist" error

Run the schema.sql file to create tables first.

### Seed script fails

- Check that all environment variables are set
- Verify database connection with: `psql $POSTGRES_URL -c "SELECT 1"`
- Ensure schema has been run

### Comments not appearing

Check the `approved` column - only approved comments are shown to users.

## Performance Tips

The schema includes indexes on:
- `slug` (blog_articles)
- `pub_date DESC` (blog_articles)
- `category` (blog_articles)
- `article_slug` (comments)
- `approved` (comments)

These ensure fast queries for common operations like fetching articles by category or loading comments for an article.
