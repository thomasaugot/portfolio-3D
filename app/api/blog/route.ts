import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';
import Parser from 'rss-parser';
import translate from '@vitalets/google-translate-api';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentHtml'],
      ['media:content', 'mediaContent'],
    ],
  },
});

function extractFirstImage(html: string): string {
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : '';
}

function calculateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  try {
    // Try to fetch from database first (with translations)
    const result = await sql`
      SELECT
        slug,
        CASE
          WHEN ${lang} = 'fr' THEN COALESCE(title_fr, title)
          WHEN ${lang} = 'es' THEN COALESCE(title_es, title)
          ELSE title
        END as title,
        CASE
          WHEN ${lang} = 'fr' THEN COALESCE(excerpt_fr, excerpt)
          WHEN ${lang} = 'es' THEN COALESCE(excerpt_es, excerpt)
          ELSE excerpt
        END as content,
        CASE
          WHEN ${lang} = 'fr' THEN COALESCE(content_fr, full_content)
          WHEN ${lang} = 'es' THEN COALESCE(content_es, full_content)
          ELSE full_content
        END as fullContent,
        image_url as image,
        pub_date as pubDate,
        read_time as readTime,
        category,
        tags as categories,
        medium_link as link
      FROM blog_articles
      ORDER BY pub_date DESC
    `;

    const articles = result.rows.map(row => ({
      ...row,
      categories: Array.isArray(row.categories) ? row.categories : JSON.parse(row.categories || '[]'),
    }));

    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (dbError) {
    // Fallback to Medium RSS if database fails
    console.log('Database query failed, falling back to Medium RSS');
    try {
      const feed = await parser.parseURL('https://medium.com/feed/@thomasaugot');

      let articles = feed.items.map((item: any) => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        content: item.contentSnippet?.substring(0, 400) || '',
        fullContent: item.contentHtml || item['content:encoded'] || '',
        image: item.mediaContent?.$?.url ||
               extractFirstImage(item.contentHtml || item['content:encoded'] || '') ||
               'https://miro.medium.com/v2/resize:fit:1200/1*default.png',
        categories: item.categories || [],
        readTime: calculateReadTime(item.contentHtml || item['content:encoded'] || ''),
      }));

      // Translate if not English
      if (lang !== 'en') {
        const targetLang = lang === 'fr' ? 'fr' : 'es';
        articles = await Promise.all(articles.map(async (article) => {
          try {
            const [titleRes, contentRes, fullContentRes] = await Promise.all([
              translate(article.title, { to: targetLang }),
              translate(article.content, { to: targetLang }),
              translate(article.fullContent, { to: targetLang }),
            ]);
            return {
              ...article,
              title: titleRes.text,
              content: contentRes.text,
              fullContent: fullContentRes.text,
            };
          } catch (err) {
            return article;
          }
        }));
      }

      articles.sort((a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
      );

      return new Response(JSON.stringify(articles), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        },
      });
    } catch (rssError) {
      console.error('Both database and RSS failed:', rssError);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch blog posts',
          message: rssError instanceof Error ? rssError.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}
