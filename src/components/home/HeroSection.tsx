"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { m, useInView, useReducedMotion } from "framer-motion";
import { Terminal, Sparkles, ChevronDown } from "lucide-react";
import { AnimatedSplitTitle } from "@/components/ui/AnimatedSplitTitle";
import { SocialLinks } from "@/components/ui/SocialLinks";

interface HeroDictionary {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  stack: string;
  description: string;
  cta_button: string;
}

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
      className="relative flex min-h-screen items-center justify-center px-6 py-20 pointer-events-none md:px-12 lg:px-24"
    >
      {/* 🚨 CAMBIO AQUÍ: Opacidad subida al 90% (bg-background/90) y sombra ajustada para modo claro */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 overflow-hidden rounded-[2.5rem] border border-black/[0.05] dark:border-border bg-background/90 p-8 text-center shadow-2xl backdrop-blur-2xl pointer-events-auto md:p-16">
        <m.div
          animate={shouldAnimateLoops ? { y: [0, -5, 0] } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-foreground/5 border border-primary/20 dark:border-border text-primary text-sm font-medium tracking-widest uppercase"
        >
          <Sparkles className="h-3 w-3 fill-primary" /> {dictionary.badge}
        </m.div>

        {/* 🚨 CAMBIO AQUÍ: El título principal ahora usa card-hero-title para que cambie de color automáticamente */}
        <AnimatedSplitTitle
          as="h1"
          line1={dictionary.title1}
          line2={dictionary.title2}
          viewportAmount={0.35}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
          line1ClassName="text-card-hero-title"
          line2ClassName="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-cyan-600 dark:via-purple-400 dark:to-cyan-400"
        />

        <div className="w-full flex flex-col items-center">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            /* 🚨 CAMBIO AQUÍ: Texto del párrafo adaptado para ser visible sobre fondo claro */
            className="mt-4 text-xl md:text-2xl dark:text-white/90 text-black/80 max-w-xl font-medium leading-relaxed"
          >
            {dictionary.subtitle}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-cyan-600 dark:via-purple-400 dark:to-cyan-400 font-bold">
              {dictionary.stack}
            </span>{" "}
            {dictionary.description}
          </m.p>

          <m.div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <a href="#proyectos">
              <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-2xl bg-primary text-white shadow-xl dark:shadow-[0_0_20px_rgba(120,0,255,0.4)] border-none"
                >
                  <Terminal className="mr-3 h-5 w-5" /> {dictionary.cta_button}
                </Button>
              </m.div>
            </a>
          </m.div>

          <m.div className="mt-6 flex w-full justify-center border-t border-border pt-8">
            <SocialLinks />
          </m.div>
        </div>
      </div>

      <m.div
        animate={
          shouldAnimateLoops
            ? { y: [0, 15, 0], opacity: [0.3, 1, 0.3] }
            : undefined
        }
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue-600 dark:text-blue-400 z-10"
      >
        <ChevronDown className="h-14 w-14" />
      </m.div>
    </section>
  );
}
