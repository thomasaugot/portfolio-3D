import Parser from 'rss-parser';

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
  // Strip HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function GET() {
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@thomasaugot');

    const articles = feed.items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || '',
      content: item.contentSnippet?.substring(0, 400) || '',
      fullContent: item.contentHtml || item['content:encoded'] || '', // HTML content from RSS
      image: item.mediaContent?.$?.url ||
             extractFirstImage(item.contentHtml || item['content:encoded'] || '') ||
             'https://miro.medium.com/v2/resize:fit:1200/1*default.png',
      categories: item.categories || [],
      readTime: calculateReadTime(item.contentHtml || item['content:encoded'] || ''),
    }));

    // Sort by date (newest first)
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
    console.error('Error fetching Medium RSS:', error);
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
