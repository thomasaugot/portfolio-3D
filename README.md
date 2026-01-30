# 3D Portfolio
### Translation & Project Data System Documentation

## Table of Contents
- [Setup](#setup)
- [Overview](#overview)
- [File Structure](#file-structure)
- [Translation System](#translation-system)
  - [How It Works](#how-it-works)
  - [Adding New Translations](#adding-new-translations)
  - [Translation Key Naming](#translation-key-naming)
- [Project Data System](#project-data-system)
  - [Adding New Projects](#adding-new-projects)
  - [Using Projects in Components](#using-projects-in-components)
- [Blog System](#blog-system)
  - [How It Works](#how-it-works-blog)
  - [Auto-Updates](#auto-updates)
  - [Updating Articles](#updating-articles)
- [Common Tasks](#common-tasks)
- [Adding a New Translation File](#adding-a-new-translation-file)
- [Important Notes](#important-notes)
- [Troubleshooting](#troubleshooting)
- [Animation & Three.js Setup](#animation--threejs-setup)
  - [File Structure](#file-structure-1)
  - [GSAP Animations](#gsap-animations)
  - [Three.js Scenes](#threejs-scenes)
  - [Loading State](#loading-state)
  - [Rules](#rules)

---

## Setup

### Quick Start (After Deploy)

Run this ONCE after deploying to Vercel:

```bash
curl -X POST https://your-domain.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_ADMIN_PASSWORD"}'
```

This automatically:
1. ✅ Runs database migration (adds translation columns)
2. ✅ Seeds all articles from Medium
3. ✅ Translates everything to FR & ES

### Environment Variables

Set these in Vercel:
- `ADMIN_PASSWORD` - Your admin password
- `GOOGLE_TRANSLATE_API_KEY` - Get it [here](https://console.cloud.google.com/apis/credentials)

### Adding New Articles

1. Publish on Medium (in English)
2. Go to `/admin` → Login
3. Go to `/blog` → Click "Update Articles"

New article gets translated and added to all 3 languages automatically.

---

## Overview

This portfolio uses a custom translation system with nested locale files and a centralized project data structure.
All content is managed through TypeScript types and JSON translation files.

---

## File Structure

```
types/
  └── project.ts
data/
  └── projects.ts
lib/
  └── TranslationProvider.tsx
hooks/
  ├── useTranslationReady.ts
  └── useLanguageToggle.ts
locales/
  ├── en/
  │   ├── nav.json
  │   ├── homepage.json
  │   └── portfolio.json
  ├── fr/
  │   └── (same structure)
  └── es/
      └── (same structure)
```

---

## Translation System

### How It Works

The system loads three JSON files per language and merges them into one object:

```json
{
  "nav": { },
  "homepage": { },
  "portfolio": { }
}
```

Translation keys use dot notation:

```tsx
t("homepage.hero_title")
```

---

### Adding New Translations

#### 1. Add Keys to All Language Files

Example (new section in homepage):

```json
{
  "new_section": {
    "title": "My New Section",
    "description": "Section description"
  }
}
```

Repeat for all languages.

#### 2. Use in Components

```tsx
import { useTranslation } from "@/lib/TranslationProvider";

export default function MyComponent() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t("homepage.new_section.title")}</h2>
      <p>{t("homepage.new_section.description")}</p>
    </>
  );
}
```

---

### Translation Key Naming

Follow this consistent pattern:

```
section.subsection.field
section.subsection.nested.field
```

Examples:
```
homepage.hero_title
nav.contact.email
portfolio.dosxdos_web.preview.tagline
portfolio.common.cta.view_full_case
```

---

## Project Data System

### Adding New Projects

#### 1. Update TypeScript Types

If the new project has different fields, edit `types/project.ts`.

#### 2. Add Project Data

In `data/projects.ts`:

```ts
{
  id: '005',
  slug: 'my-new-project',
  client: 'Client Name',
  title: 'portfolio.my_new_project.title',
  year: 2025,
  category: 'portfolio.categories.web_app',
  technologies: ['Next.js', 'TypeScript'],
  featured: true,
  preview: {
    tagline: 'portfolio.my_new_project.preview.tagline',
    description: 'portfolio.my_new_project.preview.description',
    keyPoints: [
      'portfolio.my_new_project.preview.key_points.point_1',
      'portfolio.my_new_project.preview.key_points.point_2',
      'portfolio.my_new_project.preview.key_points.point_3'
    ],
    cta: 'portfolio.common.cta.view_full_case'
  },
  details: {
    challenge: 'portfolio.my_new_project.details.challenge',
    solution: 'portfolio.my_new_project.details.solution',
    technicalApproach: 'portfolio.my_new_project.details.technical_approach',
    results: 'portfolio.my_new_project.details.results',
    impact: [
      'portfolio.my_new_project.details.impact.impact_1',
      'portfolio.my_new_project.details.impact.impact_2'
    ]
  },
  media: {
    coverImage: '/projects/my-new-project/cover.jpg',
    coverVideo: '/projects/my-new-project/cover-video.mp4',
    images: [
      '/projects/my-new-project/screenshot-1.jpg',
      '/projects/my-new-project/screenshot-2.jpg'
    ]
  }
}
```

#### 3. Add Translations

Add to `locales/en/portfolio.json` (and repeat for fr/es).

#### 4. Add Media Files

```
/public/projects/my-new-project/
  ├── cover.jpg
  ├── cover-video.mp4
  ├── screenshot-1.jpg
  └── screenshot-2.jpg
```

---

### Using Projects in Components

```tsx
import { getFeaturedProjects } from '@/data/projects';
import { useTranslation } from '@/lib/TranslationProvider';

export default function HomePage() {
  const { t } = useTranslation();
  const featured = getFeaturedProjects();

  return (
    <>
      {featured.map(project => (
        <div key={project.id}>
          <h3>{t(project.title)}</h3>
          <p>{t(project.preview.tagline)}</p>
        </div>
      ))}
    </>
  );
}
```

---

## Blog System

### How It Works (Blog)

The blog displays your Medium articles with a **hybrid auto-updating system**:

**Architecture:**
```
Blog Page → API Route → Hybrid System:
  1. RSS Feed (10 most recent articles) - Auto-updates every hour
  2. Static TypeScript File (All articles with full content) - Manual updates
```

**Key Features:**
- ✅ **Auto-updates**: 10 most recent articles fetch automatically from Medium RSS
- ✅ **Full content**: All articles stored locally with complete text (300-1500 words each)
- ✅ **Real metadata**: Categories, dates, read times, images
- ✅ **No manual work**: New articles (1-10) appear automatically within 1 hour

---

### Auto-Updates

**How it works:**
1. API fetches Medium RSS feed every hour (`/app/api/blog/route.ts`)
2. Gets 10 most recent articles with full content and categories
3. Merges with static TypeScript file (`data/medium-articles.ts`) for older articles
4. Returns combined list to blog page

**Cache Settings:**
- RSS feed: 1 hour cache (`revalidate: 3600`)
- Static file: Read on every request, changes persist

**What this means:**
- Publish 1-10 new articles → **Shows up automatically** ✅
- No manual intervention needed for day-to-day blogging ✅

---

### Updating Articles

**When to run the scraper:**

You ONLY need to update the static file when:
1. You've published **MORE than 10 new articles** since last update
2. You want to refresh full content for older articles
3. **Typically: Once every 6-12 months**

**How to update:**

```bash
# Run the article scraper
node scripts/update-medium-articles.js
```

**What it does:**
- Scrapes ALL your Medium articles with stealth browser
- Extracts full content (not just excerpts)
- Gets real categories, dates, read times, images
- Saves to `data/medium-articles.ts`
- Takes ~30-60 seconds for 20-30 articles

**Output:**
```
✅ 22 articles with FULL CONTENT
   Total: 22
   With full content: 22
   With categories: 21
   Avg words: 628
```

**Technical details:**
- Uses `puppeteer-extra` with stealth plugin
- Bypasses Medium's Cloudflare protection
- Extracts full article content from HTML
- Rate-limited to avoid triggering blocks
- 95%+ success rate

**File locations:**
- Script: `scripts/update-medium-articles.js`
- Data: `data/medium-articles.ts`
- API: `app/api/blog/route.ts`

---

## Common Tasks

| Task | Steps |
|------|-------|
| Add new section | Add keys → Use `t()` → Translate all languages |
| Change text | Edit text in all language files |
| Add new file | Create JSON files → Update `TranslationProvider.tsx` |
| Publish new blog post | Write on Medium → Wait 1 hour → Auto-appears on blog ✅ |
| Update blog articles | `node scripts/update-medium-articles.js` (rarely needed) |

---

## Adding a New Translation File

Example (`about.json`):

```ts
const loadTranslations = async (lang: Language) => {
  const [nav, homepage, portfolio, about] = await Promise.all([
    import(`@/locales/${lang}/nav.json`),
    import(`@/locales/${lang}/homepage.json`),
    import(`@/locales/${lang}/portfolio.json`),
    import(`@/locales/${lang}/about.json`)
  ]);

  setTranslations({
    nav: nav.default,
    homepage: homepage.default,
    portfolio: portfolio.default,
    about: about.default
  });
};
```

---

## Important Notes

- Add translations for **en**, **fr**, **es**.
- Keep translation keys consistent.
- Featured projects appear on the homepage.
- Slugs are shared across languages.
- Media paths are language-agnostic.

---

## Troubleshooting

**Translations not loading**
- Check browser console for import errors.
- Validate JSON syntax.
- Ensure all language files share the same structure.

**Missing translations showing keys**
- Key missing or misspelled.

**Project not appearing**
- Not marked `featured: true`.
- Missing from `projects.ts`.
- Missing translation key.

---

## Animation & Three.js Setup

### File Structure

```
lib/animations/
  ├── gsap.ts
  ├── three.ts
  └── index.ts
utils/animations/
  └── [name]-animations.ts
hooks/
  ├── useAppReady.ts
  └── useThreeScene.ts
```

### GSAP Animations

```ts
import { gsap } from "@/lib/animations";

export function initMyAnimation() {
  const el = document.querySelector('[data-animate="my-thing"]');
  if (!el) return;
  gsap.to(el, { opacity: 1, y: 0, duration: 1 });
}
```

### Three.js Scenes

```ts
import { THREE } from "@/lib/animations";

export function initMyScene() {
  const container = document.querySelector('[data-3d-container="my-scene"]');
  if (!container) return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  container.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return () => {
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
```

### Loading State

```tsx
<LoadingProvider criticalSelectors={['[data-3d-container="my-scene"]']}>
  {children}
</LoadingProvider>
```

### Rules

- Always check element existence before animating.
- Use `data-animate` for GSAP targets.
- Use `data-3d-container` for Three.js containers.
- Return cleanup in Three.js init functions.
- Call GSAP inits inside `useGSAP()`.
