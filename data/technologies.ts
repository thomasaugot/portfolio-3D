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
  // Frontend
  {
    id: "react",
    name: "React.js",
    logo: "/assets/images/technologies/react-logo.png",
    category: "frontend",
    descriptionKey: "technologies.react.description",
  },
  {
    id: "nextjs",
    name: "Next.js",
    logo: "/assets/images/technologies/nextjs-logo.png",
    category: "frontend",
    descriptionKey: "technologies.nextjs.description",
  },
  {
    id: "vite",
    name: "Vite",
    logo: "/assets/images/technologies/vite-logo.png",
    category: "frontend",
    descriptionKey: "technologies.vite.description",
  },
  {
    id: "typescript",
    name: "TypeScript",
    logo: "/assets/images/technologies/typescript-logo.png",
    category: "frontend",
    descriptionKey: "technologies.typescript.description",
  },
  {
    id: "javascript",
    name: "JavaScript",
    logo: "/assets/images/technologies/javascript-logo.png",
    category: "frontend",
    descriptionKey: "technologies.javascript.description",
  },
  {
    id: "redux",
    name: "Redux",
    logo: "/assets/images/technologies/redux-logo.svg",
    category: "frontend",
    descriptionKey: "technologies.redux.description",
  },
  {
    id: "sass",
    name: "Sass",
    logo: "/assets/images/technologies/sass-logo.png",
    category: "frontend",
    descriptionKey: "technologies.sass.description",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    logo: "/assets/images/technologies/tailwind-logo.png",
    category: "frontend",
    descriptionKey: "technologies.tailwind.description",
  },
  {
    id: "framermotion",
    name: "Framer Motion",
    logo: "/assets/images/technologies/framer-motion-logo.png",
    category: "frontend",
    descriptionKey: "technologies.framermotion.description",
  },
  {
    id: "gsap",
    name: "GSAP",
    logo: "/assets/images/technologies/gsap-logo.png",
    category: "frontend",
    descriptionKey: "technologies.gsap.description",
  },
  {
    id: "threejs",
    name: "Three.js",
    logo: "/assets/images/technologies/threejs-logo.png",
    category: "frontend",
    descriptionKey: "technologies.threejs.description",
  },
  {
    id: "reactnative",
    name: "React Native",
    logo: "/assets/images/technologies/react-native-logo.png",
    category: "frontend",
    descriptionKey: "technologies.reactnative.description",
  },
  {
    id: "expo",
    name: "Expo",
    logo: "/assets/images/technologies/expo-logo.svg",
    category: "frontend",
    descriptionKey: "technologies.expo.description",
  },
  {
    id: "wordpress",
    name: "WordPress",
    logo: "/assets/images/technologies/wordpress-logo.svg",
    category: "frontend",
    descriptionKey: "technologies.wordpress.description",
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    logo: "/assets/images/technologies/nodejs-logo.png",
    category: "backend",
    descriptionKey: "technologies.nodejs.description",
  },
  {
    id: "expressjs",
    name: "Express.js",
    logo: "/assets/images/technologies/express-logo.png",
    category: "backend",
    descriptionKey: "technologies.expressjs.description",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: "/assets/images/technologies/postgresql-logo.svg",
    category: "backend",
    descriptionKey: "technologies.postgresql.description",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    logo: "/assets/images/technologies/mongodb-logo.png",
    category: "backend",
    descriptionKey: "technologies.mongodb.description",
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "/assets/images/technologies/supabase-logo.svg",
    category: "backend",
    descriptionKey: "technologies.supabase.description",
  },
  {
    id: "firebase",
    name: "Firebase",
    logo: "/assets/images/technologies/firebase-logo.png",
    category: "backend",
    descriptionKey: "technologies.firebase.description",
  },
  {
    id: "vercel",
    name: "Vercel",
    logo: "/assets/images/technologies/vercel-logo.png",
    category: "backend",
    descriptionKey: "technologies.vercel.description",
  },
  {
    id: "aws",
    name: "AWS",
    logo: "/assets/images/technologies/aws-logo.png",
    category: "backend",
    descriptionKey: "technologies.aws.description",
  },
  {
    id: "docker",
    name: "Docker",
    logo: "/assets/images/technologies/docker-logo.png",
    category: "backend",
    descriptionKey: "technologies.docker.description",
  },

  // Tooling
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "/assets/images/technologies/chatgpt-logo.png",
    category: "tooling",
    descriptionKey: "technologies.chatgpt.description",
  },
  {
    id: "claude",
    name: "Claude AI",
    logo: "/assets/images/technologies/claudeai-logo.png",
    category: "tooling",
    descriptionKey: "technologies.claude.description",
  },
  {
    id: "zohocrm",
    name: "Zoho CRM",
    logo: "/assets/images/technologies/zoho-logo.png",
    category: "tooling",
    descriptionKey: "technologies.zohocrm.description",
  },
  {
    id: "notion",
    name: "Notion",
    logo: "/assets/images/technologies/notion-logo.png",
    category: "tooling",
    descriptionKey: "technologies.notion.description",
  },
  {
    id: "framer",
    name: "Framer",
    logo: "/assets/images/technologies/framer-logo.png",
    category: "tooling",
    descriptionKey: "technologies.framer.description",
  },
];

export const technologyCategories: TechnologyCategory[] = [
  {
    key: "frontend",
    titleKey: "common.technologies.categories.frontend",
    color: "violeta",
  },
  {
    key: "backend",
    titleKey: "common.technologies.categories.backend",
    color: "turquesa",
  },
  {
    key: "tooling",
    titleKey: "common.technologies.categories.tooling",
    color: "mandarina",
  },
];
