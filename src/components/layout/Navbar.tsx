"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";
import {
  User,
  Mail,
  LogIn,
  Briefcase,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isMounted, setIsMounted] = useState(false);

  // QUE HACE: Obtiene la ruta actual (ej: "/es/proyectos") del navegador.
  // POR QUE SE ELIGIO: Permite al cliente saber el idioma actual sin depender de props del servidor.
  const pathname = usePathname();
  // Extraemos el primer segmento ("/es" -> "es"). Fallback a "es" por seguridad.
  const currentLang = pathname?.split("/")[1] || "es";

  const navVariants = {
    hidden: { opacity: 0, y: -24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <m.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-5 pointer-events-none"
    >
      <m.div
        variants={navItemVariants}
        className="pointer-events-auto outline-none rounded-sm"
      >
        {/* QUE HACE: El link ahora apunta dinámicamente a la raíz del idioma actual */}
        <Link
          href={`/${currentLang}`}
          className="text-2xl font-black tracking-tighter text-foreground hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          ZAVALA<span className="text-primary">.</span>
        </Link>
      </m.div>

      <m.div
        variants={navItemVariants}
        className="pointer-events-auto flex items-center gap-2 md:gap-6 bg-background/70 border border-border backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.25)]"
      >
        <m.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}>
          {/* QUE HACE: Actualizamos los hrefs para respetar el idioma en las anclas */}
          <Link
            href={`/${currentLang}/#about`}
            aria-label="Ir a sección Sobre Mí"
            className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <User className="w-4 h-4" />{" "}
            <span className="hidden md:inline">About</span>
          </Link>
        </m.div>

        <div className="w-px h-4 bg-border hidden md:block"></div>

        <m.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}>
          <Link
            href={`/${currentLang}/#proyectos`}
            aria-label="Ir a sección de proyectos"
            className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <Briefcase className="w-4 h-4" />{" "}
            <span className="hidden md:inline">Projects</span>
          </Link>
        </m.div>

        <div className="w-px h-4 bg-border hidden md:block"></div>

        <m.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}>
          <Link
            href={`/${currentLang}/contacto`}
            aria-label="Ir a página de contacto"
            className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <Mail className="w-4 h-4" />{" "}
            <span className="hidden md:inline">Contact</span>
          </Link>
        </m.div>

        <div className="w-px h-4 bg-border hidden md:block"></div>

        {!isLoggedIn ? (
          <>
            <div className="w-px h-4 bg-border hidden md:block"></div>
            <m.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            >
              <Link
                href={`/${currentLang}/login`}
                aria-label="Ir al login"
                className="flex items-center gap-2 text-base font-medium text-primary hover:text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Login</span>
              </Link>
            </m.div>
          </>
        ) : null}

        {isLoggedIn ? (
          <>
            <div className="w-px h-4 bg-border hidden md:block"></div>
            <m.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            >
              <Link
                href={`/${currentLang}/dashboard`}
                aria-label="Ir al panel de administración"
                className="flex items-center gap-2 text-base font-medium text-primary hover:text-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Panel</span>
              </Link>
            </m.div>
          </>
        ) : null}

        <div className="w-px h-4 bg-border hidden md:block"></div>

        {/*  BOTÓN DE IDIOMAS --- */}
        <LanguageSwitcher currentLang={currentLang} />

        {/* --- BOTÓN DE TEMA  --- */}
        <m.button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.09, rotate: 8 }
          }
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/10 hover:bg-foreground/20 border border-border outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {!isMounted ? (
            <div className="w-4 h-4 opacity-0" />
          ) : isDark ? (
            <Sun className="w-4 h-4 text-yellow-300" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </m.button>
      </m.div>
    </m.nav>
  );
}
