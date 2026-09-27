import { HeroSection } from "@/components/home/HeroSection";
import { HomeProjectsLoader } from "@/components/home/HomeProjectsLoader";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { getDictionary } from "@/app/dictionaries/getDictionary";
import { TechCarousel } from "@/components/ui/TechCarousel";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // QUE HACE: Resuelve el idioma dinámico que viene en la URL (/es o /en).
  // POR QUE SE ELIGIO: Permite que la página renderice contenido localizado desde servidor sin depender del cliente.
  const { lang } = await params;

  // QUE HACE: Carga el diccionario según el idioma actual.
  // POR QUE SE ELIGIO: Centraliza i18n en una sola fuente de verdad y aprovecha el fallback a español definido en getDictionary.
  const dictionary = await getDictionary(lang);

  return (
    <main className="relative">
      <SectionTransition>
        <HeroSection dictionary={dictionary.hero} />
      </SectionTransition>
      <TechCarousel />
      <HomeProjectsLoader dictionary={dictionary.projects} />

      {/* <SectionTransition delay={0.17} className="mt-16 md:mt-24">
        <AboutSection dictionary={dictionary.about} />
      </SectionTransition> */}
    </main>
  );
}
