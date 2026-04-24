import type { Project } from "@/types/Project";

export interface ApiProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  createdAt: string;
}

// QUE HACE: Define la serialización canónica de proyectos para consumidores HTTP externos.
// POR QUE SE ELIGIO: Separar contrato API del modelo interno evita ambigüedad de tipos (Date vs string) y previene drift entre rutas.
// COMO FUNCIONA: Recibe entidad interna `Project` y retorna DTO plano JSON-safe con `createdAt` en ISO 8601.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers y https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
export function toApiProject(project: Project): ApiProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    techStack: project.techStack,
    liveUrl: project.liveUrl ?? null,
    githubUrl: project.githubUrl ?? null,
    createdAt: project.createdAt.toISOString(),
  };
}
