"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";

interface FooterDictionary {
  tagline: string;
  navigation_title: string;
  nav_home: string;
  nav_projects: string;
  nav_about: string;
  nav_contact: string;
  back_to_top: string;
  copyright_rights: string;
  built_in: string;
}

export function Footer({
  dictionary,
  lang = "es",
}: {
  dictionary: FooterDictionary;
  lang?: string;
}) {
  // QUE HACE: Define la preferencia del usuario sobre las animaciones del sistema operativo.
  // POR QUE SE ELIGIO: Accesibilidad pura. Deshabilitar animaciones pesadas para usuarios con sensibilidad al movimiento es un estándar de UX (WCAG).
  const shouldReduceMotion = useReducedMotion() ?? false;

  const footerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const footerItemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <m.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative w-full border-t border-border bg-card/70 backdrop-blur-lg z-20 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center md:items-start">
          <m.div
            variants={footerItemVariants}
            className="flex flex-col items-center md:items-start text-center md:text-left space-y-4"
          >
            <Link
              href={`/${lang}`}
              className="text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              ZAVALA<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground text-base max-w-xs leading-relaxed">
              {dictionary.tagline}
            </p>
          </m.div>

          <m.div
            variants={footerItemVariants}
            className="flex flex-col items-center space-y-4"
          >
            <h4 className="text-foreground font-bold tracking-wider text-base uppercase">
              {dictionary.navigation_title}
            </h4>
            <nav className="flex flex-col space-y-2 text-center">
              {/* QUE HACE: Rutas numéricas con idioma dinámico */}
              {/* POR QUE SE ELIGIO: Garantiza que la navegación funcione desde cualquier página preservando el idioma actual (ej: desde /es/contacto → /es/#hero) */}
              <Link
                href={`/${lang}/#hero`}
                className="text-muted-foreground hover:text-foreground text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {dictionary.nav_home}
              </Link>
              <Link
                href={`/${lang}/#proyectos`}
                className="text-muted-foreground hover:text-foreground text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {dictionary.nav_projects}
              </Link>
              <Link
                href={`/${lang}/#about`}
                className="text-muted-foreground hover:text-foreground text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {dictionary.nav_about}
              </Link>
              <Link
                href={`/${lang}/contacto`}
                className="text-muted-foreground hover:text-foreground text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {dictionary.nav_contact}
              </Link>
            </nav>
          </m.div>

          <m.div
            variants={footerItemVariants}
            className="flex flex-col items-center md:items-end space-y-6"
          >
            {/* Componente Modular Inyectado para unificar el diseño */}
            <SocialLinks className="gap-6" />

            <m.button
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-mono hover:bg-primary/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowUp size={16} /> {dictionary.back_to_top}
            </m.button>
          </m.div>
        </div>

        <m.div
          variants={footerItemVariants}
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-muted-foreground"
        >
          <p>
            © {new Date().getFullYear()} Bryan Zavala.{" "}
            {dictionary.copyright_rights}
          </p>
          <p className="flex items-center gap-1.5">{dictionary.built_in}</p>
        </m.div>
      </div>
    </m.footer>
  );
}
