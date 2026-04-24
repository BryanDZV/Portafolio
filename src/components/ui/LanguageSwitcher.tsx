"use client";

import { usePathname, useRouter } from "next/navigation";
import { m } from "framer-motion";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLang = currentLang === "es" ? "en" : "es";

    // Evitar errores si el pathname no está listo
    if (!pathname) return;

    // Sustituye el /es/ por /en/ en la URL actual
    const newPath = pathname.replace(`/${currentLang}`, `/${nextLang}`);

    // Navegación nativa de Next.js sin recargar la página
    router.push(newPath);
  };

  return (
    <m.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-secondary/80 border border-border text-foreground hover:bg-primary/20 hover:text-primary transition-colors font-mono text-xs md:text-sm font-bold uppercase shadow-sm"
      aria-label={`Cambiar idioma a ${currentLang === "es" ? "Inglés" : "Español"}`}
    >
      {currentLang}
    </m.button>
  );
}
