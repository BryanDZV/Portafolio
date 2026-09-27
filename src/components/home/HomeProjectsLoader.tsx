"use client";

import { useEffect, useState } from "react";
import { ColdStartLoader } from "@/components/ui/ColdStartLoader";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SectionTransition } from "@/components/ui/SectionTransition";
import type { Project } from "@/types/Project";
import type { ProjectsDictionary } from "@/types/ProjectSection";

type HomeProjectsLoaderProps = {
  dictionary: ProjectsDictionary;
};

export function HomeProjectsLoader({ dictionary }: HomeProjectsLoaderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", {
          signal: controller.signal,
        });

        if (!response.ok) {
          setProjects([]);
          return;
        }

        const payload: { data?: Project[] } = await response.json();
        setProjects(payload.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setProjects([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <ColdStartLoader />;
  }

  return (
    <SectionTransition delay={0.8}>
      <ProjectsSection projects={projects} dictionary={dictionary} />
    </SectionTransition>
  );
}
