"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { m, useInView, useReducedMotion } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";
import { AnimatedSplitTitle } from "@/components/ui/AnimatedSplitTitle";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { HeroDictionary } from "@/types/HeroDictionary";

export function HeroSection({ dictionary }: { dictionary: HeroDictionary }) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionInView = useInView(sectionRef, { amount: 0.2, once: false });
  const shouldAnimateLoops = !shouldReduceMotion && sectionInView;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-6 py-20 md:px-12 lg:px-24"
    >
      {/* ========= NUEVO: grid 2 columnas ========= */}
      <div className="z-10 grid w-full max-w-8xl items-center gap-20 md:grid-cols-2 pointer-events-auto">
        {/* ===== COLUMNA IZQUIERDA: TEXTO ===== */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-10">
          {/* Badge */}
          <m.div
            animate={shouldAnimateLoops ? { y: [0, -5, 0] } : undefined}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-foreground/5 border border-primary/20 dark:border-border text-primary text-sm font-medium tracking-widest uppercase"
          >
            <Sparkles className="h-3 w-3 fill-primary" /> {dictionary.badge}
          </m.div>

          {/* Título */}
          <AnimatedSplitTitle
            as="h1"
            line1={dictionary.title1}
            line2={dictionary.title2}
            viewportAmount={0.35}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
            line1ClassName="text-foreground"
            line2ClassName="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-cyan-600 dark:via-purple-400 dark:to-cyan-400"
          />

          {/* Subtítulo + descripción */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-xl md:text-2xl text-foreground/80 max-w-xl font-medium leading-relaxed"
          >
            {dictionary.subtitle}. {dictionary.description}
          </m.p>

          {/* Botón CTA */}
          <a href="#proyectos">
            <Button
              size="lg"
              className="h-14 px-10 rounded-2xl bg-primary text-white shadow-xl border-none"
            >
              <Terminal className="mr-3 h-5 w-5" /> {dictionary.cta_button}
            </Button>
          </a>

          {/* Social Links*/}
          <SocialLinks />
        </div>

        {/* ===== COLUMNA DERECHA: AVATAR ===== */}
        <div className="flex justify-center">
          <div className="relative w-[70%] max-w  rounded-full p-[4px] bg-gradient-to-br from-primary via-purple-500 to-cyan-500 ">
            <div className="w-full h-full rounded-full overflow-hidden bg-background">
              <video
                src="/avatar.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        </div>
      </div>
      {/* Chevron*/}
      {/* <m.div
      animate={shouldAnimateLoops ? { y: [0, 15, 0], opacity: [0.3, 1, 0.3] } : undefined}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue-600 dark:text-blue-400 z-10"
    >
      <ChevronDown className="h-14 w-14" />
    </m.div> */}
    </section>
  );
}
