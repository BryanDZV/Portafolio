// src/types/Contact.ts

export interface SocialLinks {
  githubLabel: string;
  linkedinLabel: string;
}

export interface ContactPageData {
  pageTitle: string;
  description: string;
  emailLabel: string;
  email: string;
  backLink: string;
  availability: string; // Ej: "Disponible para nuevas oportunidades"
  location: string; // Ej: "Madrid, España"
  socials: SocialLinks;
}

export interface ContactSectionProps {
  data: ContactPageData;
  homeHref: string;
}
