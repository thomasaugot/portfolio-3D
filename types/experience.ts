export type ExperienceType = "work" | "education";

export interface Experience {
  id: string;
  type: ExperienceType;
  period: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  tech?: string;
  current?: boolean;
}