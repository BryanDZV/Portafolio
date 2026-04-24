// QUE HACE: Restringe este módulo al servidor para impedir importación accidental desde componentes cliente.
// POR QUE SE ELIGIO: Evita fuga de lógica de acceso a datos al bundle del navegador y reduce superficie de exposición.
// COMO FUNCIONA: `server-only` dispara error de compilación si alguna ruta client intenta consumir este archivo.
// APRENDE MAS: https://orm.drizzle.team/docs/select y https://orm.drizzle.team/docs/rqb
import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { Project } from "@/types/Project";

// QUE HACE: Define la etiqueta canónica de invalidación para todas las lecturas del catálogo de proyectos.
// POR QUE SE ELIGIO: Un tag único habilita revalidación selectiva tras escrituras sin invalidar rutas no relacionadas.
// COMO FUNCIONA: Server Actions o handlers invocan `revalidateTag` con este valor para purgar entradas cacheadas asociadas.
// APRENDE MAS: https://orm.drizzle.team/docs/select y https://orm.drizzle.team/docs/rqb
export const PROJECTS_CACHE_TAG = "projects";

const getProjectsQuery = unstable_cache(
  // QUE HACE: Lee el catálogo de proyectos desde PostgreSQL y lo ordena por fecha de creación ascendente.
  // POR QUE SE ELIGIO: `unstable_cache` con tags reduce latencia y carga de base de datos en tráfico real, manteniendo invalidez selectiva tras mutaciones.
  // COMO FUNCIONA: Next.js persiste el resultado por clave y etiqueta; `revalidateTag` desde Server Actions invalida esta lectura sin limpiar toda la ruta.
  // APRENDE MAS: https://orm.drizzle.team/docs/select y https://orm.drizzle.team/docs/rqb
  async () => db.select().from(projects).orderBy(asc(projects.createdAt)),
  ["projects:list"],
  {
    tags: [PROJECTS_CACHE_TAG],
    revalidate: 300,
  },
);

// QUE HACE: Expone un punto de acceso estable para lectura de proyectos desde capas superiores (API/routes/components server).
// POR QUE SE ELIGIO: Encapsular errores y fallback en un único sitio evita duplicar políticas de resiliencia en consumidores.
// COMO FUNCIONA: Ejecuta la query cacheada y, ante fallo, registra error y retorna arreglo vacío para degradación controlada.
// APRENDE MAS: https://orm.drizzle.team/docs/select y https://orm.drizzle.team/docs/rqb
export async function getProjects(): Promise<Project[]> {
  try {
    const data = await getProjectsQuery();
    return data as Project[];
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}
