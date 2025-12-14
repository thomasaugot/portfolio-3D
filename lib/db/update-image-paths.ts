import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

interface ImageMapping {
  url: string;
  localPath: string;
  slug: string;
}

export async function updateImagePaths() {
  try {
    console.log('Reading image mapping...');

    const mappingPath = path.join(process.cwd(), 'scripts', 'image-mapping.json');

    if (!fs.existsSync(mappingPath)) {
      throw new Error('Image mapping file not found. Run download-blog-images.ts first.');
    }

    const mappings: ImageMapping[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

    console.log(`Updating ${mappings.length} image paths in database...\n`);

    let updated = 0;
    let skipped = 0;

    for (const mapping of mappings) {
      try {
        const result = await sql`
          UPDATE blog_articles
          SET image_url = ${mapping.localPath}
          WHERE slug = ${mapping.slug}
          RETURNING slug
        `;

        if (result.rowCount && result.rowCount > 0) {
          console.log(`✓ Updated: ${mapping.slug}`);
          updated++;
        } else {
          console.log(`⊘ Skipped (not found): ${mapping.slug}`);
          skipped++;
        }
      } catch (error: any) {
        console.error(`✗ Error updating ${mapping.slug}: ${error.message}`);
        skipped++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`Update complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log('='.repeat(50));

    return { updated, skipped };
  } catch (error: any) {
    console.error('Update failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  updateImagePaths()
    .then(() => {
      console.log('\n✨ Image paths updated in database!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}
