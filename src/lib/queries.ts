import "server-only";

import { Project } from "@/types/Project";

//constantes de caché
export const PROJECTS_CACHE_TAG = "projects";

// FUNCIÓN CONECTADA A SPRING BOOT
export async function getProjects(): Promise<Project[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definida");
  }

  try {
    // Hacemos el fetch a tu backend en el puerto 8080
    const res = await fetch(`${apiUrl}/api/projects`, {
      //ABAJO ESTAMOS CONFIGURANDO LA CACHÉ PARA QUE SE REVALIDE CADA 5 MINUTOS (300 SEGUNDOS)
      // Esto es útil para no sobrecargar el backend y mantener la UI actualizada
      next: { tags: [PROJECTS_CACHE_TAG], revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo proyectos de Spring Boot:", error);
    return []; // Devolvemos un array vacío para que no explote la UI si el backend está apagado
  }
}
