import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "001",
    slug: "dosxdosgrupoimagen-web",
    client: "Dos × Dos Grupo Imagen",
    title: "portfolio.dosxdos_web.title",
    year: 2024,
    category: "portfolio.categories.corporate_web",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "SCSS",
      "Zustand",
      "GSAP",
      "Lexical",
      "NextAuth",
    ],
    featured: false,
    preview: {
      tagline: "portfolio.dosxdos_web.preview.tagline",
      description: "portfolio.dosxdos_web.preview.description",
      keyPoints: [
        "portfolio.dosxdos_web.preview.key_points.modern_experience",
        "portfolio.dosxdos_web.preview.key_points.admin_panel",
        "portfolio.dosxdos_web.preview.key_points.seo_optimization",
      ],
      cta: "portfolio.common.cta.view_full_case",
    },
    details: {
      challenge: "portfolio.dosxdos_web.details.challenge",
      solution: "portfolio.dosxdos_web.details.solution",
    },
    media: {
      coverImage: "/assets/images/portfolio/dosxdos-web/desktop/desktop-1.png",
      coverVideo: "/assets/videos/portfolio/demo-web-dosxdos.mp4",
      laptopTexture:
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-1.png",
      mobileTexture: "/assets/images/portfolio/dosxdos-web/mobile/mobile-1.png",
      desktopSkins: [
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-1.png",
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-2.png",
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-3.png",
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-4.png",
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-5.png",
        "/assets/images/portfolio/dosxdos-web/desktop/desktop-6.png",
      ],
      mobileSkins: [
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-1.png",
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-2.png",
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-3.png",
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-4.png",
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-5.png",
        "/assets/images/portfolio/dosxdos-web/mobile/mobile-6.png",
      ],
      link: "https://www.dospordosgrupoimagen.com/",
    },
  },
  // {
  //   id: "002",
  //   slug: "dosxdos-internal-app",
  //   client: "Dos × Dos Grupo Imagen",
  //   title: "portfolio.dosxdos_app.title",
  //   year: 2024,
  //   category: "portfolio.categories.internal_platform",
  //   technologies: [
  //     "JavaScript",
  //     "PHP",
  //     "Tailwind CSS",
  //     "HTML",
  //     "CSS",
  //     "WebView",
  //   ],
  //   featured: false,
  //   preview: {
  //     tagline: "portfolio.dosxdos_app.preview.tagline",
  //     description: "portfolio.dosxdos_app.preview.description",
  //     keyPoints: [
  //       "portfolio.dosxdos_app.preview.key_points.mobile_optimization",
  //       "portfolio.dosxdos_app.preview.key_points.route_management",
  //       "portfolio.dosxdos_app.preview.key_points.native_deployment",
  //     ],
  //     cta: "portfolio.common.cta.view_full_case",
  //   },
  //   details: {
  //     challenge: "portfolio.dosxdos_app.details.challenge",
  //     solution: "portfolio.dosxdos_app.details.solution",
  //   },
  //   media: {
  //     coverImage:
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-1.png",
  //     coverVideo: "/assets/videos/portfolio/demo-reloj-laboral.mp4",
  //     laptopTexture:
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-5.png",
  //     mobileTexture:
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-7.png",
  //     desktopSkins: [
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-5.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-6.png",
  //     ],
  //     mobileSkins: [
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-7.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-8.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-9.png",
  //     ],
  //     gallery: [
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-5.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-6.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-7.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-8.png",
  //       "/assets/images/portfolio/reloj-laboral-galaga/reloj-laboral-galaga-9.png",
  //     ],
  //     link: "https://dosxdos.app.iidos.com/",
  //   },
  // },
  {
    id: "003",
    slug: "energia-solar-canarias",
    client: "Energía Solar Canarias",
    title: "portfolio.energia_solar.title",
    year: 2025,
    category: "portfolio.categories.crm_platform",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux Toolkit",
      "Framer Motion",
      "React Hook Form",
      "WebView",
    ],
    featured: true,
    preview: {
      tagline: "portfolio.energia_solar.preview.tagline",
      description: "portfolio.energia_solar.preview.description",
      keyPoints: [
        "portfolio.energia_solar.preview.key_points.data_unification",
        "portfolio.energia_solar.preview.key_points.dual_interface",
        "portfolio.energia_solar.preview.key_points.native_experience",
      ],
      cta: "portfolio.common.cta.view_full_case",
    },
    details: {
      challenge: "portfolio.energia_solar.details.challenge",
      solution: "portfolio.energia_solar.details.solution",
    },
    media: {
      coverImage:
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-1.png",
      coverVideo: "/assets/videos/portfolio/demo-energia-solar-canarias.mp4",
      laptopTexture:
        "/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-laptop-texture.png",
      mobileTexture:
        "/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-mobile-texture.png",
      desktopSkins: [
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-1.png",
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-2.png",
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-3.png",
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-4.png",
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-5.png",
        "/assets/images/portfolio/energia-solar-canarias/desktop/desktop-6.png",
      ],
      mobileSkins: [
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-1.png",
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-2.png",
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-3.png",
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-4.png",
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-5.png",
        "/assets/images/portfolio/energia-solar-canarias/mobile/mobile-6.png",
      ],
      link: "https://app-energiasolarcanarias.com/",
    },
  },
  {
    id: "004",
    slug: "charpente-menuiserie-durand",
    client: "Charpente Menuiserie Durand",
    title: "portfolio.charpente_durand.title",
    year: 2024,
    category: "portfolio.categories.business_website",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "EmailJS",
      "Framer Motion",
    ],
    featured: false,
    preview: {
      tagline: "portfolio.charpente_durand.preview.tagline",
      description: "portfolio.charpente_durand.preview.description",
      keyPoints: [
        "portfolio.charpente_durand.preview.key_points.seo_boost",
        "portfolio.charpente_durand.preview.key_points.online_presence",
        "portfolio.charpente_durand.preview.key_points.lead_generation",
      ],
      cta: "portfolio.common.cta.view_full_case",
    },
    details: {
      challenge: "portfolio.charpente_durand.details.challenge",
      solution: "portfolio.charpente_durand.details.solution",
    },
    media: {
      coverImage:
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-1.png",
      coverVideo:
        "/assets/videos/portfolio/demo-charpente-menuiserie-durand.mp4",
      laptopTexture:
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-1.png",
      mobileTexture:
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-1.png",
      desktopSkins: [
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-1.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-2.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-3.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-4.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-5.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-6.png",
      ],
      mobileSkins: [
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-1.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-2.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-3.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-4.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-5.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/mobile/mobile-6.png",
      ],
      gallery: [
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-1.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-2.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-3.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-4.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-5.png",
        "/assets/images/portfolio/charpente-menuiserie-durand/desktop/desktop-6.png",
      ],
      link: "https://cmdurand-2-0.vercel.app/",
    },
  },
  {
    id: "005",
    slug: "galaga-agency-website",
    client: "Galaga Agency",
    title: "portfolio.galaga_agency.title",
    year: 2025,
    category: "portfolio.categories.corporate_web",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Three.js",
    ],
    featured: true,
    preview: {
      tagline: "portfolio.galaga_agency.preview.tagline",
      description: "portfolio.galaga_agency.preview.description",
      keyPoints: [
        "portfolio.galaga_agency.preview.key_points.brand_reinvention",
        "portfolio.galaga_agency.preview.key_points.modern_tech",
        "portfolio.galaga_agency.preview.key_points.interactive_design",
      ],
      cta: "portfolio.common.cta.view_full_case",
    },
    details: {
      challenge: "portfolio.galaga_agency.details.challenge",
      solution: "portfolio.galaga_agency.details.solution",
    },
    media: {
      coverImage:
        "/assets/images/portfolio/galaga-agency/desktop/desktop-1.png",
      coverVideo: "/assets/videos/portfolio/demo-reloj-laboral.mp4",
      laptopTexture:
        "/assets/images/portfolio/galaga-agency/galaga-agency-laptop-texture.png",
      mobileTexture:
        "/assets/images/portfolio/galaga-agency/galaga-agency-mobile-texture.png",
      desktopSkins: [
        "/assets/images/portfolio/galaga-agency/desktop/desktop-1.png",
        "/assets/images/portfolio/galaga-agency/desktop/desktop-2.png",
        "/assets/images/portfolio/galaga-agency/desktop/desktop-3.png",
        "/assets/images/portfolio/galaga-agency/desktop/desktop-4.png",
        "/assets/images/portfolio/galaga-agency/desktop/desktop-5.png",
        "/assets/images/portfolio/galaga-agency/desktop/desktop-6.png",
      ],
      mobileSkins: [
        "/assets/images/portfolio/galaga-agency/mobile/mobile-1.png",
        "/assets/images/portfolio/galaga-agency/mobile/mobile-2.png",
        "/assets/images/portfolio/galaga-agency/mobile/mobile-3.png",
        "/assets/images/portfolio/galaga-agency/mobile/mobile-4.png",
        "/assets/images/portfolio/galaga-agency/mobile/mobile-5.png",
        "/assets/images/portfolio/galaga-agency/mobile/mobile-6.png",
      ],
      link: "https://galagaagency.com/",
    },
  },
  {
    id: "006",
    slug: "reloj-laboral-galaga",
    client: "Galaga Agency",
    title: "portfolio.reloj_laboral.title",
    year: 2025,
    category: "portfolio.categories.software_platform",
    technologies: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Supabase",
      "JWT",
      "GSAP",
    ],
    featured: true,
    preview: {
      tagline: "portfolio.reloj_laboral.preview.tagline",
      description: "portfolio.reloj_laboral.preview.description",
      keyPoints: [
        "portfolio.reloj_laboral.preview.key_points.digital_compliance",
        "portfolio.reloj_laboral.preview.key_points.full_stack",
        "portfolio.reloj_laboral.preview.key_points.multi_role_system",
      ],
      cta: "portfolio.common.cta.view_full_case",
    },
    details: {
      challenge: "portfolio.reloj_laboral.details.challenge",
      solution: "portfolio.reloj_laboral.details.solution",
    },
    media: {
      coverImage:
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-1.png",
      coverVideo: "/assets/videos/portfolio/demo-reloj-laboral.mp4",
      laptopTexture:
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-2.png",
      mobileTexture:
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-2.png",
      desktopSkins: [
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-1.png",
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-2.png",
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-3.png",
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-4.png",
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-5.png",
        "/assets/images/portfolio/reloj-laboral-galaga/desktop/desktop-6.png",
      ],
      mobileSkins: [
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-1.png",
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-2.png",
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-3.png",
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-4.png",
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-5.png",
        "/assets/images/portfolio/reloj-laboral-galaga/mobile/mobile-6.png",
      ],
      // No public link for internal tool
    },
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);

export const getAllProjects = () => projects;

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
