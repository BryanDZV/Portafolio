"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { PROJECTS_CACHE_TAG } from "@/lib/queries";
import { requireAdminSession } from "@/lib/admin/auth";
import { cookies } from "next/headers";

// LOS ARCHIVOS ACTION SIRVEN PARA QUE EL FRONTEND SE COMUNIQUE CON EL BACKEND, ES DECIR, PARA QUE EL FRONT LE DIGA AL BACK QUE QUIERE CREAR UN PROYECTO, BORRAR UN PROYECTO O CERRAR SESIÓN. ESTOS ACTIONS SON LLAMADOS DESDE LOS COMPONENTES DE REACT DEL DASHBOARD.
//ESTE ARCHIVO ES EL QUE SE ENCARGA DE LA LÓGICA DEL DASHBOARD, ES DECIR, DE COMUNICARSE CON EL BACKEND PARA CREAR Y BORRAR PROYECTOS, ASÍ COMO CERRAR SESIÓN.

// 1. ACCIÓN DE CERRAR SESIÓN
export async function logoutAction(lang: string) {
  // Le quitamos la pulsera (borramos la cookie) y lo echamos al inicio
  (await cookies()).delete("auth_token");
  redirect(`/${lang}`);
}

// 2. ACCIÓN DE CREAR PROYECTO
export async function createProjectAction(formData: FormData) {
  // 1. Verificamos que el usuario está logueado
  await requireAdminSession({ strategy: "throw" });

  // 2. Sacamos la pulsera VIP (Token) de la cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // 3. Ajuste importante: Tu frontend quizás manda la imagen como 'imageFile',
  // pero tu Java espera que se llame 'image' (por el @RequestParam("image")).
  const imageFile = formData.get("imageFile");
  if (imageFile) {
    formData.delete("imageFile");
    formData.append("image", imageFile);
  }

  // 4. Enviamos todo a Java
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // NUNCA pongas "Content-Type": "multipart/form-data" a mano en un fetch
      // cuando envías un FormData. El navegador/Next.js lo añade automáticamente con
      // unos códigos invisibles (boundaries) para separar la imagen de los textos.
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Spring Boot rechazó el proyecto. ¿Faltan campos?");
  }

  // 5. Le decimos a Next.js que borre su caché y actualice la pantalla visualmente
  revalidatePath("/dashboard", "page");
  revalidatePath("/", "page");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}

// 3. ACCIÓN DE BORRAR PROYECTO
export async function deleteProjectAction(id: string) {
  await requireAdminSession({ strategy: "throw" });

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Enseñamos la credencial para poder borrar
    },
  });

  if (!res.ok) {
    throw new Error("Error al borrar el proyecto en Spring Boot");
  }

  revalidatePath("/dashboard", "page");
  revalidatePath("/", "page");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}
// 4. ACCIÓN DE ACTUALIZAR PROYECTO
export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdminSession({ strategy: "throw" });

  const token = (await cookies()).get("auth_token")?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Ajustamos la imagen: Solo la enviamos si el usuario seleccionó una foto nueva
  const imageFile = formData.get("imageFile") as File;
  if (imageFile && imageFile.size > 0) {
    formData.delete("imageFile");
    formData.append("image", imageFile);
  } else {
    // Si no hay imagen nueva, borramos el campo para que Java sepa que no debe actualizar la foto
    formData.delete("imageFile");
  }

  // Hacemos un PUT a tu Spring Boot (Asegúrate de que tu endpoint en Java sea @PutMapping("/{id}"))
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error al actualizar el proyecto en Spring Boot");
  }

  revalidatePath("/dashboard", "page");
  revalidatePath("/", "page");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}
