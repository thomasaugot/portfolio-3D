export interface MenuItem {
  label: string
  href: string
  description: string
}

export const menuItems: MenuItem[] = [
  { label: 'Work', href: '/work', description: 'Selected projects & case studies' },
  { label: 'About', href: '/about', description: 'Background & expertise' },
  { label: 'Lab', href: '/lab', description: 'Experiments & prototypes' },
  { label: 'Contact', href: '/contact', description: 'Let\'s build something together' }
]