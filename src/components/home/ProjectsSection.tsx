"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { AnimatedSplitTitle } from "@/components/ui/AnimatedSplitTitle";
import { getInViewReveal, STANDARD_EASE } from "@/components/ui/motion-presets";
import type { Project } from "@/types/Project";
import { Send } from "lucide-react";

// QUE HACE: Define la estructura estricta del JSON que esperamos recibir del servidor para esta sección.
interface ProjectsDictionary {
  title1: string;
  title2: string;
  subtitle: string;
  cta: string;
  cta_subtitle: string;
  cta_button: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  dictionary: ProjectsDictionary;
}

export function ProjectsSection({
  projects,
  dictionary,
}: ProjectsSectionProps) {
  const { lang } = useParams<{ lang: string }>();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const targetRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(targetRef, { amount: 0.05 });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["calc(0% + 0vw)", "calc(-100% + 100vw)"],
  );

  const progressScaleX = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 180,
    mass: 0.2,
  });

  const headingReveal = getInViewReveal({
    shouldReduceMotion,
    duration: 0.5,
    y: 24,
  });

  return (
    <section
      ref={targetRef}
      id="proyectos"
      className="relative h-[600vh] bg-transparent z-10 pointer-events-none"
    >
      <div className="sticky top-0 flex flex-col h-[100dvh] overflow-hidden pointer-events-none pt-4 md:pt-8 pb-4">
        {/* Barra de progreso de scroll */}
        <m.div
          aria-hidden="true"
          style={{
            scaleX: shouldReduceMotion ? 0 : progressScaleX,
            opacity: shouldReduceMotion ? 0 : isInView ? 1 : 0,
          }}
          className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left z-[100] pointer-events-none"
        />

        {/* 
           el título "Projects" y el subtítulo */}
        <div className="w-full px-[10vw] shrink-0 z-20 mb-4 md:mb-6 mt-2 md:mt-0">
          <AnimatedSplitTitle
            as="h2"
            line1={dictionary.title1}
            line2={dictionary.title2}
            viewportAmount={0.35}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter italic text-projects-heading drop-shadow-xl"
            line2ClassName="text-not-italic"
          />
          <m.p
            initial={headingReveal.initial}
            whileInView={headingReveal.whileInView}
            viewport={{ once: false }}
            transition={headingReveal.transition}
            className="mt-1 md:mt-2 text-lg md:text-xl lg:text-2xl font-light text-projects-subtitle"
          >
            {dictionary.subtitle}
          </m.p>
        </div>

        {/* Contenedor de la pista de scroll horizontal */}
        <div className="w-full flex-1 min-h-0 flex flex-col relative z-30 pt-2 md:pt-4 pb-4">
          <m.div
            style={{ x: shouldReduceMotion ? "0%" : x }}
            className="flex w-max h-full items-start gap-12 md:gap-16 lg:gap-20 px-[10vw]"
          >
            {projects.length === 0 ? (
              <div className="flex h-[500px] md:h-[580px] lg:h-[620px] w-[600px] items-center justify-center rounded-2xl border border-dashed border-border bg-card/60">
                <p className="text-base font-mono text-muted-foreground">
                  Esperando datos...
                </p>
              </div>
            ) : (
              <>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="w-[480px] md:w-[600px] h-[500px] md:h-[580px] lg:h-[620px] flex flex-col shrink-0 pointer-events-auto"
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      imageUrl={project.imageUrl}
                      techStack={project.techStack}
                      liveUrl={project.liveUrl}
                      githubUrl={project.githubUrl}
                    />
                  </div>
                ))}

                {/* Elemento final para cerrar el scroll */}
                <div className="w-[100dvw] flex items-center justify-center h-[500px] md:h-[580px] lg:h-[620px] pointer-events-auto px-[10vw]">
                  <FinalCTA dictionary={dictionary} lang={lang ?? "es"} />
                </div>
              </>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({
  dictionary,
  lang,
}: {
  dictionary: ProjectsDictionary;
  lang: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* "Hablemos"  */}
      <AnimatedSplitTitle
        as="h2"
        line1={dictionary.cta}
        loop={true}
        loopDelayMs={1000}
        viewportAmount={0.01}
        className="text-[18vw] md:text-9xl lg:text-[10rem] font-black tracking-tighter text-projects-heading mb-6 whitespace-nowrap uppercase"
        line1ClassName="text-projects-heading"
      />

      <p className="mt-6 text-xl md:text-2xl font-extrabold text-projects-subtitle max-w-2xl px-4 whitespace-normal">
        {dictionary.cta_subtitle}
      </p>

      <Link href={`/${lang}/contacto`} className="mt-12 focus:outline-none">
        <m.button
          whileHover={{
            scale: 1.05,
            rotate: 2,
            backgroundColor: "var(--primary)",
          }}
          whileTap={{
            scale: 0.95,
            rotate: -2,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
            ease: STANDARD_EASE,
          }}
          //bg-primary para que el botón destaque sobre el fondo gris claro
          className="px-10 py-5 bg-primary text-white font-medium rounded-2xl flex items-center gap-3 text-xl shadow-xl outline-none"
        >
          <Send className="w-6 h-6" />
          {dictionary.cta_button}
        </m.button>
      </Link>
    </div>
  );
}
