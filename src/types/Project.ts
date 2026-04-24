export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  createdAt: Date;
}
