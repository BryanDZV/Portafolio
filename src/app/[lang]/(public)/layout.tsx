import { BackgroundScene } from "@/components/3d/BackgroundScene";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDictionary } from "@/app/dictionaries/getDictionary";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // QUE HACE: Resuelve el idioma dinámico para cargar traducciones del layout.
  // POR QUE SE ELIGIO: El layout necesita pasar diccionarios a Footer y posibles componentes compartidos.
  const { lang } = await params;

  // QUE HACE: Carga el diccionario según el idioma actual.
  // POR QUE SE ELIGIO: Centraliza i18n garantizando que Footer y otros componentes del layout tengan acceso a traducciones.
  const dictionary = await getDictionary(lang);

  // QUE HACE: Obtiene estado de autenticación para decidir CTA del Navbar público.
  // POR QUE SE ELIGIO: Para UI condicional no crítica usamos sesión desde cookie y evitamos una validación remota innecesaria por request.
  // COMO FUNCIONA: `getUser` valida la sesión con Supabase y devuelve un usuario confiable para condicionar la UI.
  // APRENDE MAS: https://nextjs.org/docs/app/api-reference/file-conventions/route-groups y https://nextjs.org/docs/app/api-reference/file-conventions/layout
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    // El layout para que el fondo quede detrás sin salir del contexto.
    <div className="relative isolate min-h-screen pointer-events-none">
      <BackgroundScene />
      {/* 3. LA BARRA DE NAVEGACIÓN GLOBAL */}
      <Navbar isLoggedIn={!!user} />

      {/* 4. EL CONTENIDO DE LA PÁGINA (Hero, Proyectos, etc.) */}
      <div className="relative z-10 pointer-events-none">{children}</div>
      {/* 2. EL FOOTER GLOBAL (pointer-events-auto para que los links funcionen) */}
      <div className="pointer-events-auto w-full">
        <Footer dictionary={dictionary.footer} lang={lang} />
      </div>
    </div>
  );
}
