export interface MenuItem {
  id: string
  labelKey: string
  descriptionKey: string
  href: string
  order: number
}

export interface LocalizedMenuItem extends MenuItem {
  label: string
  description: string
}

export interface MenuAnimationState {
  isOpen: boolean
  isAnimating: boolean
}

export type MenuAnimationPhase = 'opening' | 'closing' | 'idle'