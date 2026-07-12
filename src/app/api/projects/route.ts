import { NextResponse } from "next/server";
import { getProjects } from "@/lib/queries";

export async function GET() {
  try {
    const data = await getProjects();

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
    console.error("Error critico en la API de proyectos:", error);

    return NextResponse.json(
      { error: "Error interno del servidor al cargar los datos." },
      { status: 500 },
    );
  }
}
