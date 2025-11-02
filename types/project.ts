export interface ProjectPreview {
  tagline: string;
  description: string;
  keyPoints: string[];
  cta: string;
}

export interface ProjectDetails {
  challenge: string;
  solution: string;
}

export interface ProjectMedia {
  coverImage: string;
  coverVideo?: string;
  laptopTexture: string;
  mobileTexture: string;
  desktopSkins: string[];
  mobileSkins: string[];
  gallery?: string[];
  videos?: string[];
  link?: string;
}

export interface Project {
  id: string;
  slug: string;
  client: string;
  title: string;
  year: number;
  category: string;
  technologies: string[];
  featured: boolean;
  preview: ProjectPreview;
  details: ProjectDetails;
  media: ProjectMedia;
}
