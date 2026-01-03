// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key] = values.join('=');
      }
    }
  });
}

const { sql } = require('@vercel/postgres');

async function fixNullApproved() {
  console.log('🔧 Fixing null approved values...\n');

  try {
    // Update all null approved values to false
    const result = await sql`
      UPDATE comments
      SET approved = false
      WHERE approved IS NULL
      RETURNING id, article_slug, author_name
    `;

    if (result.rowCount === 0) {
      console.log('✅ No comments with null approved values found');
    } else {
      console.log(`✅ Fixed ${result.rowCount} comment(s):\n`);
      result.rows.forEach(comment => {
        console.log(`  - Comment #${comment.id} by ${comment.author_name} on article: ${comment.article_slug}`);
      });
    }

  } catch (error) {
    console.error('❌ Error fixing comments:', error.message);
  } finally {
    process.exit(0);
  }
}

fixNullApproved();
