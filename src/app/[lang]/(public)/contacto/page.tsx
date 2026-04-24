import Link from "next/link";
import { getDictionary } from "@/app/dictionaries/getDictionary";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // QUE HACE: Resuelve el idioma dinámico de la URL para cargar traducciones específicas.
  // POR QUE SE ELIGIO: Mantiene consistencia i18n en todas las páginas del sitio.
  const { lang } = await params;

  // QUE HACE: Carga el diccionario según el idioma actual.
  // POR QUE SE ELIGIO: Centraliza i18n y reutiliza la misma lógica que en la página principal.
  const dictionary = await getDictionary(lang);

  return (
    <main className="relative min-h-[70vh] px-6 md:px-12 pt-32 pb-16 pointer-events-auto">
      <section
        id="contacto"
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-10"
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          {dictionary.contact.page_title}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {dictionary.contact.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:bryanzavaladev@gmail.com"
            aria-label={dictionary.contact.email_label}
            className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm md:text-base font-medium text-primary"
          >
            {dictionary.contact.email}
          </a>
          <Link
            href={`/${lang}`}
            aria-label={dictionary.contact.back_link}
            className="inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm md:text-base font-medium text-foreground"
          >
            {dictionary.contact.back_link}
          </Link>
        </div>
      </section>
    </main>
  );
}
