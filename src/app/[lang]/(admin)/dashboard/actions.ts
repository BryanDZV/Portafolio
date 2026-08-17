"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { PROJECTS_CACHE_TAG } from "@/lib/queries";
import { requireAdminSession } from "@/lib/admin/auth";
import { cookies } from "next/headers";

async function handleApiError(res: Response, action: string) {
  const status = res.status;
  let body: string;
  try {
    body = await res.text();
  } catch {
    body = "(empty response body)";
  }
  console.error(`[${action}] Backend responded with ${status}:`, body);
  throw new Error(`${action} failed (HTTP ${status}): ${body.slice(0, 200)}`);
}

// 1. ACCIÓN DE CERRAR SESIÓN
export async function logoutAction(lang: string) {
  (await cookies()).delete("auth_token");
  redirect(`/${lang}`);
}

// 2. ACCIÓN DE CREAR PROYECTO
export async function createProjectAction(formData: FormData) {
  await requireAdminSession({ strategy: "throw" });

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // El frontend manda la imagen como 'imageFile', pero Java espera 'image'
  const imageFile = formData.get("imageFile");
  if (imageFile) {
    formData.delete("imageFile");
    formData.append("image", imageFile);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/projects`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    await handleApiError(res, "Create project");
  }

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
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    await handleApiError(res, "Delete project");
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

  const imageFile = formData.get("imageFile") as File;
  if (imageFile && imageFile.size > 0) {
    formData.delete("imageFile");
    formData.append("image", imageFile);
  } else {
    formData.delete("imageFile");
  }

  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    await handleApiError(res, "Update project");
  }

  revalidatePath("/dashboard", "page");
  revalidatePath("/", "page");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}
