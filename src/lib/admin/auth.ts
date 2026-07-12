import { redirect } from "next/navigation";

const ADMIN_PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

type UnauthenticatedStrategy = "throw" | "redirect-login";

interface RequireAdminSessionOptions {
  strategy?: UnauthenticatedStrategy;
  lang?: string;
}

export function isAdminProtectedPath(pathname: string) {
  return ADMIN_PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

export async function requireAdminSession(
  options: RequireAdminSessionOptions = {},
) {
  const { strategy = "throw", lang = "es" } = options;

  if (strategy === "redirect-login") {
    redirect(`/${lang}/login`);
  }
  throw new Error("No autorizado");
}
