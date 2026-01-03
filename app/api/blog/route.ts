import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';
import Parser from 'rss-parser';
import { mediumArticles } from '@/data/medium-articles';

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

function convertTextToHTML(text: string): string {
  return text
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Check if it's a heading (starts with capital and is short)
      if (para.length < 100 && !para.includes('.') && /^[A-Z]/.test(para)) {
        // Check for numbered steps
        if (/^(Step \d+|[0-9]+\.)/.test(para)) {
          return `<h3>${para}</h3>`;
        }
        // Other potential headings
        if (para.length < 60) {
          return `<h2>${para}</h2>`;
        }
      }
      // Check for bullet points
      if (para.startsWith('•') || para.startsWith('-') || para.startsWith('✅')) {
        return `<li>${para.substring(1).trim()}</li>`;
      }
      // Regular paragraph
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  try {
    // Use Medium RSS feed (has proper HTML formatting)
    const feed = await parser.parseURL('https://medium.com/feed/@thomasaugot');

    let articles = feed.items.map((item: any) => {
      // Extract image from content or use Medium's CDN URL
      let imageUrl = '';
      const contentHtml = item.contentHtml || item['content:encoded'] || '';

      // Try to get image from Medium's media content
      if (item.mediaContent?.$?.url) {
        imageUrl = item.mediaContent.$.url;
      }
      // Extract from HTML content
      else if (contentHtml) {
        const extractedImage = extractFirstImage(contentHtml);
        if (extractedImage && extractedImage.startsWith('http')) {
          imageUrl = extractedImage;
        }
      }

      // Fallback to a working placeholder
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=630&fit=crop';
      }

      return {
        title: item.title || '',
        originalTitle: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        content: item.contentSnippet?.substring(0, 400) || '',
        fullContent: contentHtml,
        image: imageUrl,
        categories: item.categories || [],
        readTime: calculateReadTime(contentHtml),
      };
    });

    articles.sort((a, b) =>
      new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    );

    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
