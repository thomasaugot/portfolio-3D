export type MockupVariant = "laptop" | "mobile" | "tablet" | "desktop" | "browser";

export interface MockupProps {
  variant: MockupVariant;
  src: string;
  alt: string;
  className?: string;
}