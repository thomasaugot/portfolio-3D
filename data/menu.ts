import { getLocalizedRoute } from "@/utils/navigation";
import type { Language } from "@/utils/route-translations";

export interface MenuItem {
  label: string;
  href: string;
  description: string;
  labelKey: string;
  descriptionKey: string;
}

export const menuItems: MenuItem[] = [
  { 
    label: 'Home', 
    href: '/', 
    description: 'Back to homepage',
    labelKey: 'nav.home',
    descriptionKey: 'nav.home_description'
  },
  { 
    label: 'About', 
    href: '/about', 
    description: 'Background & expertise',
    labelKey: 'nav.about',
    descriptionKey: 'nav.about_description'
  },
  { 
    label: 'Portfolio', 
    href: '/portfolio', 
    description: 'Selected projects & case studies',
    labelKey: 'nav.portfolio',
    descriptionKey: 'nav.portfolio_description'
  },
  { 
    label: 'Blog', 
    href: '/blog', 
    description: 'Thoughts on development & design',
    labelKey: 'nav.blog',
    descriptionKey: 'nav.blog_description'
  },
  { 
    label: 'Contact', 
    href: '/contact', 
    description: 'Let\'s build something together',
    labelKey: 'nav.contact.menu-item',
    descriptionKey: 'nav.contact_description'
  }
];

export function getLocalizedMenuItems(language: Language): Array<MenuItem & { localizedHref: string }> {
  return menuItems.map(item => ({
    ...item,
    localizedHref: getLocalizedRoute(item.href.slice(1), language) // Remove leading slash
  }));
}