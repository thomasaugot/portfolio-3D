// goes in the homepage
export interface ProjectPreview {
  tagline: string;
  description: string;
  keyPoints: string[];
  cta: string;
}

export interface ProjectDetails {
  challenge: string;
  solution: string;
  technicalApproach: string;
  results: string;
  impact: string[];
}


// fort he media of each project
export interface ProjectMedia {
  coverImage: string;
  coverVideo?: string;
  images: string[];
  videos?: string[];
}

// combines everything togetehr
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