import { mediumArticles } from '@/data/medium-articles';

export async function GET() {
  try {
    // HYBRID APPROACH: Merge RSS feed (latest 10 with full data) with static file (older articles)

    // Step 1: Fetch from RSS for latest articles with full content
    const rssUrl = 'https://medium.com/feed/@thomasaugot';
    const rssResponse = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
      },
      next: { revalidate: 3600 }
    });

    const rssArticles: any[] = [];
    if (rssResponse.ok) {
      const xmlText = await rssResponse.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
        const itemContent = itemMatch[1];

        const title = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
        const link = itemContent.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        const description = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '';
        const content = itemContent.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/)?.[1] || description;

        const categories: string[] = [];
        const categoryRegex = /<category><!\[CDATA\[(.*?)\]\]><\/category>/g;
        let catMatch;
        while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
          categories.push(catMatch[1]);
        }

        let image = null;
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          image = imgMatch[1];
        }

        rssArticles.push({
          title,
          link,
          pubDate,
          content: content || description,
          image,
          categories
        });
      }
    }

    // Step 2: Get static articles from TypeScript data file
    const staticArticles = mediumArticles;

    // Step 3: Deduplicate by link similarity and merge
    const normalizeLink = (link: string) => {
      // Extract just the slug part for comparison
      const match = link.match(/\/@[\w]+\/([\w-]+)/);
      return match ? match[1].toLowerCase() : link.toLowerCase();
    };

    const rssLinkSlugs = new Set(rssArticles.map(a => normalizeLink(a.link)));
    const uniqueStatic = staticArticles.filter(a => {
      const slug = normalizeLink(a.link);
      return !rssLinkSlugs.has(slug);
    });

    // Fix static article dates (they all have the same date from script runtime)
    // Give them incrementally older dates so RSS articles sort first
    const oldDate = new Date('2020-01-01');
    uniqueStatic.forEach((article, index) => {
      article.pubDate = new Date(oldDate.getTime() + (index * 86400000 * 7)).toISOString(); // 1 week apart
    });

    const mergedArticles = [
      ...rssArticles,
      ...uniqueStatic
    ];

    // Sort by date (RSS articles will be first due to recent dates)
    mergedArticles.sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    const results = mergedArticles;

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching Medium RSS feed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Medium posts",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
