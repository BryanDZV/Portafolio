"use server";

import { parseLoginCredentials } from "@/lib/admin/action-validation";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { redirect } from "next/navigation";

export async function loginAction(lang: string, formData: FormData) {
  let email = "";
  try {
    const credentials = parseLoginCredentials(formData);
    email = credentials.email;

    assertRateLimit("login", email);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Credenciales incorrectas";
    return redirect(`/${lang}/login?error=${encodeURIComponent(message)}`);
  }

  return redirect(`/${lang}/login?error=Autenticacion+no+configurada`);
}
