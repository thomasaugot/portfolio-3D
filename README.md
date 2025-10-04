Translation & Project Data System Documentation
===============================================

Overview
--------

This portfolio uses a custom translation system with nested locale files and a centralized project data structure. All content is managed through TypeScript types and JSON translation files.

File Structure
--------------

`   types/    └── project.ts                    # TypeScript interfaces for projects  data/    └── projects.ts                   # All project data with translation keys  lib/    └── TranslationProvider.tsx       # Translation context + hook  hooks/    └── useTranslationReady.ts        # Helper hook for translation loading state    └── useLanguageToggle.ts          # Language switching logic  locales/    ├── en/    │   ├── nav.json                  # Navigation translations    │   ├── homepage.json             # Homepage content    │   └── portfolio.json            # Project content    ├── fr/    │   └── (same structure)    └── es/        └── (same structure)   `

How Translations Work
---------------------

The system loads 3 JSON files per language and merges them into one object:

`   {    nav: { ... },           // from nav.json    homepage: { ... },      // from homepage.json    portfolio: { ... }      // from portfolio.json  }   `

Translation keys use dot notation: t("homepage.hero\_title")

Adding New Translations
-----------------------

### 1\. Add Keys to All Language Files

Add the same key structure to en/, fr/, and es/ in the appropriate file:

**Example: Adding a new section to homepage**

locales/en/homepage.json:

`   {    "new_section": {      "title": "My New Section",      "description": "Section description"    }  }   `

locales/fr/homepage.json:

`   {    "new_section": {      "title": "Ma Nouvelle Section",      "description": "Description de la section"    }  }   `

locales/es/homepage.json:

`   {    "new_section": {      "title": "Mi Nueva Sección",      "description": "Descripción de la sección"    }  }   `

### 2\. Use in Components

tsx

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   import { useTranslation } from "@/lib/TranslationProvider";  export default function MyComponent() {    const { t } = useTranslation();    return (                {t("homepage.new_section.title")} ---------------------------------          {t("homepage.new_section.description")}    );  }   `

Adding New Projects
-------------------

### 1\. Update TypeScript Types (if needed)

If your new project requires different fields, update types/project.ts first.

### 2\. Add Project Data

Edit data/projects.ts:

`   {    id: '005',    slug: 'my-new-project',    client: 'Client Name',    title: 'portfolio.my_new_project.title',  // Translation key    year: 2025,    category: 'portfolio.categories.web_app',    technologies: ['Next.js', 'TypeScript'],    featured: true,  // Shows on homepage    preview: {      tagline: 'portfolio.my_new_project.preview.tagline',      description: 'portfolio.my_new_project.preview.description',      keyPoints: [        'portfolio.my_new_project.preview.key_points.point_1',        'portfolio.my_new_project.preview.key_points.point_2',        'portfolio.my_new_project.preview.key_points.point_3'      ],      cta: 'portfolio.common.cta.view_full_case'    },    details: {      challenge: 'portfolio.my_new_project.details.challenge',      solution: 'portfolio.my_new_project.details.solution',      technicalApproach: 'portfolio.my_new_project.details.technical_approach',      results: 'portfolio.my_new_project.details.results',      impact: [        'portfolio.my_new_project.details.impact.impact_1',        'portfolio.my_new_project.details.impact.impact_2'      ]    },    media: {      coverImage: '/projects/my-new-project/cover.jpg',      coverVideo: '/projects/my-new-project/cover-video.mp4',      images: [        '/projects/my-new-project/screenshot-1.jpg',        '/projects/my-new-project/screenshot-2.jpg'      ]    }  }   `

### 3\. Add Translations

Add to locales/en/portfolio.json:

`   {    "my_new_project": {      "title": "Project Title",      "preview": {        "tagline": "One-line description",        "description": "2-3 sentence overview",        "key_points": {          "point_1": "First achievement",          "point_2": "Second achievement",          "point_3": "Third achievement"        }      },      "details": {        "challenge": "Problem description",        "solution": "What you built",        "technical_approach": "How you built it",        "results": "Outcome achieved",        "impact": {          "impact_1": "Specific result 1",          "impact_2": "Specific result 2"        }      }    }  }   `

Repeat for fr/ and es/ with translated content.

### 4\. Add Media Files

Create folder: /public/projects/my-new-project/

Add images:

*   cover.jpg - Main preview image
    
*   cover-video.mp4 - Optional homepage video
    
*   screenshot-1.jpg, screenshot-2.jpg, etc.
    

Using Projects in Components
----------------------------

### Get Featured Projects (Homepage)

`   import { getFeaturedProjects } from '@/data/projects';  import { useTranslation } from '@/lib/TranslationProvider';  export default function HomePage() {    const { t } = useTranslation();    const featured = getFeaturedProjects();    return (              {featured.map(project => (                        ### {t(project.title)}              {t(project.preview.tagline)}        ))}    );  }   `

### Get All Projects (Portfolio Page)

`   import { getAllProjects } from '@/data/projects';  const allProjects = getAllProjects();   `

### Get Single Project

`   import { getProjectBySlug } from '@/data/projects';  const project = getProjectBySlug('my-new-project');   `

Translation Key Naming Convention
---------------------------------

Follow this structure consistently:

`   section.subsection.field  section.subsection.nested.field  Examples:  homepage.hero_title  nav.contact.email  portfolio.dosxdos_web.preview.tagline  portfolio.common.cta.view_full_case   `

Common Tasks
------------

### Adding a New Page Section

1.  Add translations to appropriate locale file (homepage.json, nav.json, etc.)
    
2.  Use t() function in component
    
3.  Translate to all 3 languages
    

### Changing Existing Text

1.  Find the translation key in your component
    
2.  Update the text in all 3 language files (en/, fr/, es/)
    
3.  Do NOT change the key itself
    

### Adding a New Translation File

If you need a new section (e.g., about.json):

1.  Create locales/en/about.json, locales/fr/about.json, locales/es/about.json
    
2.  Update lib/TranslationProvider.tsx:
    

``   const loadTranslations = async (lang: Language) => {    const [nav, homepage, portfolio, about] = await Promise.all([      import(`@/locales/${lang}/nav.json`),      import(`@/locales/${lang}/homepage.json`),      import(`@/locales/${lang}/portfolio.json`),      import(`@/locales/${lang}/about.json`)  // Add this    ]);    const merged = {      nav: nav.default,      homepage: homepage.default,      portfolio: portfolio.default,      about: about.default  // Add this    };    setTranslations(merged);  };   ``

Important Notes
---------------

*   **Always add translations to all 3 languages** (en, fr, es)
    
*   **Keep translation keys consistent** across all language files
    
*   **Use descriptive key names** that explain what the content is
    
*   **Featured projects** (featured: true) appear on homepage
    
*   **Project slugs** stay the same across all languages (used in URLs)
    
*   **Media paths** are language-agnostic (same images for all languages)
    

Troubleshooting
---------------

**Translations not loading:**

*   Check browser console for import errors
    
*   Verify JSON syntax (use a JSON validator)
    
*   Ensure all 3 language files have the same key structure
    

**Missing translations showing keys:**

*   The key doesn't exist in the JSON file
    
*   Typo in the key name
    
*   Language file not loaded properly
    

**Project not appearing:**

*   Check if featured: true for homepage
    
*   Verify project is in data/projects.ts array
    
*   Ensure translation keys exist in portfolio.json