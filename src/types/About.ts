// src/types/about.ts

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface TechStackCategory {
  categoryName: string;
  technologies: string[];
}

export interface AboutPageData {
  title: string;
  motto: string;
  headline: string;
  biographyTitle: string;
  biography: string[];
  techStackTitle: string;
  mainStack: TechStackCategory[];
  coreSkillsTitle: string;
  coreSkills: string[];
  experienceTitle: string;
  experiences: Experience[];
}

export interface AboutProfileProps {
  data: AboutPageData;
}
