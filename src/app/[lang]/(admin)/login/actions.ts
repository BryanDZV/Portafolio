"use server";

import { parseLoginCredentials } from "@/lib/admin/action-validation";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; //gestor de cookies de Next.js

//ESTE ARCHIVO ES EL QUE SE ENCARGA DE LA LÓGICA DEL LOGIN, ES DECIR, DE COMUNICARSE CON EL BACKEND PARA VALIDAR LAS CREDENCIALES Y GUARDAR EL TOKEN EN UNA COOKIE SEGURA.
export async function loginAction(lang: string, formData: FormData) {
  try {
    // 1. Sacamos el email y contraseña del formulario
    const credentials = parseLoginCredentials(formData);

    // 2. Llamamos a tu portero de discoteca en Spring Boot
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //los header son necesarios para que el backend sepa que le estamos enviando JSON
      body: JSON.stringify({
        // Ajusta la estructura según backend
        email: credentials.email, // Ajusta si en tu backend Java
        password: credentials.password,
      }),
    });

    if (!res.ok) {
      throw new Error("Credenciales incorrectas");
    }

    // 3. Spring Boot nos devuelve el Token JWT
    const data = await res.json();
    const token = data.token; // Ajusta esto si tu backend devuelve {"jwt": "..."} o {"accessToken": "..."}

    // 4. Guardamos la pulsera VIP en una Cookie segura del navegador
    (await cookies()).set("auth_token", token, {
      httpOnly: true, // Seguridad extra: evita que hackers roben el token con JavaScript
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // El token dura 1 día
      path: "/", // La cookie es accesible desde cualquier ruta de la web
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al iniciar sesión";
    return redirect(`/${lang}/login?error=${encodeURIComponent(message)}`);
  }

  // 5. Si todo fue bien, redirigimos al Dashboard
  return redirect(`/${lang}/dashboard`);
}
