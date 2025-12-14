import { mediumArticles } from '@/data/medium-articles';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

// Create blog-images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'blog-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const filePath = path.join(imagesDir, filename);
        const fileStream = fs.createWriteStream(filePath);

        streamPipeline(response, fileStream)
          .then(() => {
            console.log(`✓ Downloaded: ${filename}`);
            resolve(`/blog-images/${filename}`);
          })
          .catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAllImages() {
  console.log('Starting blog image download...\n');

  const results: { url: string; localPath: string; slug: string }[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const article of mediumArticles) {
    if (!article.image) {
      console.log(`⊘ Skipping (no image): ${article.title.substring(0, 50)}...`);
      continue;
    }

    try {
      // Extract slug from Medium URL
      const urlParts = article.link.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const slug = lastPart.split('-').pop() || lastPart;

      // Get file extension from URL
      const imageUrl = article.image;
      const urlObj = new URL(imageUrl);
      let ext = path.extname(urlObj.pathname) || '.png';

      // Handle Medium's dynamic image URLs
      if (!ext || ext.length > 5) {
        ext = '.png';
      }

      const filename = `${slug}${ext}`;

      // Check if already downloaded
      const filePath = path.join(imagesDir, filename);
      if (fs.existsSync(filePath)) {
        console.log(`✓ Already exists: ${filename}`);
        results.push({ url: imageUrl, localPath: `/blog-images/${filename}`, slug });
        successCount++;
        continue;
      }

      // Download the image
      const localPath = await downloadImage(imageUrl, filename);
      results.push({ url: imageUrl, localPath, slug });
      successCount++;

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`✗ Error downloading image for ${article.title.substring(0, 30)}...`);
      console.error(`  ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Download complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${mediumArticles.length}`);
  console.log('='.repeat(50));

  // Save mapping file
  const mappingPath = path.join(process.cwd(), 'scripts', 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
  console.log(`\nImage mapping saved to: ${mappingPath}`);

  return results;
}

// Run the script
downloadAllImages()
  .then(() => {
    console.log('\n✨ All done! Images are now stored locally in /public/blog-images/');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
