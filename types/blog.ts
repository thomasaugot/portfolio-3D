export type BlogCategory =
  | "all"
  | "frontend"
  | "backend"
  | "fullstack"
  | "design"
  | "career"
  | "tutorial";

export interface BlogPost {
  id: string;            // post.link
  slug: string;          // post.link
  titleKey: string;      // post.title
  originalTitle?: string; // original English title for slug generation
  excerptKey: string;    // post.contentSnippet
  fullContent?: string;  // full article content
  date: string;          // post.pubDate
  author: string;        // "Thomas Augot"
  categoryKey: BlogCategory | "all";
  readTime: number;      // fixed placeholder
  featured: boolean;     // unused, always false for Medium RSS
  tags: string[];        // Medium RSS = no tags → empty array
  image: string;         // post.thumbnail || default
  link: string;          // original Medium URL
}

export interface MediumArticle {
  title: string;
  originalTitle?: string;
  link: string;
  pubDate: string;
  content: string;        // excerpt (first ~400 chars)
  fullContent: string;    // full article content (300-1500 words)
  image: string;
  categories: string[] | null;
  readTime: number;
}
