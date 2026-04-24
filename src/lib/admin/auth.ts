import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

type UnauthenticatedStrategy = "throw" | "redirect-login";

interface RequireAdminSessionOptions {
  strategy?: UnauthenticatedStrategy;
  lang?: string;
}

// QUE HACE: Determina si una ruta pertenece al perímetro administrativo protegido por sesión.
// POR QUE SE ELIGIO: Centralizar la política de rutas evita divergencia entre proxy, páginas server y acciones mutables.
// COMO FUNCIONA: Evalúa el pathname contra prefijos permitidos y devuelve un booleano para decisiones de acceso.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/middleware y https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
export function isAdminProtectedPath(pathname: string) {
  return ADMIN_PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

// QUE HACE: Resuelve y valida la sesión de operador para uso compartido en páginas y server actions admin.
// POR QUE SE ELIGIO: Un único guard reduce duplicación, mantiene consistencia de seguridad y simplifica mantenimiento.
// COMO FUNCIONA: Obtiene cliente Supabase SSR, consulta usuario autenticado y aplica estrategia configurable ante ausencia de sesión.
// APRENDE MAS: https://supabase.com/docs/guides/auth/server-side/nextjs y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
export async function requireAdminSession(
  options: RequireAdminSessionOptions = {},
) {
  const { strategy = "throw", lang = "es" } = options;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.warn(
      "[auth] Fallo al resolver usuario autenticado en contexto admin.",
      { message: error.message },
    );
  }

  if (!user) {
    if (strategy === "redirect-login") {
      redirect(`/${lang}/login`);
    }
    throw new Error("No autorizado");
  }

  return { supabase, user };
}
