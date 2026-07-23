import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Importamos las cookies

const ADMIN_PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

type UnauthenticatedStrategy = "throw" | "redirect-login";

interface RequireAdminSessionOptions {
  strategy?: UnauthenticatedStrategy;
  lang?: string;
}
//Se encarga solo de verificar si hay sesión.
//ESTE ARCHIVO ES PARA QUE SE PUEDA LEER Y VALIDAR EL TOKEN JWT QUE NOS ENVIA EL BACK QUE ESTA HECHO EN SPRING BOOT.
//SE SACA EL TOKEN DE LAS COOKIES DEL NAVEGADOR QUE YA SE HABIA GUARDADO EN EL ACTION DE LOGIN DE APP
export function isAdminProtectedPath(pathname: string) {
  return ADMIN_PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

export async function redirectIfAuthenticated(lang: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token && token.value) {
    redirect(`/${lang}/dashboard`);
  }
}

//DASHBOARD
export async function requireAdminSession(
  options: RequireAdminSessionOptions = {},
) {
  const { strategy = "throw", lang = "es" } = options;

  // 1. Buscamos nuestra "token" en las cookies del navegador. Si no existe, el usuario NO está logueado
  const cookieStore = await cookies(); // Obtenemos el gestor de cookies de Next.js
  const token = cookieStore.get("auth_token"); // Buscamos la cookie "auth_token" que contiene el token JWT del usuario

  // 2. Si el usuario TIENE la pulsera (el token JWT existe), le dejamos pasar
  if (token && token.value) {
    // ID falso de usuario temporalmente para que el código
    // antiguo de Next.js (como el rate-limit) no explote.
    return { user: { id: "admin-java" } };
  }

  // 3. Si NO tiene pulsera, lo echamos al login
  if (strategy === "redirect-login") {
    redirect(`/${lang}/login`);
  }
  throw new Error("No autorizado. Necesitas iniciar sesión.");
}
