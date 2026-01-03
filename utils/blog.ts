import { BlogPost, BlogCategory } from "@/types/blog";

const CATEGORY_MAP: Record<string, BlogCategory> = {
  react: "frontend",
  nextjs: "frontend",
  "nextjs-15": "frontend",
  javascript: "frontend",
  gsap: "frontend",
  animation: "frontend",
  frontend: "frontend",
  "web-development": "fullstack",
  wordpress: "fullstack",
  backend: "backend",
  aws: "backend",
  "amazon-web-services": "backend",
  design: "design",
  career: "career",
};

function mapCategory(categories: string[] = []): BlogCategory {
  for (const cat of categories) {
    const mapped = CATEGORY_MAP[cat.toLowerCase()];
    if (mapped) return mapped;
  }
  return "all";
}

interface RawBlogPost {
  link: string;
  title: string;
  originalTitle?: string;
  content?: string;
  fullContent?: string;
  pubDate: string;
  categories?: string[];
  image?: string;
  readTime?: number;
}

export function normalizeBlogPosts(data: RawBlogPost[]): BlogPost[] {
  return data.map((post) => {
    // Use existing content field as excerpt, or create from fullContent
    let excerpt = post.content || "";
    if (!excerpt && post.fullContent) {
      excerpt = (post.fullContent || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300);
    }

    // Calculate read time from fullContent or content
    const contentForReadTime = post.fullContent || post.content || "";
    const wordCount = contentForReadTime.split(/\s+/).length;
    const readTime = post.readTime || Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: post.link,
      slug: post.link,
      titleKey: post.title,
      originalTitle: post.originalTitle,
      excerptKey: excerpt,
      fullContent: post.fullContent || post.content || "",
      date: post.pubDate,
      author: "Thomas Augot",
      categoryKey: mapCategory(post.categories),
      readTime,
      featured: false,
      tags: post.categories?.slice(0, 3) || [],
      image: post.image || "/default-blog.jpg",
      link: post.link,
    };
  });
}
