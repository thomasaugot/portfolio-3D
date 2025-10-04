import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: '001',
    slug: 'dosxdosgrupoimagen-web',
    client: 'Dos × Dos Grupo Imagen',
    title: 'portfolio.dosxdos_web.title',
    year: 2024,
    category: 'portfolio.categories.corporate_web',
    technologies: ['Next.js 15', 'TypeScript', 'SCSS', 'Zustand', 'GSAP', 'Lexical', 'NextAuth'],
    featured: true,
    preview: {
      tagline: 'portfolio.dosxdos_web.preview.tagline',
      description: 'portfolio.dosxdos_web.preview.description',
      keyPoints: [
        'portfolio.dosxdos_web.preview.key_points.modern_experience',
        'portfolio.dosxdos_web.preview.key_points.admin_panel',
        'portfolio.dosxdos_web.preview.key_points.seo_optimization'
      ],
      cta: 'portfolio.common.cta.view_full_case'
    },
    details: {
      challenge: 'portfolio.dosxdos_web.details.challenge',
      solution: 'portfolio.dosxdos_web.details.solution',
      technicalApproach: 'portfolio.dosxdos_web.details.technical_approach',
      results: 'portfolio.dosxdos_web.details.results',
      impact: [
        'portfolio.dosxdos_web.details.impact.user_experience',
        'portfolio.dosxdos_web.details.impact.organic_visibility',
        'portfolio.dosxdos_web.details.impact.content_autonomy',
        'portfolio.dosxdos_web.details.impact.performance',
        'portfolio.dosxdos_web.details.impact.scalability'
      ]
    },
    media: {
      coverImage: '/projects/dosxdos-web/cover.jpg',
      coverVideo: '/projects/dosxdos-web/cover-video.mp4',
      images: [
        '/projects/dosxdos-web/homepage.jpg',
        '/projects/dosxdos-web/services.jpg',
        '/projects/dosxdos-web/portfolio.jpg',
        '/projects/dosxdos-web/contact.jpg',
        '/projects/dosxdos-web/blog.jpg',
        '/projects/dosxdos-web/admin-login.jpg',
        '/projects/dosxdos-web/admin-panel.jpg',
        '/projects/dosxdos-web/responsive.jpg'
      ]
    }
  },
  {
    id: '002',
    slug: 'dosxdos-internal-app',
    client: 'Dos × Dos Grupo Imagen',
    title: 'portfolio.dosxdos_app.title',
    year: 2024,
    category: 'portfolio.categories.internal_platform',
    technologies: ['JavaScript', 'PHP', 'Tailwind CSS', 'HTML', 'CSS', 'WebView'],
    featured: true,
    preview: {
      tagline: 'portfolio.dosxdos_app.preview.tagline',
      description: 'portfolio.dosxdos_app.preview.description',
      keyPoints: [
        'portfolio.dosxdos_app.preview.key_points.mobile_optimization',
        'portfolio.dosxdos_app.preview.key_points.route_management',
        'portfolio.dosxdos_app.preview.key_points.native_deployment'
      ],
      cta: 'portfolio.common.cta.view_full_case'
    },
    details: {
      challenge: 'portfolio.dosxdos_app.details.challenge',
      solution: 'portfolio.dosxdos_app.details.solution',
      technicalApproach: 'portfolio.dosxdos_app.details.technical_approach',
      results: 'portfolio.dosxdos_app.details.results',
      impact: [
        'portfolio.dosxdos_app.details.impact.usability',
        'portfolio.dosxdos_app.details.impact.navigation',
        'portfolio.dosxdos_app.details.impact.stability',
        'portfolio.dosxdos_app.details.impact.multiplatform'
      ]
    },
    media: {
      coverImage: '/projects/dosxdos-app/cover.jpg',
      coverVideo: '/projects/dosxdos-app/cover-video.mp4',
      images: [
        '/projects/dosxdos-app/menu.jpg',
        '/projects/dosxdos-app/user-form.jpg',
        '/projects/dosxdos-app/work-orders.jpg',
        '/projects/dosxdos-app/files-panel.jpg',
        '/projects/dosxdos-app/routes.jpg',
        '/projects/dosxdos-app/mobile-view.jpg',
        '/projects/dosxdos-app/mobile-map.jpg',
        '/projects/dosxdos-app/route-visualization.jpg'
      ]
    }
  },
  {
    id: '003',
    slug: 'energia-solar-canarias',
    client: 'Energía Solar Canarias',
    title: 'portfolio.energia_solar.title',
    year: 2025,
    category: 'portfolio.categories.crm_platform',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Framer Motion', 'React Hook Form', 'WebView'],
    featured: true,
    preview: {
      tagline: 'portfolio.energia_solar.preview.tagline',
      description: 'portfolio.energia_solar.preview.description',
      keyPoints: [
        'portfolio.energia_solar.preview.key_points.data_unification',
        'portfolio.energia_solar.preview.key_points.dual_interface',
        'portfolio.energia_solar.preview.key_points.native_experience'
      ],
      cta: 'portfolio.common.cta.view_full_case'
    },
    details: {
      challenge: 'portfolio.energia_solar.details.challenge',
      solution: 'portfolio.energia_solar.details.solution',
      technicalApproach: 'portfolio.energia_solar.details.technical_approach',
      results: 'portfolio.energia_solar.details.results',
      impact: [
        'portfolio.energia_solar.details.impact.centralization',
        'portfolio.energia_solar.details.impact.operational_efficiency',
        'portfolio.energia_solar.details.impact.user_experience',
        'portfolio.energia_solar.details.impact.control'
      ]
    },
    media: {
      coverImage: '/projects/energia-solar/cover.jpg',
      coverVideo: '/projects/energia-solar/cover-video.mp4',
      images: [
        '/projects/energia-solar/plant-dashboard.jpg',
        '/projects/energia-solar/provider-dashboard.jpg',
        '/projects/energia-solar/admin-users.jpg',
        '/projects/energia-solar/providers-panel.jpg',
        '/projects/energia-solar/mobile-client.jpg',
        '/projects/energia-solar/alerts-monitoring.jpg',
        '/projects/energia-solar/login.jpg',
        '/projects/energia-solar/responsive.jpg'
      ]
    }
  },
  {
    id: '004',
    slug: 'charpente-durand',
    client: 'Charpente Menuiserie Durand',
    title: 'portfolio.charpente_durand.title',
    year: 2024,
    category: 'portfolio.categories.business_website',
    technologies: ['Next.js', 'Tailwind CSS', 'TypeScript', 'EmailJS'],
    featured: false,
    preview: {
      tagline: 'portfolio.charpente_durand.preview.tagline',
      description: 'portfolio.charpente_durand.preview.description',
      keyPoints: [
        'portfolio.charpente_durand.preview.key_points.seo_boost',
        'portfolio.charpente_durand.preview.key_points.online_presence',
        'portfolio.charpente_durand.preview.key_points.lead_generation'
      ],
      cta: 'portfolio.common.cta.view_full_case'
    },
    details: {
      challenge: 'portfolio.charpente_durand.details.challenge',
      solution: 'portfolio.charpente_durand.details.solution',
      technicalApproach: 'portfolio.charpente_durand.details.technical_approach',
      results: 'portfolio.charpente_durand.details.results',
      impact: [
        'portfolio.charpente_durand.details.impact.visibility',
        'portfolio.charpente_durand.details.impact.professional_image',
        'portfolio.charpente_durand.details.impact.client_acquisition'
      ]
    },
    media: {
      coverImage: '/projects/charpente-durand/cover.jpg',
      images: [
        '/projects/charpente-durand/homepage.jpg',
        '/projects/charpente-durand/services.jpg',
        '/projects/charpente-durand/contact.jpg',
        '/projects/charpente-durand/mobile.jpg'
      ]
    }
  }
];

export const getFeaturedProjects = () => projects.filter(p => p.featured);

export const getAllProjects = () => projects;

export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);