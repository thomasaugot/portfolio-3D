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

async function checkComments() {
  console.log('🔍 Checking comments in database...\n');

  try {
    // Get all comments
    const result = await sql`
      SELECT
        id,
        article_slug,
        author_name,
        author_email,
        content,
        approved,
        created_at,
        parent_id
      FROM comments
      ORDER BY created_at DESC
    `;

    if (result.rows.length === 0) {
      console.log('📭 No comments found in database');
      return;
    }

    console.log(`📊 Total comments: ${result.rows.length}\n`);

    result.rows.forEach((comment, index) => {
      console.log(`Comment #${index + 1}:`);
      console.log(`  ID: ${comment.id}`);
      console.log(`  Article: ${comment.article_slug}`);
      console.log(`  Author: ${comment.author_name} (${comment.author_email})`);
      console.log(`  Content: ${comment.content.substring(0, 50)}...`);
      console.log(`  Approved: ${comment.approved} ${comment.approved ? '✅' : '❌'}`);
      console.log(`  Parent ID: ${comment.parent_id || 'None (root comment)'}`);
      console.log(`  Created: ${comment.created_at}`);
      console.log('');
    });

    const approvedCount = result.rows.filter(c => c.approved).length;
    const pendingCount = result.rows.filter(c => !c.approved).length;

    console.log(`✅ Approved: ${approvedCount}`);
    console.log(`⏳ Pending: ${pendingCount}`);

  } catch (error) {
    console.error('❌ Error checking comments:', error.message);
  } finally {
    process.exit(0);
  }
}

checkComments();
