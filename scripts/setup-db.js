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

async function setupDatabase() {
  console.log('🚀 Setting up database...\n');

  // Check if POSTGRES_URL is set
  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL is not set in your environment variables.');
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://vercel.com/dashboard');
    console.log('2. Select your project → Storage → Create Database → Postgres');
    console.log('3. Copy the POSTGRES_URL value');
    console.log('4. Add it to your .env file:\n');
    console.log('   POSTGRES_URL=your-connection-string-here\n');
    process.exit(1);
  }

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Reading schema from:', schemaPath);
    console.log('\n⚙️  Executing schema...\n');

    // Execute the entire schema at once
    try {
      await sql.query(schema);
      console.log('✅ Schema executed successfully!');
    } catch (error) {
      // If error is about things already existing, that's okay
      if (error.message.includes('already exists')) {
        console.log('⚠️  Some objects already exist, continuing...');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📊 Tables created:');
    console.log('   • blog_articles (with indexes)');
    console.log('   • comments (with auto-approval for common email domains)');
    console.log('\n🎉 You can now use the comments feature!');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupDatabase();
