import { sql } from '@vercel/postgres';
import { mediumArticles } from '@/data/medium-articles';
import { translateText, translateHTML } from '@/lib/translate';

// Helper function to extract slug from Medium URL
function extractSlugFromUrl(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  // Get the last segment after the last hyphen (Medium's unique ID)
  const slug = lastPart.split('-').pop() || lastPart;
  return slug;
}

// Helper function to categorize based on article categories
function mapCategory(categories: string[]): string {
  const categoryMap: Record<string, string> = {
    'react': 'frontend',
    'nextjs': 'frontend',
    'nextjs-15': 'frontend',
    'javascript': 'frontend',
    'gsap': 'frontend',
    'animation': 'frontend',
    'frontend': 'frontend',
    'aws': 'backend',
    'backend': 'backend',
    'wordpress': 'fullstack',
    'web-development': 'fullstack',
    'design': 'design',
    'career': 'career',
    'seo': 'tutorial',
    'optimization': 'tutorial',
  };

  for (const cat of categories) {
    const normalized = cat.toLowerCase();
    if (categoryMap[normalized]) {
      return categoryMap[normalized];
    }
  }

  return 'tutorial';
}

export async function seedBlogArticles() {
  try {
    console.log('Starting blog articles seed...');

    // Clear existing articles (optional - remove if you want to keep existing data)
    // await sql`TRUNCATE TABLE blog_articles RESTART IDENTITY CASCADE`;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const article of mediumArticles) {
      const slug = extractSlugFromUrl(article.link);
      const category = mapCategory(article.categories || []);

      try {
        // Translate title, excerpt, and content
        console.log(`Translating: ${article.title}...`);
        const titleTranslations = await translateText(article.title);
        const excerptTranslations = await translateText(article.content);
        const contentTranslations = await translateHTML(article.fullContent);

        // Try to insert, or update if exists
        const result = await sql`
          INSERT INTO blog_articles (
            slug,
            title,
            title_fr,
            title_es,
            excerpt,
            excerpt_fr,
            excerpt_es,
            full_content,
            content_fr,
            content_es,
            image_url,
            pub_date,
            read_time,
            category,
            tags,
            medium_link,
            featured
          ) VALUES (
            ${slug},
            ${article.title},
            ${titleTranslations.fr},
            ${titleTranslations.es},
            ${article.content},
            ${excerptTranslations.fr},
            ${excerptTranslations.es},
            ${article.fullContent},
            ${contentTranslations.fr},
            ${contentTranslations.es},
            ${article.image},
            ${article.pubDate},
            ${article.readTime},
            ${category},
            ${JSON.stringify(article.categories || [])},
            ${article.link},
            ${false}
          )
          ON CONFLICT (slug)
          DO UPDATE SET
            title = EXCLUDED.title,
            title_fr = EXCLUDED.title_fr,
            title_es = EXCLUDED.title_es,
            excerpt = EXCLUDED.excerpt,
            excerpt_fr = EXCLUDED.excerpt_fr,
            excerpt_es = EXCLUDED.excerpt_es,
            full_content = EXCLUDED.full_content,
            content_fr = EXCLUDED.content_fr,
            content_es = EXCLUDED.content_es,
            image_url = EXCLUDED.image_url,
            pub_date = EXCLUDED.pub_date,
            read_time = EXCLUDED.read_time,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            medium_link = EXCLUDED.medium_link,
            updated_at = CURRENT_TIMESTAMP
          RETURNING (xmax = 0) AS inserted
        `;

        if (result.rows[0].inserted) {
          inserted++;
          console.log(`✓ Inserted: ${article.title}`);
        } else {
          updated++;
          console.log(`✓ Updated: ${article.title}`);
        }
      } catch (error: any) {
        console.error(`Failed to seed article: ${article.title}`, error.message);
        skipped++;
      }
    }

    console.log(`Seed complete: ${inserted} inserted, ${updated} updated, ${skipped} skipped`);

    return {
      success: true,
      inserted,
      updated,
      skipped,
      total: mediumArticles.length
    };
  } catch (error: any) {
    console.error('Seed failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedBlogArticles()
    .then((result) => {
      console.log('Seed result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed error:', error);
      process.exit(1);
    });
}
