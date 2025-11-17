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
  // AI
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "/assets/images/technologies/chatgpt-logo.png",
    category: "ai",
    descriptionKey: "technologies.chatgpt.description",
  },
  {
    id: "claude",
    name: "Claude AI",
    logo: "/assets/images/technologies/claudeai-logo.png",
    category: "ai",
    descriptionKey: "technologies.claude.description",
  },

  // Frontend Development
  {
    id: "react",
    name: "React.js",
    logo: "/assets/images/technologies/react-logo.png",
    category: "development",
    descriptionKey: "technologies.react.description",
  },
  {
    id: "nextjs",
    name: "Next.js",
    logo: "/assets/images/technologies/nextjs-logo.png",
    category: "development",
    descriptionKey: "technologies.nextjs.description",
  },
  {
    id: "vite",
    name: "Vite",
    logo: "/assets/images/technologies/vite-logo.png",
    category: "development",
    descriptionKey: "technologies.vite.description",
  },
  {
    id: "typescript",
    name: "TypeScript",
    logo: "/assets/images/technologies/typescript-logo.png",
    category: "development",
    descriptionKey: "technologies.typescript.description",
  },
  {
    id: "javascript",
    name: "JavaScript",
    logo: "/assets/images/technologies/javascript-logo.svg",
    category: "development",
    descriptionKey: "technologies.javascript.description",
  },
  {
    id: "redux",
    name: "Redux",
    logo: "/assets/images/technologies/redux-logo.svg",
    category: "development",
    descriptionKey: "technologies.redux.description",
  },
  {
    id: "sass",
    name: "Sass",
    logo: "/assets/images/technologies/sass-logo.png",
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
    id: "framermotion",
    name: "Framer Motion",
    logo: "/assets/images/technologies/framer-motion-logo.png",
    category: "development",
    descriptionKey: "technologies.framermotion.description",
  },
  {
    id: "gsap",
    name: "GSAP",
    logo: "/assets/images/technologies/gsap-logo.png",
    category: "development",
    descriptionKey: "technologies.gsap.description",
  },
  {
    id: "threejs",
    name: "Three.js",
    logo: "/assets/images/technologies/threejs-logo.png",
    category: "development",
    descriptionKey: "technologies.threejs.description",
  },

  // Backend Development
  {
    id: "nodejs",
    name: "Node.js",
    logo: "/assets/images/technologies/nodejs-logo.png",
    category: "development",
    descriptionKey: "technologies.nodejs.description",
  },
  {
    id: "expressjs",
    name: "Express.js",
    logo: "/assets/images/technologies/express-logo.png",
    category: "development",
    descriptionKey: "technologies.expressjs.description",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: "/assets/images/technologies/postgresql-logo.svg",
    category: "development",
    descriptionKey: "technologies.postgresql.description",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    logo: "/assets/images/technologies/mongodb-logo.svg",
    category: "development",
    descriptionKey: "technologies.mongodb.description",
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "/assets/images/technologies/supabase-logo.svg",
    category: "development",
    descriptionKey: "technologies.supabase.description",
  },
  {
    id: "firebase",
    name: "Firebase",
    logo: "/assets/images/technologies/firebase-logo.png",
    category: "development",
    descriptionKey: "technologies.firebase.description",
  },

  // Mobile Development
  {
    id: "reactnative",
    name: "React Native",
    logo: "/assets/images/technologies/react-native-logo.png",
    category: "mobile",
    descriptionKey: "technologies.reactnative.description",
  },
  {
    id: "expo",
    name: "Expo",
    logo: "/assets/images/technologies/expo-logo.svg",
    category: "mobile",
    descriptionKey: "technologies.expo.description",
  },

  // Cloud & Infrastructure
  {
    id: "vercel",
    name: "Vercel",
    logo: "/assets/images/technologies/vercel-logo.png",
    category: "cloud",
    descriptionKey: "technologies.vercel.description",
  },
  {
    id: "aws",
    name: "AWS",
    logo: "/assets/images/technologies/aws-logo.png",
    category: "cloud",
    descriptionKey: "technologies.aws.description",
  },
  {
    id: "googlecloud",
    name: "Google Cloud",
    logo: "/assets/images/technologies/google-cloud-logo.png",
    category: "cloud",
    descriptionKey: "technologies.googlecloud.description",
  },
  {
    id: "docker",
    name: "Docker",
    logo: "/assets/images/technologies/docker-logo.png",
    category: "cloud",
    descriptionKey: "technologies.docker.description",
  },

  // CMS & No-Code
  {
    id: "wordpress",
    name: "WordPress",
    logo: "/assets/images/technologies/wordpress-logo.svg",
    category: "cms",
    descriptionKey: "technologies.wordpress.description",
  },
  {
    id: "framer",
    name: "Framer",
    logo: "/assets/images/technologies/framer-logo.png",
    category: "cms",
    descriptionKey: "technologies.framer.description",
  },

  // CRM & Collaboration
  {
    id: "zohocrm",
    name: "Zoho CRM",
    logo: "/assets/images/technologies/zoho-logo.png",
    category: "crm",
    descriptionKey: "technologies.zohocrm.description",
  },
  {
    id: "notion",
    name: "Notion",
    logo: "/assets/images/technologies/notion-logo.png",
    category: "collaboration",
    descriptionKey: "technologies.notion.description",
  },
];

export const technologyCategories: TechnologyCategory[] = [
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
    key: "cms",
    titleKey: "technologies.categories.cms",
    color: "azul-profundo",
  },
  {
    key: "crm",
    titleKey: "technologies.categories.crm",
    color: "teal",
  },
  {
    key: "collaboration",
    titleKey: "technologies.categories.collaboration",
    color: "lavanda",
  },
];
