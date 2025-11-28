const fs = require('fs');
const path = require('path');

async function ultimate() {
  console.log('⚡ MEDIUM SCRAPER');
  console.log('═══════════════════════════════════\n');

  const puppeteer = require('puppeteer-extra');
  const StealthPlugin = require('puppeteer-extra-plugin-stealth');
  puppeteer.use(StealthPlugin());

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();

    // Step 1: Get all URLs
    console.log('Getting all article URLs...');
    await page.goto('https://medium.com/@thomasaugot', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const urls = await page.evaluate(() => {
      const urls = new Set();
      document.querySelectorAll('a[href*="/@thomasaugot/"]').forEach(link => {
        const href = link.href.split('?')[0];
        if (href.match(/\/@thomasaugot\/[\w-]+$/)) {
          urls.add(href);
        }
      });
      return Array.from(urls);
    });

    console.log(`Found ${urls.length} articles\n`);
    console.log('⚡ Extracting FULL CONTENT from each article...\n');

    const articles = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const slug = url.split('/').pop().slice(0, 40);
      console.log(`   [${i + 1}/${urls.length}] ${slug}...`);

      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const data = await page.evaluate(() => {
          // Title
          const h1 = document.querySelector('h1');
          const title = h1 ? h1.innerText.trim() : '';

          // Full article content
          let fullContent = '';
          const article = document.querySelector('article');

          if (article) {
            const paragraphs = article.querySelectorAll('p, h2, h3');
            const texts = [];

            paragraphs.forEach(el => {
              const text = el.innerText.trim();
              if (text.length > 15 &&
                  !text.match(/^(Share|Sign up|Sign in|Follow|More from|Written by)/i)) {
                texts.push(text);
              }
            });

            fullContent = texts.join('\n\n');
          }

          // Image from og:image
          const ogImage = document.querySelector('meta[property="og:image"]');
          const image = ogImage ? ogImage.getAttribute('content') : '';

          // Date from time element or meta
          let pubDate = '';
          const timeEl = document.querySelector('time');
          if (timeEl) {
            const datetime = timeEl.getAttribute('datetime');
            if (datetime) pubDate = datetime;
          }
          if (!pubDate) {
            const metaDate = document.querySelector('meta[property="article:published_time"]');
            if (metaDate) pubDate = metaDate.getAttribute('content');
          }

          // Categories/tags from meta tags
          const categories = [];
          document.querySelectorAll('meta[property="article:tag"]').forEach(tag => {
            const content = tag.getAttribute('content');
            if (content) categories.push(content.toLowerCase());
          });

          // Also get tags from links
          document.querySelectorAll('a[href*="/tag/"]').forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/\/tag\/([\w-]+)/);
            if (match && !categories.includes(match[1])) {
              categories.push(match[1]);
            }
          });

          // Read time
          let readTime = 0;
          const readTimeSpan = Array.from(document.querySelectorAll('span')).find(
            span => span.innerText.includes('min read')
          );
          if (readTimeSpan) {
            const match = readTimeSpan.innerText.match(/(\d+)\s*min/);
            if (match) readTime = parseInt(match[1]);
          }

          // If no read time, calculate from content
          if (!readTime && fullContent) {
            const words = fullContent.split(/\s+/).length;
            readTime = Math.max(1, Math.ceil(words / 200));
          }

          return {
            title,
            fullContent,
            image,
            pubDate,
            categories,
            readTime,
            wordCount: fullContent.split(/\s+/).length
          };
        });

        if (data.title && data.fullContent.length > 200) {
          articles.push({
            title: data.title,
            link: url,
            pubDate: data.pubDate || new Date().toISOString(),
            content: data.fullContent.slice(0, 400), // Excerpt
            fullContent: data.fullContent, // Full content
            image: data.image,
            categories: data.categories,
            readTime: data.readTime
          });

          console.log(`${data.wordCount} words, ${data.categories.length} tags`);
        } else {
          console.log(`Incomplete (${data.fullContent.length} chars)`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(`${error.message}`);
      }
    }

    await browser.close();

    // Sort by date
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Save as TypeScript file
    const outputPath = path.join(__dirname, '..', 'data', 'medium-articles.ts');
    const tsContent = `import { MediumArticle } from '@/types/blog';

export const mediumArticles: MediumArticle[] = ${JSON.stringify(articles, null, 2)};
`;
    fs.writeFileSync(outputPath, tsContent);

    console.log('\n═══════════════════════════════════');
    console.log(`${articles.length} articles with FULL CONTENT`);
    console.log(`${outputPath}\n`);

    const avgWords = articles.reduce((sum, a) => sum + a.fullContent.split(/\s+/).length, 0) / articles.length;

    console.log('Final Stats:');
    console.log(`   Total: ${articles.length}`);
    console.log(`   With full content: ${articles.filter(a => a.fullContent.length > 500).length}`);
    console.log(`   With categories: ${articles.filter(a => a.categories.length > 0).length}`);
    console.log(`   Avg words: ${Math.round(avgWords)}\n`);

    console.log('📝 Sample:\n');
    articles.slice(0, 3).forEach((a, i) => {
      console.log(`${i + 1}. ${a.title}`);
      console.log(`   ${a.fullContent.split(/\s+/).length} words`);
      console.log(`   ${a.categories.join(', ')}`);
      console.log(`   ${new Date(a.pubDate).toLocaleDateString()}\n`);
    });

    console.log('🎉 YOU NOW HAVE EVERYTHING!');

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

ultimate().catch(console.error);
