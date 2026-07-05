"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  m,
  useInView,
  useReducedMotion,
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
  frontend: string;
  backend: string;
  fullStack: string;
  cta: string;
  cta_subtitle: string;
  cta_button: string;
}

type ProjectCategory = "frontend" | "backend" | "fullStack";

type GroupedProjects = Record<ProjectCategory, Project[]>;

const SECTION_STAGE_CLASS =
  "flex h-[500px] md:h-[580px] lg:h-[620px] w-full items-center justify-center";

const EMPTY_STATE_CLASS =
  `${SECTION_STAGE_CLASS} rounded-2xl border border-dashed border-border bg-card/60`;

const SECTION_HEADER_CLASS =
  "mb-5 md:mb-6 flex items-end justify-between gap-4 border-b border-primary/20 pb-3 md:pb-4";

const SECTION_GRID_CLASS =
  "grid grid-cols-1 gap-20 md:grid-cols-2 xl:grid-cols-3";

function SectionEmptyState({ message }: { message: string }) {
  return (
    <div className={EMPTY_STATE_CLASS}>
      <p className="text-base font-mono text-muted-foreground">{message}</p>
    </div>
  );
}

function getProjectCategory(project: Project): ProjectCategory {
  const normalizedStack = project.techStack.map((tech) => tech.toLowerCase());

  const hasFrontend = normalizedStack.some((tech) =>
    /(react|next|angular|html|css|tailwind|framer|javascript|typescript)/.test(
      tech,
    ),
  );

  const hasBackend = normalizedStack.some((tech) =>
    /(node|express|postgres|mysql|mongo|mongodb|supabase|firebase)/.test(tech),
  );

  if (hasFrontend && hasBackend) return "fullStack";
  if (hasBackend) return "backend";
  return "frontend";
}

function groupProjects(projects: Project[]): GroupedProjects {
  return projects.reduce<GroupedProjects>(
    (groups, project) => {
      const category = getProjectCategory(project);
      groups[category].push(project);
      return groups;
    },
    {
      frontend: [],
      backend: [],
      fullStack: [],
    },
  );
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

  const headingReveal = getInViewReveal({
    shouldReduceMotion,
    duration: 0.5,
    y: 24,
  });

  const groupedProjects = groupProjects(projects);
  const sections: Array<{ key: ProjectCategory; title: string }> = [
    { key: "frontend", title: dictionary.frontend },
    { key: "backend", title: dictionary.backend },
    { key: "fullStack", title: dictionary.fullStack },
  ];

  return (
    <section
      ref={targetRef}
      id="proyectos"
      className="relative bg-transparent z-10 pointer-events-none"
    >
      <div className="flex flex-col gap-12 md:gap-16 pointer-events-none pt-4 md:pt-8 pb-4">
        <m.div
          aria-hidden="true"
          style={{
            scaleX: shouldReduceMotion ? 0 : 1,
            opacity: shouldReduceMotion ? 0 : isInView ? 1 : 0.85,
          }}
          className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left z-[100] pointer-events-none"
        />

        <div className="w-full px-[10vw] shrink-0 z-20 mb-2 md:mb-4 mt-2 md:mt-0">
          <AnimatedSplitTitle
            as="h2"
            line1={dictionary.title1}
            line2={dictionary.title2}
            viewportAmount={0.35}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter italic text-projects-heading drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            line2ClassName="text-not-italic"
          />
          <m.p
            initial={headingReveal.initial}
            whileInView={headingReveal.whileInView}
            viewport={{ once: false }}
            transition={headingReveal.transition}
            className="mt-2 md:mt-3 text-lg md:text-xl lg:text-2xl font-semibold text-projects-subtitle max-w-3xl"
          >
            {dictionary.subtitle}
          </m.p>
        </div>

        <div>
          {projects.length === 0 ? (
            <SectionEmptyState message="Esperando datos..." />
          ) : (
            <>
              {sections.map((section) => {
                const sectionProjects = groupedProjects[section.key];

                return (
                  <section key={section.key} className="pointer-events-auto">
                    <div className={SECTION_HEADER_CLASS}>
                      <div>
                       
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-projects-heading drop-shadow-[0_8px_22px_rgba(0,0,0,0.28)] uppercase">
                          {section.title}
                        </h3>
                      </div>
                  
                    </div>

                    <div className={SECTION_GRID_CLASS}>
                      {sectionProjects.length === 0 ? (
                        <SectionEmptyState message="Sin proyectos en esta categoría." />
                      ) : (
                        sectionProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            title={project.title}
                            description={project.description}
                            imageUrl={project.imageUrl}
                            techStack={project.techStack}
                            liveUrl={project.liveUrl}
                            githubUrl={project.githubUrl}
                          />
                        ))
                      )}
                    </div>
                  </section>
                );
              })}

              <div className={`${SECTION_STAGE_CLASS} pointer-events-auto`}>
                <FinalCTA dictionary={dictionary} lang={lang ?? "es"} />
              </div>
            </>
          )}
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
          className="flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-xl font-medium text-white shadow-xl outline-none"
        >
          <Send className="w-6 h-6" />
          {dictionary.cta_button}
        </m.button>
      </Link>
    </div>
  );
}
