"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { PROJECTS_CACHE_TAG } from "@/lib/queries";
import { requireAdminSession } from "@/lib/admin/auth";
import { assertRateLimit } from "@/lib/security/rate-limit";
import {
  assertValidProjectId,
  parseCreateProjectPayload,
  type CreateProjectPayload,
} from "@/lib/admin/action-validation";

// QUE HACE: Publica la imagen del proyecto en Storage y retorna su URL pública para persistencia.
// POR QUE SE ELIGIO: Aislar I/O de archivos simplifica pruebas de la acción y evita mezclar capas de infraestructura y dominio.
// COMO FUNCIONA: Genera path único, ejecuta upload al bucket y consulta getPublicUrl con la clave almacenada.
// APRENDE MAS: https://supabase.com/docs/guides/storage/uploads/standard-uploads y https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
async function uploadProjectImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageFile: File,
) {
  const fileExt = imageFile.name.split(".").pop() ?? "webp";
  const filePath = `hero-images/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("proyectos")
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error("Error detallado de Supabase:", uploadError);
    throw new Error("Fallo al subir la imagen");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("proyectos").getPublicUrl(filePath);

  return { publicUrl, filePath };
}

// QUE HACE: Elimina de Storage un archivo previamente subido cuando una operación posterior falla.
// POR QUE SE ELIGIO: En flujos no transaccionales (Storage + DB), la compensación evita residuos y costos innecesarios.
// COMO FUNCIONA: Ejecuta remove por path en el bucket y registra warning controlado si no puede limpiar el recurso.
// APRENDE MAS: https://supabase.com/docs/reference/javascript/storage-from-remove y https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction
async function rollbackProjectImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filePath: string,
) {
  const { error } = await supabase.storage.from("proyectos").remove([filePath]);

  if (error) {
    console.warn(
      "[dashboard-actions] No se pudo ejecutar rollback de imagen.",
      {
        message: error.message,
        filePath,
      },
    );
  }
}

// QUE HACE: Persiste la entidad proyecto en PostgreSQL usando payload ya validado por frontera.
// POR QUE SE ELIGIO: Separar persistencia permite evolucionar reglas de dominio sin tocar infraestructura de subida.
// COMO FUNCIONA: Inserta columnas normalizadas en Drizzle con tipos compatibles con el schema actual.
// APRENDE MAS: https://orm.drizzle.team/docs/insert y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
async function persistProject(
  payload: Omit<CreateProjectPayload, "imageFile"> & { imageUrl: string },
) {
  await db.insert(projects).values({
    title: payload.title,
    description: payload.description,
    techStack: payload.techStack,
    imageUrl: payload.imageUrl,
    liveUrl: payload.liveUrl,
    githubUrl: payload.githubUrl,
  });
}

export async function logoutAction(lang: string) {
  // 1. Llamamos al cliente seguro
  const supabase = await createClient();

  // 2. Le decimos a Supabase que destruya todas las sesiones
  await supabase.auth.signOut();

  // 3. Expulsamos al usuario de vuelta a la pantalla de login
  redirect(`/${lang}`);
}

// ACCIÓN 2: Crear Proyecto
export async function createProjectAction(formData: FormData) {
  // QUE HACE: Crea un proyecto persistiendo metadatos en PostgreSQL y la imagen en Supabase Storage.
  // POR QUE SE ELIGIO: Separamos binarios (Storage) de metadatos (DB) para escalar lecturas, minimizar tamaño de filas y facilitar CDN.
  // COMO FUNCIONA: valida sesión + payload, sube archivo al bucket, obtiene URL pública y registra la entidad; después invalida caché de rutas y tags.
  // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://nextjs.org/docs/app/api-reference/functions/revalidatePath
  const payload = parseCreateProjectPayload(formData);
  const { supabase, user } = await requireAdminSession({ strategy: "throw" });

  // QUE HACE: Limita la frecuencia de creación de proyectos por usuario autenticado.
  // POR QUE SE ELIGIO: Protege el sistema frente a envío masivo accidental o abuso del endpoint mutable.
  // COMO FUNCIONA: Usa el identificador del operador en ventana temporal y bloquea cuando supera el umbral.
  // APRENDE MAS: https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  assertRateLimit("create-project", user.id);

  const { publicUrl: imageUrl, filePath } = await uploadProjectImage(
    supabase,
    payload.imageFile,
  );

  try {
    await persistProject({
      title: payload.title,
      description: payload.description,
      techStack: payload.techStack,
      imageUrl,
      liveUrl: payload.liveUrl,
      githubUrl: payload.githubUrl,
    });
  } catch (error) {
    await rollbackProjectImage(supabase, filePath);
    throw error;
  }

  // 4. Purgar la caché para que la tabla y el inicio se actualicen inmediatamente
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}

// ACCIÓN 3: Borrar Proyecto
export async function deleteProjectAction(id: string) {
  // QUE HACE: Elimina un proyecto por UUID desde la capa de persistencia.
  // POR QUE SE ELIGIO: Validar formato + autorización evita borrados arbitrarios y reduce riesgo de abuso en endpoints mutables.
  // COMO FUNCIONA: verifica sesión y estructura del identificador, ejecuta DELETE parametrizado con Drizzle y purga caché de lectura.
  // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://nextjs.org/docs/app/api-reference/functions/revalidatePath
  const { user } = await requireAdminSession({ strategy: "throw" });

  // QUE HACE: Controla la frecuencia de borrado para reducir riesgo de ejecuciones destructivas en ráfaga.
  // POR QUE SE ELIGIO: Un límite por operador minimiza impacto de automatizaciones erróneas y abuso interno.
  // COMO FUNCIONA: Incrementa contador por `user.id` en una ventana corta y bloquea al superar el máximo permitido.
  // APRENDE MAS: https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  assertRateLimit("delete-project", user.id);

  assertValidProjectId(id);

  // 2. Drizzle que borre la fila
  await db.delete(projects).where(eq(projects.id, id));

  // 3. Purgar la caché para que la tabla desaparezca la fila al instante
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidateTag(PROJECTS_CACHE_TAG, "max");
}
