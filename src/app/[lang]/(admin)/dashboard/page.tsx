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
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // QUE HACE: Protege el panel validando sesión en el propio Server Component.
  await requireAdminSession({ strategy: "redirect-login", lang });

  const projects = await getProjects();

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* CABECERA CON BOTÓN DE SALIDA Y ENLACE A LA WEB */}
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
              <div className="text-sm text-primary animate-pulse font-(family-name:--font-geist-mono) hidden md:block">
                [Sesión Activa]
              </div>

              {/*BOTÓN DE IR AL PORTAFOLIO */}
              <Link
                href={`/${lang}`}
                //target="_blank" // Abre en pestaña nueva para no cerrar tu sesión de dashboard
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

        {/* FORMULARIO  */}
        <AnimatedFadeIn delay={0.08}>
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 font-(family-name:--font-geist-mono) text-primary">
              [+] Añadir Nuevo Proyecto
            </h2>
            <CreateProjectForm />
          </section>
        </AnimatedFadeIn>

        {/* TABLA DE DATOS */}
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
                      <th className="p-4 font-medium text-muted-foreground">
                        Título
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Tech Stack
                      </th>
                      <th className="p-4 font-medium text-muted-foreground text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-muted-foreground"
                        >
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

                          <td className="p-4 text-right flex justify-end gap-4">
                            <button
                              disabled
                              className="text-xs uppercase text-muted-foreground/50 cursor-not-allowed"
                            >
                              Editar
                            </button>

                            <form
                              action={deleteProjectAction.bind(
                                null,
                                project.id,
                              )}
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
