// src/app/[lang]/(public)/about/page.tsx

import { getDictionary } from "@/app/dictionaries/getDictionary";
import AboutProfile from "@/components/organisms/AboutProfile";
import { AboutPageData } from "@/types/About";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // Mapeamos los datos del diccionario para que cumplan estrictamente el contrato AboutPageData
  // IMPORTANTE: Asegúrate de añadir esta estructura a tus archivos JSON (es.json y en.json)
  const aboutData: AboutPageData = {
    title: dictionary.about.title,
    motto: dictionary.about.motto,
    headline: dictionary.about.headline,
    biographyTitle: dictionary.about.biographyTitle,
    biography: dictionary.about.biography,
    techStackTitle: dictionary.about.techStackTitle,
    mainStack: dictionary.about.mainStack,
    coreSkillsTitle: dictionary.about.coreSkillsTitle,
    coreSkills: dictionary.about.coreSkills,
    experienceTitle: dictionary.about.experienceTitle,
    experiences: dictionary.about.experiences,
  };

  return (
    <main className="relative min-h-[70vh] px-6 md:px-12 pt-32 pb-16 pointer-events-auto">
      <AboutProfile data={aboutData} />
    </main>
  );
}
