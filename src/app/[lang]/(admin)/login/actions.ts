"use server";

import { createClient } from "@/lib/supabase/server";
import { parseLoginCredentials } from "@/lib/admin/action-validation";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { redirect } from "next/navigation";

export async function loginAction(lang: string, formData: FormData) {
  // QUE HACE: Centraliza la preparación del payload de autenticación antes de llamar al provider.
  // POR QUE SE ELIGIO: Mantener la validación en un módulo compartido evita drift entre acciones y mejora mantenibilidad.
  // COMO FUNCIONA: Parsea FormData con reglas comunes y, si falla, redirige al mismo estado de error de autenticación.
  // APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://supabase.com/docs/reference/javascript/auth-signinwithpassword
  let email = "";
  let password = "";
  try {
    const credentials = parseLoginCredentials(formData);
    email = credentials.email;
    password = credentials.password;

    // QUE HACE: Limita intentos de autenticación por identidad de login para mitigar fuerza bruta.
    // POR QUE SE ELIGIO: Aplicar el control en la server action evita depender de validaciones client-side triviales de evadir.
    // COMO FUNCIONA: Usa ventana fija en memoria por email normalizado y bloquea cuando se supera el umbral configurado.
    // APRENDE MAS: https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
    assertRateLimit("login", email);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Credenciales incorrectas";
    return redirect(`/${lang}/login?error=${encodeURIComponent(message)}`);
  }

  // 2. Invocamos a nuestro cliente de servidor de Supabase
  const supabase = await createClient();

  // 3. Intentamos iniciar sesión
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 4. Si hay error, recargamos la página con un aviso en la URL
  if (error) {
    return redirect(`/${lang}/login?error=Credenciales+incorrectas`);
  }

  // 5. Si es correcto, Supabase guardó la cookie.
  redirect(`/${lang}/dashboard`);
}
