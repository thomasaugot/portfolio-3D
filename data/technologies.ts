export interface Technology {
  id: string;
  name: string;
  logo: string;
  category: string;
  descriptionKey: string;
}

export interface TechnologyCategory {
  key: string;
  titleKey: string;
  color: string;
}

export const technologies: Technology[] = [
  {
    id: "openai",
    name: "Open AI",
    logo: "/assets/images/technologies/openai-logo.png",
    category: "ai",
    descriptionKey: "technologies.openai.description",
  },
  {
    id: "claude",
    name: "Claude AI",
    logo: "/assets/images/technologies/claudeai-logo.png",
    category: "ai",
    descriptionKey: "technologies.claude.description",
  },

  // Development & Web
  {
    id: "nextjs",
    name: "Next.js",
    logo: "/assets/images/technologies/nextjs-logo.png",
    category: "development",
    descriptionKey: "technologies.nextjs.description",
  },
  {
    id: "react",
    name: "React",
    logo: "/assets/images/technologies/react-logo.png",
    category: "development",
    descriptionKey: "technologies.react.description",
  },
  {
    id: "nodejs",
    name: "Node.js",
    logo: "/assets/images/technologies/nodejs-logo.png",
    category: "development",
    descriptionKey: "technologies.nodejs.description",
  },
  {
    id: "javascript",
    name: "Javascript",
    logo: "/assets/images/technologies/javascript-logo.png",
    category: "development",
    descriptionKey: "technologies.javascript.description",
  },
  {
    id: "vercel",
    name: "Vercel",
    logo: "/assets/images/technologies/vercel-logo.png",
    category: "development",
    descriptionKey: "technologies.vercel.description",
  },
  {
    id: "sass",
    name: "Sass",
    logo: "/assets/images/technologies/scss-logo.png",
    category: "development",
    descriptionKey: "technologies.sass.description",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    logo: "/assets/images/technologies/tailwind-logo.png",
    category: "development",
    descriptionKey: "technologies.tailwind.description",
  },
  {
    id: "gsap",
    name: "GSAP",
    logo: "/assets/images/technologies/gsap-logo.png",
    category: "development",
    descriptionKey: "technologies.gsap.description",
  },
  {
    id: "typescript",
    name: "TypeScript",
    logo: "/assets/images/technologies/typescript-logo.png",
    category: "development",
    descriptionKey: "technologies.typescript.description",
  },

  // Mobile Development
  {
    id: "android",
    name: "Android",
    logo: "/assets/images/technologies/android-logo.png",
    category: "mobile",
    descriptionKey: "technologies.android.description",
  },
  {
    id: "ios",
    name: "iOS",
    logo: "/assets/images/technologies/ios-logo.png",
    category: "mobile",
    descriptionKey: "technologies.ios.description",
  },

  // Cloud & Infrastructure
  {
    id: "aws",
    name: "AWS",
    logo: "/assets/images/technologies/aws-logo.png",
    category: "cloud",
    descriptionKey: "technologies.aws.description",
  },
];

export const technologyCategories: TechnologyCategory[] = [
  {
    key: "crm",
    titleKey: "technologies.categories.crm",
    color: "teal",
  },
  {
    key: "erp",
    titleKey: "technologies.categories.erp",
    color: "azul-profundo",
  },
  {
    key: "ai",
    titleKey: "technologies.categories.ai",
    color: "mandarina",
  },
  {
    key: "development",
    titleKey: "technologies.categories.development",
    color: "violeta",
  },
  {
    key: "mobile",
    titleKey: "technologies.categories.mobile",
    color: "turquesa",
  },
  {
    key: "cloud",
    titleKey: "technologies.categories.cloud",
    color: "naranja-tostado",
  },
  {
    key: "google-workspace",
    titleKey: "technologies.categories.googleWorkspace",
    color: "teal",
  },
  {
    key: "collaboration",
    titleKey: "technologies.categories.collaboration",
    color: "lavanda",
  },
];
