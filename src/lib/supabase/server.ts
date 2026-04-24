import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// QUE HACE: Crea cliente Supabase orientado a SSR/Server Actions con sincronización de cookies de sesión.
// POR QUE SE ELIGIO: Centralizar autenticación server-side reduce exposición de credenciales y evita inconsistencias de sesión.
// COMO FUNCIONA: Obtiene `cookieStore` de Next y delega get/set de cookies al adaptador de `createServerClient`.
// APRENDE MAS: https://supabase.com/docs/guides/auth/server-side/nextjs y https://supabase.com/docs/reference/javascript/auth-api
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // QUE HACE: Entrega a Supabase el estado actual de cookies de la request.
        // POR QUE SE ELIGIO: Permite resolver sesión vigente sin acoplar la librería a detalles de Next internamente.
        // COMO FUNCIONA: Retorna el array completo desde `cookieStore` para que Supabase procese tokens/auth metadata.
        // APRENDE MAS: https://supabase.com/docs/guides/auth/server-side/nextjs y https://supabase.com/docs/reference/javascript/auth-api
        getAll() {
          return cookieStore.getAll();
        },
        // QUE HACE: Persiste cambios de cookies emitidos por Supabase tras refresco o actualización de sesión.
        // POR QUE SE ELIGIO: Sin esta escritura la sesión podría quedar desincronizada entre respuesta y estado del navegador.
        // COMO FUNCIONA: Itera cookies a establecer y las registra en `cookieStore` con sus opciones originales.
        // APRENDE MAS: https://supabase.com/docs/guides/auth/server-side/nextjs y https://supabase.com/docs/reference/javascript/auth-api
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            console.warn(
              "[supabase-server] No se pudieron sincronizar cookies en este contexto de ejecución.",
            );
          }
        },
      },
    },
  );
}
