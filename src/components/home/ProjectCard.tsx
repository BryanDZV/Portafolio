"use client";

import { useMemo } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Code2, ExternalLink, Terminal } from "lucide-react";
import { use3DTilt } from "@/hooks/use3DTilt";
import { IconBrandGithub } from "@tabler/icons-react";
import { getTechIcon, ResolvedTechBadge, TechIconGlyph } from "@/lib/tech-icons";


type ProjectCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  techStack?: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
};
const CARD_PERSPECTIVE_CLASS =
  "w-full h-full flex justify-center pointer-events-auto [perspective:1200px]";

const CARD_SURFACE_CLASS =
  "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-black/[0.1] bg-white/0 p-4 shadow-2xl transition-colors duration-300 dark:border-border dark:bg-card/0  sm:p-5 md:p-6 lg:p-7";

const CARD_HEADER_CLASS = "shrink-0";

const CARD_TITLE_CLASS =
  "flex items-center gap-2 text-2xl font-bold tracking-tight text-card-project-title md:text-3xl";

const CARD_TITLE_ICON_CLASS = "h-5 w-5 text-primary md:h-6 md:w-6";

const CARD_DESCRIPTION_CLASS =
  "mt-2 line-clamp-3 text-base font-medium text-black/70 dark:text-white/80 md:mt-3 md:text-lg";

const CARD_IMAGE_CLASS =
  "relative mt-4 aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-[16/9] md:mt-5";

const CARD_BADGES_CLASS = "mt-4 flex shrink-0 flex-wrap gap-2";

const CARD_BADGE_CLASS =
  "inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold font-mono text-primary shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-white sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]";

const CARD_BADGE_ICON_CLASS = "h-3 w-3 sm:h-4.5 sm:w-5.5";

const CARD_ACTIONS_CLASS =
  "mt-4 flex shrink-0 items-center justify-between border-t border-border pt-4";

const CARD_LINK_CLASS =
  "group flex items-center gap-2 text-sm font-mono text-black underline decoration-transparent underline-offset-4 transition-all hover:text-cyan-500 dark:text-white dark:hover:text-cyan-400 md:gap-2.5 md:text-base";

const CARD_DEMO_LINK_CLASS =
  "group flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold font-mono text-white shadow-lg transition-all hover:bg-primary/90 md:gap-2.5 md:text-base hover:text-cyan-500";

export function ProjectCard({
  title,
  description,
  imageUrl,
  techStack = [],
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = use3DTilt();

  const resolvedTechBadges: ResolvedTechBadge[] = useMemo(
    () =>
      techStack.map((tech, index) => ({
        key: `${tech}-${index}`,
        label: tech,
        icon: getTechIcon(tech),
      })),
    [techStack],
  );

  return (
    <div className={CARD_PERSPECTIVE_CLASS}>
      <m.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        // style={{
        //   rotateX,
        //   rotateY,
        //   transformStyle: "preserve-3d",
        //   willChange: "transform",
        // }}
        className={CARD_SURFACE_CLASS}
      >
        <div
          style={{ transform: "translateZ(40px)" }}
          className={CARD_HEADER_CLASS}
        >
          <h3 className={CARD_TITLE_CLASS}>
            <Terminal className={CARD_TITLE_ICON_CLASS} /> {title}
          </h3>
          
        </div>

        {/* ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{ scale: 1.02 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform", */}

        <m.div
         
          whileHover={{ scale: 1.01, y: -15}}
          transition={{ type: "spring", stiffness: 320 }}
          className={CARD_IMAGE_CLASS}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 460px, 520px"
              className="object-cover border border-black/5 shadow-lg dark:border-border"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-border bg-secondary/50">
              <span className="font-mono text-sm text-muted-foreground">
                Sin imagen
              </span>
            </div>
          )}
        </m.div>
        {/* <div><p className={CARD_DESCRIPTION_CLASS}>{description}</p></div> */}

        <div
          style={{ transform: "translateZ(60px)" }}
          className={CARD_BADGES_CLASS}
        >
          
          {resolvedTechBadges.map((badge) => (
            <span key={badge.key} className={CARD_BADGE_CLASS}>
              {badge.icon ? (
                <TechIconGlyph
                  icon={badge.icon}
                  className={CARD_BADGE_ICON_CLASS}
                />
              ) : (
                <Code2 className={CARD_BADGE_ICON_CLASS} />
              )}
              {badge.label}
            </span>
          ))}
        </div>

        <div
          style={{ transform: "translateZ(40px)" }}
          className={CARD_ACTIONS_CLASS}
        >
          {githubUrl ? (
            <m.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              whileHover={{ scale: 1.30 }}
              whileTap={{ scale: 0.95 }}
              className={CARD_LINK_CLASS}
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
              whileHover={{ scale: 1.35 }}
              whileTap={{ scale: 0.95 }}
              className={CARD_DEMO_LINK_CLASS}
            >
              <ExternalLink size={14} /> Demo Web
            </m.a>
          ) : null}
        </div>
      </m.div>
    </div>
  );
}
