import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminProtectedPath } from "@/lib/admin/auth";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// 1. CONFIGURACIÓN DE i18n

export const locales = ["es", "en"];
export const defaultLocale = "es";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

// QUE HACE: Intercepta requests para orquestar la internacionalización (i18n) y sincronizar la sesión de Supabase.
// POR QUE SE ELIGIO: Centralizar todo en el proxy (Next 16+) evita conflictos de ruteo y asegura que la validación ocurra en la capa de borde de Vercel.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- PASO 1: Ignorar estáticos, api y assets tempranos que no se ejecute el proxy ---
  if (
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // 2. CAPA DE INTERNACIONALIZACIÓN (i18n)

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Si no tiene idioma (ej. entra a tusitio.com/dashboard), lo redirigimos forzosamente al idioma (ej. /es/dashboard)
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Extraemos el idioma actual y creamos una ruta "limpia" para que tu lib de auth siga funcionando.
  // Ej: "/es/dashboard" -> currentLocale = "es", pathnameWithoutLocale = "/dashboard"
  const currentLocale = pathname.split("/")[1];
  const pathnameWithoutLocale =
    pathname.replace(`/${currentLocale}`, "") || "/";

  // 3. CAPA DE AUTENTICACIÓN (Supabase)

  let supabaseResponse = NextResponse.next({ request });

  // QUE HACE: Crea cliente SSR de Supabase con adaptador de cookies del request/response del proxy.
  // POR QUE SE ELIGIO: Este puente mantiene tokens de auth consistentes entre Supabase y ciclo HTTP de Next.
  // COMO FUNCIONA: `getAll` lee cookies entrantes y `setAll` refleja cambios en request y en la respuesta que se devolverá.
  // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/middleware y https://supabase.com/docs/guides/auth/server-side/nextjs
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // QUE HACE: Entrega cookies actuales al cliente Supabase para reconstruir contexto de sesión.
        // POR QUE SE ELIGIO: Sin esta lectura Supabase no puede validar token ni determinar usuario autenticado.
        // COMO FUNCIONA: Retorna arreglo completo de cookies del request en cada ejecución del proxy.
        // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/middleware y https://supabase.com/docs/guides/auth/server-side/nextjs
        getAll() {
          return request.cookies.getAll();
        },
        // QUE HACE: Persiste cualquier actualización de cookies emitida por Supabase durante refresh de sesión.
        // POR QUE SE ELIGIO: Garantiza continuidad de autenticación en solicitudes posteriores y evita logout involuntario.
        // COMO FUNCIONA: Escribe cookies en request, recrea respuesta base y replica cookies finales en `supabaseResponse`.
        // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/middleware y https://supabase.com/docs/guides/auth/server-side/nextjs
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // QUE HACE: Registra fallos críticos de autenticación
  if (error && error.message !== "Auth session missing!") {
    console.warn("[proxy] Fallo crítico al resolver sesión en capa de borde.", {
      message: error.message,
      pathname: request.nextUrl.pathname,
    });
  }

  // QUE HACE: Bloquea acceso usando la ruta limpia, pero redirige usando la ruta internacionalizada.
  // POR QUE SE ELIGIO: Esto evita que tengas que reescribir `isAdminProtectedPath` para soportar múltiples idiomas.
  if (isAdminProtectedPath(pathnameWithoutLocale) && !user) {
    const url = request.nextUrl.clone();
    // Redirigimos al login manteniendo el idioma del usuario (ej: /en/login)
    url.pathname = `/${currentLocale}/login`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// QUE HACE: Define alcance del proxy sobre rutas de aplicación excluyendo estáticos y assets.
// POR QUE SE ELIGIO: Limitar matcher reduce overhead en recursos que no requieren autenticación ni manipulación de cookies.
// COMO FUNCIONA: Expresión regular negativa omite `_next`, favicon e imágenes comunes y aplica el proxy al resto.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/routing/middleware y https://supabase.com/docs/guides/auth/server-side/nextjs
export const config = {
  // El matcher unificado
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
