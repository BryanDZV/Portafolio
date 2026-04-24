// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getProjects } from "@/lib/queries";
import { toApiProject } from "@/lib/projects-contract";

// QUE HACE: Expone endpoint GET para entregar catálogo de proyectos con contrato JSON estable.
// POR QUE SE ELIGIO: Separar acceso vía API desacopla consumidores externos del detalle interno de consulta/caching.
// COMO FUNCIONA: Invoca la capa de queries, serializa respuesta exitosa con status 200 y encapsula fallos con status 500.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function GET() {
  try {
    // QUE HACE: Obtiene datos desde la capa de acceso con cache y política de resiliencia.
    // POR QUE SE ELIGIO: Reusar `getProjects` evita duplicar lógica de lectura y mantiene consistencia entre rutas de consumo.
    // COMO FUNCIONA: La función retorna un arreglo tipado o fallback vacío si falla la consulta interna.
    // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
    const projects = await getProjects();
    const data = projects.map(toApiProject);

    // QUE HACE: Devuelve payload normalizado para el consumidor cliente/SSR.
    // POR QUE SE ELIGIO: Mantener un shape consistente `{ data }` simplifica parsing y manejo de estados en frontend.
    // COMO FUNCIONA: NextResponse.json serializa automáticamente y aplica código HTTP explícito.
    // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Error crítico en la API de proyectos:", error);

    // QUE HACE: Responde error controlado para no filtrar detalles internos de infraestructura.
    // POR QUE SE ELIGIO: Evitar exposición de stack traces reduce riesgo de fuga de información sensible.
    // COMO FUNCIONA: Emite mensaje genérico de servidor con status 500 manteniendo contrato predecible de error.
    // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
    return NextResponse.json(
      { error: "Error interno del servidor al cargar los datos." },
      { status: 500 },
    );
  }
}
