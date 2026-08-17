"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreateProjectForm } from "./CreateProjectForm";
import type { Project } from "@/types/Project";

interface ProjectEditorProps {
  projects: Project[];
  lang: string;
}

export function ProjectEditor({ projects, lang }: ProjectEditorProps) {
  const searchParams = useSearchParams();
  const editingId = searchParams.get("edit");
  const projectToEdit = editingId
    ? projects.find((p) => p.id === editingId)
    : null;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        {editingId && (
          <Link
            href={`/${lang}/dashboard`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            + Nuevo Proyecto
          </Link>
        )}
      </div>
      <CreateProjectForm
        key={projectToEdit?.id || "create"}
        projectToEdit={projectToEdit}
      />
    </section>
  );
}
