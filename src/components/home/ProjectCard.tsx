"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Code2, ExternalLink, Terminal } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import {
  siAngular,
  siCss,
  siExpress,
  siFirebase,
  siFramer,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { use3DTilt } from "@/hooks/use3DTilt";

type ProjectCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  techStack?: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
};

const TECH_ICON_MAP: Array<{ match: RegExp; icon: SimpleIcon }> = [
  { match: /next/, icon: siNextdotjs },
  { match: /react/, icon: siReact },
  { match: /angular/, icon: siAngular },
  { match: /node|node\.js/, icon: siNodedotjs },
  { match: /express/, icon: siExpress },
  { match: /typescript|ts\b/, icon: siTypescript },
  { match: /javascript|js\b/, icon: siJavascript },
  { match: /tailwind/, icon: siTailwindcss },
  { match: /framer/, icon: siFramer },
  { match: /postgres|postgresql/, icon: siPostgresql },
  { match: /mysql/, icon: siMysql },
  { match: /mongo|mongodb/, icon: siMongodb },
  { match: /supabase/, icon: siSupabase },
  { match: /firebase/, icon: siFirebase },
  { match: /html/, icon: siHtml5 },
  { match: /css/, icon: siCss },
];

function getTechIcon(tech: string): SimpleIcon | null {
  const normalizedTech = tech.toLowerCase();
  const match = TECH_ICON_MAP.find((item) => item.match.test(normalizedTech));
  return match?.icon ?? null;
}

interface ResolvedTechBadge {
  key: string;
  label: string;
  icon: SimpleIcon | null;
}

function TechIconGlyph({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}

const ProjectCardComponent = ({
  title,
  description,
  imageUrl,
  techStack = [],
  liveUrl,
  githubUrl,
}: ProjectCardProps) => {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = use3DTilt();

  const resolvedTechBadges = useMemo<ResolvedTechBadge[]>(
    () =>
      techStack.map((tech, index) => ({
        key: `${tech}-${index}`,
        label: tech,
        icon: getTechIcon(tech),
      })),
    [techStack],
  );

  return (
    <div className="w-full h-full flex justify-center pointer-events-auto [perspective:1200px]">
      <m.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{ scale: 1.02 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        /* 
           para que el fondo sea más sólido y el texto no se pierda con las partículas. transtion all quitar par moviento fluiod de card 3d */
        className="relative flex flex-col h-full w-full max-w-[28.75rem] dark:bg-card/60 bg-white/90 border dark:border-border border-black/[0.1] rounded-xl p-4 md:p-6 lg:p-7 shadow-2xl transition-colors duration-300 group"
      >
        <div style={{ transform: "translateZ(40px)" }} className="shrink-0">
          {/* variable card-project-title para que el título cambie de color */}
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-card-project-title flex items-center gap-2">
            <Terminal className="text-primary w-5 h-5 md:w-6 md:h-6" /> {title}
          </h3>
          {/* Texto descriptivo con color adaptable */}
          <p className="dark:text-white/80 text-black/70 text-base md:text-lg mt-2 md:mt-3 line-clamp-3 font-medium">
            {description}
          </p>
        </div>

        <div
          style={{ transform: "translateZ(80px)" }}
          className="w-full mt-3 md:mt-4 relative aspect-[16/10] md:aspect-[16/9] max-h-[220px] md:max-h-[300px] shrink-0 overflow-hidden rounded-xl"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 460px, 520px"
              className="object-cover shadow-lg border border-black/5 dark:border-border"
            />
          ) : (
            <div className="w-full h-full bg-secondary/50 flex items-center justify-center border border-border rounded-xl">
              <span className="text-muted-foreground font-mono text-sm">
                Sin imagen
              </span>
            </div>
          )}
        </div>

        <div
          style={{ transform: "translateZ(60px)" }}
          className="mt-3 md:mt-4 flex flex-wrap gap-1.5 md:gap-2 shrink-0"
        >
          {resolvedTechBadges.map((badge) => (
            <span
              key={badge.key}
              className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 md:py-1.5 text-[9.5px] md:text-[11px] font-bold font-mono dark:text-white text-primary dark:bg-black/40 bg-primary/10 border border-primary/20 dark:border-white/10 rounded-md shadow-sm"
            >
              {badge.icon ? (
                <TechIconGlyph
                  icon={badge.icon}
                  className="h-3 w-3 md:h-3.5 md:w-3.5"
                />
              ) : (
                <Code2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
              )}
              {badge.label}
            </span>
          ))}
        </div>

        <div
          style={{ transform: "translateZ(40px)" }}
          className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-border shrink-0"
        >
          {githubUrl ? (
            <m.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 md:gap-2.5 text-sm md:text-base font-mono dark:text-white text-black underline decoration-transparent underline-offset-4 transition-all hover:text-cyan-500 dark:hover:text-cyan-400"
            >
              <IconBrandGithub size={16} /> Ver Código
            </m.a>
          ) : (
            <span />
          )}

          {liveUrl ? (
            <m.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 md:gap-2.5 text-sm md:text-base font-bold font-mono text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-all shadow-lg"
            >
              <ExternalLink size={14} /> Demo Web
            </m.a>
          ) : null}
        </div>
      </m.div>
    </div>
  );
};

export const ProjectCard = memo(ProjectCardComponent);
ProjectCard.displayName = "ProjectCard";
