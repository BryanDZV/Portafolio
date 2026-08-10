"use client";

import { m, useReducedMotion } from "framer-motion";
import { TECH_STACK, TechIconGlyph } from "@/lib/tech-icons";

export function TechCarousel() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const duplicatedStack = [...TECH_STACK, ...TECH_STACK];

  return (
    <section className="relative w-full overflow-hidden py-10">
      <m.div
        animate={
          shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }
        }
        transition={{
          repeat: Infinity,
          duration: 50,
          ease: "linear",
        }}
        className="flex w-max gap-14 px-90 "
      >
        {duplicatedStack.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex shrink-0 items-center gap-2.5 text-muted-foreground"
          >
            <TechIconGlyph icon={tech.icon} className="h-6 w-6" />
            <span className="text-sm font-mono font-medium whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </m.div>
    </section>
  );
}
