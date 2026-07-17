import { getProjects } from "@/lib/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { logoutAction, deleteProjectAction } from "./actions";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";
import { AnimatedFadeIn } from "@/components/ui/AnimatedFadeIn";
import { requireAdminSession } from "@/lib/admin/auth";

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const search = await searchParams;
  
  await requireAdminSession({ strategy: "redirect-login", lang });

  const projects = await getProjects();
  
  // 1. Miramos si en la URL hay un parámetro ?edit=ID
  const editingId = search.edit as string;
  const projectToEdit = editingId ? projects.find(p => p.id === editingId) : null;

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <AnimatedFadeIn>
          <header className="flex justify-between items-center border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-bold font-(family-name:--font-geist-mono)">
                PANEL <span className="text-primary">DE CONTROL</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Gestor CRUD de Proyectos Inmersivos.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Web
              </Link>
              <form action={logoutAction.bind(null, lang)}>
                <button
                  type="submit"
                  className="text-sm font-medium text-muted-foreground hover:text-destructive uppercase tracking-wider transition-colors"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </header>
        </AnimatedFadeIn>

        <AnimatedFadeIn delay={0.08}>
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {editingId && (
                <Link
                  href={`/${lang}/dashboard`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Nuevo Proyecto
                </Link>
              )}
            </div>
             {/* 2. Le pasamos el proyecto al formulario si estamos editando */}
            <CreateProjectForm
               projectToEdit={projectToEdit}
            />
          </section>
        </AnimatedFadeIn>

        <AnimatedFadeIn delay={0.14}>
          <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Base de Datos: Proyectos</CardTitle>
              <CardDescription>
                Total de registros activos: {projects.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="p-4 font-medium text-muted-foreground">Título</th>
                      <th className="p-4 font-medium text-muted-foreground">Tech Stack</th>
                      <th className="p-4 font-medium text-muted-foreground text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-muted-foreground">
                          No hay proyectos.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr
                          key={project.id}
                          className="border-b border-border last:border-0 hover:bg-muted/50"
                        >
                          <td className="p-4 font-medium">{project.title}</td>
                          <td className="p-4 font-(family-name:--font-geist-mono) text-primary/80">
                            {Array.isArray(project.techStack)
                              ? project.techStack.join(", ")
                              : project.techStack}
                          </td>
                          <td className="p-4 text-right flex justify-end gap-4 items-center">
                            
                            {/* 3. BOTÓN DE EDITAR: Ahora es un Link que añade ?edit=ID a la URL */}
                            <Link
                              href={`/${lang}/dashboard?edit=${project.id}`}
                              className="text-xs uppercase text-cyan-500 font-bold hover:text-cyan-300 transition-colors"
                            >
                              Editar
                            </Link>

                            <form
                              action={deleteProjectAction.bind(null, project.id)}
                            >
                              <button
                                type="submit"
                                className="text-xs uppercase font-bold text-destructive hover:text-red-400 transition-colors"
                              >
                                Borrar
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </AnimatedFadeIn>
      </div>
    </main>
  );
}