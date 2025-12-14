-- Blog Articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(500) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  full_content TEXT NOT NULL,
  image_url TEXT,
  author VARCHAR(100) DEFAULT 'Thomas Augot',
  pub_date TIMESTAMP WITH TIME ZONE NOT NULL,
  read_time INTEGER DEFAULT 5,
  category VARCHAR(50) DEFAULT 'tutorial',
  tags TEXT[], -- Array of tags
  medium_link TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_pub_date ON blog_articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_articles(featured);

-- Comments table for blog articles
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  article_slug VARCHAR(500) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT FALSE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comment_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comment_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comment_approved ON comments(approved);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-approve comments from trusted email domains
CREATE OR REPLACE FUNCTION auto_approve_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-approve comments from known email domains
  IF NEW.author_email LIKE '%@gmail.com' OR
     NEW.author_email LIKE '%@outlook.com' OR
     NEW.author_email LIKE '%@yahoo.com' THEN
    NEW.approved := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_comment_insert
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_comment();
